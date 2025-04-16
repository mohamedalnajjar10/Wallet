const { DataTypes } = require("sequelize");
const connection = require("../config/database");

const Transaction = connection.define(
  "Transaction",
  {
    id: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false,
    },
    walletId: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false,
    },
    old_balance: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
    },
    new_balance: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("deposit", "withdraw", "payment"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
  },
  { timestamps: true }
);

module.exports = Transaction;
