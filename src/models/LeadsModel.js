const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Lead = sequelize.define("leads", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_func_atrib: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "usuarios", key: "id" },
  },
  id_status: {
    type: DataTypes.INTEGER,
    references: { model: "status_lead", key: "id" },
  },
}, {
  tableName: "leads",
  timestamps: false,
});

module.exports = Lead;