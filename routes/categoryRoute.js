const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authController = require("../controllers/authController");

router
  .route("/createCategory")
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    categoryController.createCategory
  );
router
  .route("/getCategories")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    categoryController.getAllCategories
  );
router
  .route("/getCategoryCompanies/:categoryId")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    categoryController.getCategotyCompanies
  );

router
  .route("/updateCategory/:id")
  .put(
    authController.protect,
    authController.allowedTo("admin", "user"),
    categoryController.updateCategory
  );
router
  .route("/deleteCategory/:id")
  .delete(
    authController.protect,
    authController.allowedTo("admin", "user"),
    categoryController.deleteCategory
  );
module.exports = router;
