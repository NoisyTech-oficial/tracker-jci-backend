const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProcessesObtained = sequelize.define("processes_obtained", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    process_number: {
        type: DataTypes.STRING,
        allowNull: false,
        //comment: 'Numero do processo'
    },
    employer_document: {
        type: DataTypes.STRING,
        allowNull: false,
        //comment: 'Documento do empregador - CNPJ'
    },
    export_document: {
        type: DataTypes.STRING,
        allowNull: false,
        //comment: 'Documento de quem exportou os processos'
    },
    data_exporting: {
        type: DataTypes.DATE,
        allowNull: false,
        //comment: 'Data e hora da exportacao dos processos'
    },
    crm_update_document: {
        type: DataTypes.STRING,
        allowNull: true,
        //comment: 'Documento de quem atualizou o CRM'
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
        //comment: 'Status do processo a ser gerenciado no CRM'
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true,
        //comment: 'Observacoes sobre o processo'
    }
}, {
    timestamps: false,
    tableName: 'processes_obtained'
});

ProcessesObtained.associate = () => {
    const Processes = require("./ProcessesModel");
    ProcessesObtained.belongsTo(Processes, {
      foreignKey: "process_number",
      targetKey: "process_number",
      as: "process"
    });
  };
  

module.exports = ProcessesObtained;