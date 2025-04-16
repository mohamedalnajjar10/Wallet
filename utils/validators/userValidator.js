const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");
const slugify = require("slugify");

exports.createUserValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name required")
    .isLength({ min: 2 })
    .withMessage("Too short User name")
    .isLength({ max: 55 })
    .withMessage("Too long User name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value, { lower: true });
      return true;
    }),
  check("mobile")
    .notEmpty()
    .isMobilePhone(["ar-EG", "ar-PS"])
    .withMessage("Invalid Phone"),

  check("nationalId")
    .notEmpty()
    .withMessage("nationalId Requried ")
    .custom(async (value) => {
      const user = await User.findOne({ where: { nationalId: value } });
      if (user) {
        throw new Error("NationalId already in use");
      }
    }),

  check("gender").notEmpty().withMessage("Gender Requried "),

  check("email")
    .notEmpty()
    .withMessage("Email Requried")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error("Email already in use");
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 8 characters"),

  check("role").optional(),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isInt().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").trim().isInt().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (value) => {
      await User.findOne({ where: { email: value } }).then((User) => {
        if (User) {
          return Promise.reject(new Error("Email already in user"));
        }
      });
    }),

  check("nationalId")
    .optional()
    .custom(async (value) => {
      await User.findOne({ where: { nationalId: value } }).then((User) => {
        if (User) {
          return Promise.reject(new Error("nationalId already in user"));
        }
      });
    }),
  check("mobile")
    .optional()
    .isMobilePhone(["ar-EG", "ar-PS"])
    .withMessage("Invalid mobile"),

  check("role").optional(),
  validatorMiddleware,
];
exports.updateLoggedUserValidator = [
  body("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (value) => {
      await User.findOne({ where: { email: value } }).then((User) => {
        if (User) {
          return Promise.reject(new Error("Email already in user"));
        }
      });
    }),

  check("nationalId")
    .optional()
    .custom(async (value) => {
      await User.findOne({ where: { nationalId: value } }).then((User) => {
        if (User) {
          return Promise.reject(new Error("nationalId already in user"));
        }
      });
    }),

  check("mobile")
    .optional()
    .isMobilePhone(["ar-EG", "ar-PS"])
    .withMessage("Invalid mobile"),
  validatorMiddleware,
];
