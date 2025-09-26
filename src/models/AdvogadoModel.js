const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Advogado = sequelize.define("advogado", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totip: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "advogado",
  timestamps: false,
});

module.exports = Advogado;