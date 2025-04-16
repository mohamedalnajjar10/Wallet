const { DataTypes } = require("sequelize");
const connection = require("../config/database");
const Wallet = require("./walletUserModel");

const User = connection.define(
  "User",
  {
    id: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    nationalId: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female"),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    passwordChangedAt: {
      type: DataTypes.DATE(),
    },
    passwordResetCode: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    passwordResetExpires: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
    passwordResetVerified: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false,
      allowNull: true,
    },
    transferVerificationCode: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    transferVerificationExpires: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
    transferVerificationVerified: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false,
      allowNull: true,
    },
    walletId: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: true,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    role: {
      type: DataTypes.ENUM("user", "manager", "admin"),
      defaultValue: "user",
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
    twoFactorSecret: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    twoFactorBackupCodes: {
      type: DataTypes.JSON(),
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = User;
