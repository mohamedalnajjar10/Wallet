const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const transferRoute = require("./transferUserRoute");
const chargingPointRoute = require("./chargingPointRoute");
const walletUserRoute = require("./walletUserRoute");
const categoryRoute = require("./categoryRoute");
const companyRoute = require("./companyRoute");
const twoFactorAuthRoute = require("./twoFactorAuthRoute");

const mountRoute = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/transfer", transferRoute);
  app.use("/api/v1/chargingPoint", chargingPointRoute);
  app.use("/api/v1/walletUser", walletUserRoute);
  app.use("/api/v1/category", categoryRoute);
  app.use("/api/v1/company", companyRoute);
  app.use("/api/v1/2fa", twoFactorAuthRoute);
};
module.exports = mountRoute;
