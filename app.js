const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const morgan = require("morgan");
const cors = require("cors");
const hpp = require("hpp");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const connection = require("./config/database.js");
const User = require("./models/userModel.js");
const Transaction = require("./models/transactionModel.js");
const Deposit = require("./models/depositModel.js");
const Payment = require("./models/paymentModel.js");
const Withdraw = require("./models/withdrawModel.js");
const globalError = require("./middlewares/errorMiddleware.js");
const mountRoute = require("./routes/index.js");
const ApiError = require("./utils/ApiError");
const Charging  = require("./models/chargingModel.js");
const ChargingPoint = require("./models/chargingPointModel.js");
const Wallet = require("./models/walletUserModel.js");
const Company = require("./models/companyModel.js");
const WalletCompany = require("./models/walletCompanyModel.js");
const Category = require("./models/categoryModel.js");

const app = express();
app.use(express.json({ limit: "10kb" }));

User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "userId" });

User.hasOne(Wallet, { foreignKey: "userId" });
Wallet.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Charging, { foreignKey: "userId" });
Charging.belongsTo(User, { foreignKey: "userId" });

Transaction.hasOne(Payment, { foreignKey: "transactionId" });
Payment.belongsTo(Transaction, { foreignKey: "transactionId" });

Transaction.hasOne(Deposit, { foreignKey: "transactionId" });
Deposit.belongsTo(Transaction, { foreignKey: "transactionId" });

Transaction.hasOne(Withdraw, { foreignKey: "transactionId" });
Withdraw.belongsTo(Transaction, { foreignKey: "transactionId" });

ChargingPoint.hasMany(Charging, { foreignKey: "chargingPointId" });
Charging.belongsTo(ChargingPoint, { foreignKey: "chargingPointId" });

Wallet.hasMany(Transaction, { foreignKey: "walletId" });
Transaction.belongsTo(Wallet, { foreignKey: "walletId" });

Company.hasOne(WalletCompany , { foreignKey: "companyId" });
WalletCompany.belongsTo(Company , { foreignKey: "companyId" });

Category.hasMany(Company , {foreignKey : "categoryId"});
Company.belongsTo(Category , {foreignKey : "categoryId"});




if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
});

// Security middleware
app.use(hpp());
app.use(cors());
app.options("*", cors()); // Enable pre-flight requests for all routes
app.use(compression());
app.use("/api",limiter); // Apply rate limiting middleware to all requests




// Global error handling middleware for express
app.use(globalError);

//Routs
mountRoute(app);

// Router error handling
app.all("*", (req, res, next) => {
  next(new ApiError(`Cant find this router : ${req.originalUrl}`, 400));
  // send errors to middelware
  next(err.message);
});

connection.sync({ force: false }).then(() => {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`App running running on port ${PORT}`);
  });
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  process.exit(1);
});
