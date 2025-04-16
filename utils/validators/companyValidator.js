const { check , param } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Company = require("../../models/companyModel");

exports.createCompanyValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name required")
    .isLength({ min: 2 })
    .withMessage("Too short Company name")
    .isLength({ max: 55 })
    .withMessage("Too long Company name"),
  check("mobile")
    .notEmpty()
    .isMobilePhone(["ar-EG", "ar-PS"])
    .withMessage("Invalid Phone"),
  check("email").trim().optional().isEmail().withMessage("Invalid Email"),
  check("address")
    .trim()
    .optional()
    .isLength({ min: 2 })
    .withMessage("Too short Address")
    .isLength({ max: 55 })
    .withMessage("Too long Address"),
  check("categoryId").notEmpty().withMessage("Category ID required"),
  validatorMiddleware,
];

exports.showCompanyValidator = [
  param("id").isNumeric().withMessage("Invalid Company ID"),
  validatorMiddleware,
];
