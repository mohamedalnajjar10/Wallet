const { DataTypes } = require("sequelize");
const connection = require("../config/database");

const Charging = connection.define(
  "Charging",
  {
    id: {
      type: DataTypes.BIGINT({ zerofill: false, unsigned: true }),
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.BIGINT({ zerofill: false, unsigned: true }),
      allowNull: false,
    },
    chargingPointId: {
      type: DataTypes.BIGINT({ zerofill: false, unsigned: true }),
      allowNull: false,
    },
    walletId: {
      type: DataTypes.BIGINT({ zerofill: false, unsigned: true }),
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT(),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Charging;
