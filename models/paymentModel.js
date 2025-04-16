const { DataTypes } = require("sequelize");
const connection = require("../config/database");

const Payment = connection.define(
  "Payment",
  {
    transactionId: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false,
    },
    payment_method: { //كيف تمت عملية الدفع 
      type: DataTypes.STRING(),
      allowNull: false,
    },
  },
  { timestamps: true }
);
module.exports = Payment;
