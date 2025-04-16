const express = require("express");
const router = express.Router();
const walletUserController = require("../controllers/walletUserController");
const authController = require("../controllers/authController");

router
  .route("/getChargingHistory")
  .get(
    authController.protect,
    authController.allowedTo("user", "admin"),
    walletUserController.getChargingHistory
  );

router
  .route("/getWalletBalance")
  .get(
    authController.protect,
    authController.allowedTo("user", "admin"),
    walletUserController.getWalletBalance
  );

router
  .route("/getUserByMobile")
  .get(
    authController.protect,
    authController.allowedTo("user", "admin"),
    walletUserController.getUserByMobile
  );

router
  .route("/getTransactionById")
  .get(
    authController.protect,
    authController.allowedTo("user", "admin"),
    walletUserController.getTransactionById
  );

module.exports = router;
