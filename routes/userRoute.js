const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

router
  .route("/getMe")
  .get(
    authController.protect,
    userController.getLoggedUserData,
    userController.getUser
  );

router
  .route("/changeMyPassword")
  .put(authController.protect, userController.updateLoggedPassword);

router
  .route("/updateMe")
  .put(
    authController.protect,
    updateLoggedUserValidator,
    userController.updateLoggedUserData,
    userController.updateUser
  );

router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    userController.getAllUsers
  )
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    createUserValidator,
    userController.createUser
  );

router
  .route("/:id")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    getUserValidator,
    userController.getUser
  )
  .put(
    authController.protect,
    authController.allowedTo("admin"),
    updateUserValidator,
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    userController.deleteUser
  );

module.exports = router;
