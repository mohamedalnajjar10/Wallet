const { DataTypes } = require("sequelize");
const connection = require("../config/database");

const Company = connection.define(
  "Company",
  {
    id: {
      type: DataTypes.BIGINT({ zerofill: false, unsigned: true }),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.BIGINT({ zerofill: false, unsigned: true }),
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = Company;
