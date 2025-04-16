const Charging = require("../models/chargingModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const Wallet = require("../models/walletUserModel");

exports.getUserByMobile = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).send({ message: "Mobile number is required" });
  }

  try {
    const user = await User.findOne({ where: { mobile } });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ message: "Server error", error });
  }
};

exports.getWalletBalance = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res
      .status(400)
      .send({ message: "User ID is missing or incorrect data" });
  }

  const wallet = await Wallet.findOne({ where: { userId } });

  if (!wallet) {
    return res.status(404).send({ message: "Wallet not found" });
  }

  return res.status(200).send({ balance: wallet.balance });
};

exports.getTransactionById = async (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).send({ message: "Transaction ID is required" });
  }

  try {
    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).send({ message: "Transaction not found" });
    }

    return res.status(200).send(transaction);
  } catch (error) {
    return res.status(500).send({ message: "Server error", error });
  }
};

exports.getChargingHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res
        .status(400)
        .send({ message: "User ID is missing or incorrect data" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const chargingHistory = await Charging.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).send(chargingHistory);
  } catch (error) {
    return res.status(500).send({ message: "Server error", error });
  }
};
