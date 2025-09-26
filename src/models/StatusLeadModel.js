const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Status = sequelize.define("status_lead", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  codigo_cor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "status_lead",
  timestamps: false,
});

module.exports = Status;