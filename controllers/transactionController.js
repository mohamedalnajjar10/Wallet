const { Sequelize } = require("sequelize");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const connection = require("../config/database");
const ChargingPoint = require("../models/chargingPointModel");
const Charging = require("../models/chargingModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { Op } = require("sequelize");
const Wallet = require("../models/walletUserModel");

exports.transferMoney = async (req, res) => {
  let transferTransaction;
  try {
    transferTransaction = await connection.transaction();

    const { senderId, receiverId, amount } = req.body;
    if (!senderId || !receiverId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Incorrect data" });
    }

    const sender = await User.findByPk(senderId, {
      transaction: transferTransaction,
      lock: true,
    });
    const receiver = await User.findByPk(receiverId, {
      transaction: transferTransaction,
      lock: true,
    });
    if (!sender || !receiver) {
      await transferTransaction.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    const senderWallet = await Wallet.findOne({
      where: { userId: senderId },
      transaction: transferTransaction,
      lock: true,
    });
    const receiverWallet = await Wallet.findOne({
      where: { userId: receiverId },
      transaction: transferTransaction,
      lock: true,
    });

    if (!senderWallet || !receiverWallet) {
      await transferTransaction.rollback();
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (parseFloat(senderWallet.balance) < parseFloat(amount)) {
      await transferTransaction.rollback();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const hashedCode = crypto
      .createHash("sha256")
      .update(verificationCode)
      .digest("hex");

    sender.transferVerificationCode = hashedCode;
    sender.transferVerificationExpires = Date.now() + 10 * 60 * 1000;
    sender.transferVerificationVerified = false;

    await sender.save({ transaction: transferTransaction });

    try {
      await sendEmail({
        email: sender.email,
        subject: "Transfer Verification Code",
        message: `Your verification code is: ${verificationCode}`,
      });
      await transferTransaction.commit();
    } catch (err) {
      await transferTransaction.rollback();
      return res
        .status(500)
        .json({ message: "Error sending email", error: err });
    }

    return res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    if (transferTransaction) await transferTransaction.rollback();
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.verifyTransferMoney = async (req, res) => {
  let verifyTransaction;

  try {
    verifyTransaction = await connection.transaction();

    // ✅ استخراج القيم من `req.body`
    const { senderId, receiverId, amount, verificationCode } = req.body;

    // ✅ التحقق من القيم المطلوبة
    if (!senderId || !receiverId || !amount || !verificationCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("Received Data:", { senderId, receiverId, amount, verificationCode });

    // ✅ تشفير رمز التحقق
    const hashedCode = crypto.createHash("sha256").update(verificationCode.toString()).digest("hex");

    console.log("Hashed Code:", hashedCode);

    // ✅ البحث عن المستخدم (المرسل)
    const sender = await User.findOne({
      where: {
        id: senderId,
        transferVerificationCode: hashedCode,
        transferVerificationExpires: { [Op.gt]: Date.now() },
        transferVerificationVerified: false,
      },
      transaction: verifyTransaction,
      lock: true,
    });

    if (!sender) {
      await verifyTransaction.rollback();
      return res.status(400).json({ message: "Invalid verification code or expired" });
    }

    console.log("Sender Found:", sender.id);

    // ✅ تحديث بيانات المستخدم بعد التحقق
    sender.transferVerificationVerified = true;
    sender.transferVerificationCode = null;
    sender.transferVerificationExpires = null;
    await sender.save({ transaction: verifyTransaction });

    // ✅ البحث عن محافظ المرسل والمستلم
    const senderWallet = await Wallet.findOne({
      where: { userId: senderId },
      transaction: verifyTransaction,
      lock: true,
    });

    if (!senderWallet || senderWallet.balance < amount) {
      await verifyTransaction.rollback();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const receiverWallet = await Wallet.findOne({
      where: { userId: receiverId },
      transaction: verifyTransaction,
      lock: true,
    });

    if (!receiverWallet) {
      await verifyTransaction.rollback();
      return res.status(400).json({ message: "Receiver wallet not found" });
    }

    console.log("Sender & Receiver Wallets Found:", senderWallet.id, receiverWallet.id);

    // ✅ تحديث الأرصدة في `wallets`
    senderWallet.balance = parseFloat(senderWallet.balance) - parseFloat(amount);
    receiverWallet.balance = parseFloat(receiverWallet.balance) + parseFloat(amount);

    await senderWallet.save({ transaction: verifyTransaction });
    await receiverWallet.save({ transaction: verifyTransaction });

    // ✅ تحديث الأرصدة في `users`
    sender.balance = senderWallet.balance;
    const receiver = await User.findOne({ where: { id: receiverId }, transaction: verifyTransaction, lock: true });

    if (!receiver) {
      await verifyTransaction.rollback();
      return res.status(400).json({ message: "Receiver not found" });
    }

    receiver.balance = receiverWallet.balance;

    console.log("Updated Sender Balance:", sender.balance);
    console.log("Updated Receiver Balance:", receiver.balance);

    await sender.save({ transaction: verifyTransaction });
    await receiver.save({ transaction: verifyTransaction });

    // ✅ تسجيل المعاملات
    await Transaction.create(
      {
        userId: senderId,
        walletId: senderWallet.id,
        old_balance: parseFloat(senderWallet.balance) + parseFloat(amount),
        new_balance: senderWallet.balance,
        amount,
        date: new Date(),
        type: "payment",
        status: "completed",
      },
      { transaction: verifyTransaction }
    );

    await Transaction.create(
      {
        userId: receiverId,
        walletId: receiverWallet.id,
        old_balance: parseFloat(receiverWallet.balance) - parseFloat(amount),
        new_balance: receiverWallet.balance,
        amount,
        date: new Date(),
        type: "deposit",
        status: "completed",
      },
      { transaction: verifyTransaction }
    );

    // ✅ تأكيد المعاملة
    await verifyTransaction.commit();

    return res.status(200).json({ message: "Money transferred successfully" });
  } catch (error) {
    if (verifyTransaction) await verifyTransaction.rollback();
    console.error("Error in verifyTransferMoney:", error);

    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(400)
        .send({ message: "User ID is missing or incorrect data" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const transactions = await Transaction.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).send(transactions);
  } catch (error) {
    return res.status(500).send({ message: "Server error", error : error.stack });
  }
};

exports.chargeWallet = async (req, res) => {
  const chargeTransaction = await connection.transaction();
  try {
    const { userId, chargingPointId, amount } = req.body;

    if (!userId || !chargingPointId || !amount || amount <= 0) {
      return res.status(400).send({ message: "Incorrect data" });
    }

    const user = await User.findByPk(userId, {
      transaction: chargeTransaction,
      lock: Sequelize.Transaction.LOCK.UPDATE,
    });

    const chargingPoint = await ChargingPoint.findByPk(chargingPointId, {
      transaction: chargeTransaction,
    });

    const wallet = await Wallet.findOne({
      where: { userId },
      transaction: chargeTransaction,
      lock: Sequelize.Transaction.LOCK.UPDATE,
    });

    if (!user || !chargingPoint || !wallet) {
      await chargeTransaction.rollback();
      return res
        .status(404)
        .send({ message: "User, Charging Point, or Wallet not found" });
    }

    user.balance = parseFloat(user.balance) + parseFloat(amount);
    wallet.balance = parseFloat(wallet.balance) + parseFloat(amount);

    await user.save({ transaction: chargeTransaction });
    await wallet.save({ transaction: chargeTransaction });

    await Charging.create(
      {
        userId,
        chargingPointId,
        walletId: wallet.id, // Use wallet ID
        amount,
        date: new Date(),
        status: "completed",
      },
      { transaction: chargeTransaction }
    );

    await chargeTransaction.commit();
    return res.status(200).send({ message: "Wallet charged successfully." });
  } catch (error) {
    await chargeTransaction.rollback();
    return res.status(500).send({ message: "Server error", error });
  }
};


