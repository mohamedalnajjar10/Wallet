const { DataTypes } = require("sequelize");
const connection = require("../config/database");

const Wallet = connection.define(
  "Wallet",
  {
    id: {
      type: DataTypes.BIGINT({ zerofill: false, unsigned: true }),
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT({ zerofill: false, unsigned: true }),
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    currency: {
      type: DataTypes.STRING(),
      allowNull: false,
      defaultValue: "USD",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Wallet;
