const express = require("express");
const router = express.Router();
const walletCompanyController = require("../controllers/walletCompanyController");
const authController = require("../controllers/authController");

router
  .route("/getCompanyById")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    walletCompanyController.getCompanyById
  );

router
  .route("/getWalletBalance")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    walletCompanyController.getWalletBalance
  );

router
  .route("/getTransactionById")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    walletCompanyController.getTransactionById
  );

module.exports = router;
