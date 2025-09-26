const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DocumentoProcesso = sequelize.define("documentos_processo", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_lead: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "leads", key: "id" },
  },
  numero_processo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  
  },
  path_armazenamento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expedido_em: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  atualizado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  mensagem_erro: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "documentos_processo",
  timestamps: false,
});

module.exports = DocumentoProcesso;