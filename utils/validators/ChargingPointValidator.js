const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createChargingPointValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name required")
    .isLength({ min: 2 })
    .withMessage("Too short Charging Point name")
    .isLength({ max: 55 })
    .withMessage("Too long Charging Point name"),
  check("location")
    .trim()
    .notEmpty()
    .withMessage("Location required")
    .isLength({ min: 2 })
    .withMessage("Too short Location")
    .isLength({ max: 55 })
    .withMessage("Too long Location"),
  check("mobile")
    .notEmpty()
    .isMobilePhone(["ar-EG", "ar-PS"])
    .withMessage("Invalid Phone"),
  check("email").trim().optional().isEmail().withMessage("Invalid Email"),
  check("password").trim().optional().isLength({ min: 6 }),
  validatorMiddleware,
];
