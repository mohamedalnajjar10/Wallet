const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authController = require("../controllers/authController");
const {
  transferMoneyValidator,
} = require("../utils/validators/transactionValidator");

router
  .route("/transferMoney")
  .post(
    authController.protect,
    authController.allowedTo("user"),
    transferMoneyValidator,
    transactionController.transferMoney
  );
router
  .route("/getTransferVerificationCode")
  .post(
    authController.protect,
    authController.allowedTo("user"),
    transactionController.verifyTransferMoney
  );
router
  .route("/chargeWallet")
  .post(
    authController.protect,
    authController.allowedTo("user", "admin"),
    transactionController.chargeWallet
  );

router
  .route("/getTransactions")
  .get(
    authController.protect,
    authController.allowedTo("user", "admin"),
    transactionController.getTransactions
  );

module.exports = router;
