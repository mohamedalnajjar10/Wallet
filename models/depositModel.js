const { DataTypes } = require("sequelize");
const connection = require("../config/database");

const Deposit = connection.define(
  "Deposit",
  {
    transactionId: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false,
    },
    deposit_source: {  // لم معرفة مين اين تمت عملية الايداع
      type: DataTypes.STRING(),
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Deposit;
