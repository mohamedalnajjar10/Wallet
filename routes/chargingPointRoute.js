const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const chargingPointController = require("../controllers/chargingPointController");
const {
  createChargingPointValidator,
} = require("../utils/validators/chargingPointValidator");

router
  .route("/createChargingPoint")
  .post(
    authController.protect,
    authController.allowedTo("admin", "user"),
    createChargingPointValidator,
    chargingPointController.createChargingPoint
  );

router
  .route("/getChargingPoints")
  .get(
    authController.protect,
    authController.allowedTo("admin", "user"),
    chargingPointController.getChargingPoints
  );

router
  .route("/getChargingPointById/:id")
  .get(
    authController.protect,
    authController.allowedTo("admin", "user"),
    chargingPointController.getChargingPointById
  );

router
  .route("/updateChargingPoint/:id")
  .put(
    authController.protect,
    authController.allowedTo("admin", "user"),
    chargingPointController.updateChargingPoint
  );

router
  .route("/deleteChargingPoint/:id")
  .delete(
    authController.protect,
    authController.allowedTo("admin", "user"),
    chargingPointController.deleteChargingPoint
  );

module.exports = router;
