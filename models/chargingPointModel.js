const { DataTypes } = require("sequelize");
const connection = require("../config/database");

const ChargingPoint = connection.define(
  "ChargingPoint",
  {
    id: {
      type: DataTypes.BIGINT({ zerofill: false, unsigned: true }),
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    wasPending: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ChargingPoint;
