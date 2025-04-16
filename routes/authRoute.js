const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator.js");

router.route("/signup").post(signupValidator, authController.signup);

// router.route("/verifySignupCode").post(authController.verifySignupResetCode);

router.route("/login").post(loginValidator, authController.login);

router.route("/logout").post(authController.logout);

router.route("/forgetPassword").post(authController.forgetPassword);

router.route("/verifyResetCode").post(authController.verifyPassResetCode);

router.route("/resetPassword").put(authController.resetPassword);

module.exports = router;
