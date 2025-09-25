const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Processes = sequelize.define("processes", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    process_number: {
      type: DataTypes.STRING,
      allowNull: false,  
      unique: true,  
      //comment: 'Numero do processo'
    },
    applicant_name: {
      type: DataTypes.STRING,
      //comment: 'Nome do requerente do processo'
    },
    value: {
      type: DataTypes.DECIMAL(15, 2),
      //comment: 'Valor da ação do processo'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false, 
      //comment: 'Data de criação do processo'
    },
    updated_at: {
      type: DataTypes.DATE,
      //comment: 'Data da última atualização do processo'
    },
    cidade_id: {
      type: DataTypes.INTEGER,
      //comment: 'Id da cidade'
    },
    distribution_date: {
        type: DataTypes.DATE,
        //comment: 'Data de distribuição do processo'
    },
    ready: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      //comment: 'Ready'
    }
  
}, {
  timestamps: false,
});

Processes.associate = () => {
  const ProcessDetails = require("./ProcessDetailsModel");
  const ProcessesObtained = require("./ProcessesObtainedModel");
  const CEP = require("./CepModel");

  // 1:1 com ProcessDetails
  Processes.hasOne(ProcessDetails, {
    foreignKey: "process_number",
    sourceKey: "process_number",
    as: "client"
  });

  // 1:1 com ProcessesObtained
  Processes.hasOne(ProcessesObtained, {
    foreignKey: "process_number",
    sourceKey: "process_number",
    as: "export"
  });

  // CEP
  Processes.belongsTo(CEP, {
    foreignKey: "cidade_id",
    as: "cep"
  });
};  
    
module.exports = Processes;