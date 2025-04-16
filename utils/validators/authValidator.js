const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
const User = require("../../models/userModel");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      if (!val) {
        throw new Error("Invalid name value");
      }
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),

  check("mobile")
    .notEmpty()
    .withMessage("mobile required")
    .isMobilePhone(["ar-EG", "ar-PS"])
    .withMessage("Invalid Phone")
    .custom(async (value) => {
      const user = await User.findOne({ where: { mobile: value } });
      if (user) {
        throw new Error("mobile already in use");
      }
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val) => {
      const existingUser = await User.findOne({ where: { email: val } });
      if (existingUser) {
        return Promise.reject(new Error("E-mail already in use"));
      }
    }),

  check("nationalId")
    .notEmpty()
    .withMessage("nationalId required")
    .isLength({ min: 5 })
    .withMessage("Too short nationalId")
    .custom(async (value) => {
      const user = await User.findOne({ where: { nationalId: value } });
      if (user) {
        throw new Error("NationalId already in use");
      }
    }),

  check("gender").notEmpty().withMessage("gender required "),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (!req.body.passwordConfirm) {
        throw new Error("Password confirmation required");
      }
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  validatorMiddleware,
];

exports.loginValidator = [
  check("mobile")
    .notEmpty()
    .withMessage("mobile required")
    .isMobilePhone(["ar-EG", "ar-PS"]),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validatorMiddleware,
];
