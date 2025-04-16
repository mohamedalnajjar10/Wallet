const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");
const slugify = require("slugify");

exports.transferMoneyValidator = [
  check("senderId")
    .notEmpty()
    .withMessage("Sender ID is required")
    .isInt()
    .withMessage("Invalid Sender ID format"),
  check("receiverId")
    .notEmpty()
    .withMessage("Receiver ID is required")
    .isInt()
    .withMessage("Invalid Receiver ID format"),
  check("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      return true;
    }),
    check("walletId")
    .optional()
    .isInt().withMessage("Invalid Wallet ID format"),
  validatorMiddleware,
];
