const { DataTypes } = require("sequelize");
const connection = require("../config/database");

const Withdraw = connection.define(
  "Withdraw",
  {
    transactionId: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Withdraw;
