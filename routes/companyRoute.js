const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");
const {
  showCompanyValidator,
} = require("../utils/validators/companyValidator");

router
  .route("/showCompany/:id")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    showCompanyValidator,
    companyController.showCompany
  );

router
  .route("/getAllCompanies")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    companyController.getAllCompanies
  );

router
  .route("/updateCompany/:id")
  .put(
    authController.protect,
    authController.allowedTo("admin", "user"),
    companyController.updateCompany
  );
  
  router
  .route("/deleteCompany/:id")
  .delete(
    authController.protect,
    authController.allowedTo("admin", "user"),
    companyController.deleteCompany
  );
  
module.exports = router;
