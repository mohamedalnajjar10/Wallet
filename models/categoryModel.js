const { DataTypes } = require("sequelize");
const connection = require("../config/database");

const Category = connection.define(
  "Category",
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
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = Category;
