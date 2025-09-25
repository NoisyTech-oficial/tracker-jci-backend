const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProcessDetails = sequelize.define("process_details", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    process_number: {
        type: DataTypes.STRING,
        allowNull: false,
       // unique: true,
        //comment: 'Numero do processo'
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: true,
        //comment: 'Nome do cliente associado ao processo'
    },
    cpf_cnpj: {
        type: DataTypes.STRING,
        allowNull: true,
        //comment: 'CPF ou CNPJ associado ao processo'
    },
    phone1: {
        type: DataTypes.STRING,
        allowNull: true,
        //comment: 'Número de telefone principal'
    },
    phone2: {
        type: DataTypes.STRING,
        //comment: 'Número de telefone secundário'
    },
    email: {
        type: DataTypes.STRING,
        //allowNull: true,
        // comment: 'Email do cliente'
    },
    address: {
        type: DataTypes.STRING,
        //allowNull: true,
        // comment: 'Endereço do cliente'
    },
    installment_amount: {
        type: DataTypes.FLOAT,
        //allowNull: true,
        // comment: 'Valor da parcela'
    },
    remaining_installments: {
        type: DataTypes.INTEGER,
        //allowNull: true,
        // comment: 'Quantidade de parcelas faltantes'
    },
    paid_installments: {
        type: DataTypes.INTEGER,
        //allowNull: true,
        // comment: 'Quantidade de parcelas pagas'
    },
    overdue_installments: {
        type: DataTypes.INTEGER,
        //allowNull: true,
        // comment: 'Quantidade de parcelas em atraso'
    },
    vehicle_brand: {
        type: DataTypes.STRING,
        //allowNull: true,
        // comment: 'Marca do veículo'
    },
    vehicle_model: {
        type: DataTypes.STRING,
        //allowNull: true,
        // comment: 'Modelo do veículo'
    },
    vehicle_color: {
        type: DataTypes.STRING,
        //allowNull: true,
        // comment: 'Cor do veículo'
    },
    vehicle_year: {
        type: DataTypes.STRING,
        //allowNull: true,
        // comment: 'Ano do veículo'
    },
    vehicle_plate: {
        type: DataTypes.STRING,
        //allowNull: true,
        // comment: 'Placa do veículo'
    },
    vehicle_renavam: {
        type: DataTypes.STRING,
        //allowNull: true,
        // comment: 'Renavam do veículo'
    },
    contract_interest_rate: {
        type: DataTypes.FLOAT,
        //allowNull: true,
        // comment: 'Valor do juros do contrato'
    },
    contract_fee: {
        type: DataTypes.FLOAT,
        //allowNull: true,
        // comment: 'Taxa do contrato'
    },
    credit_life_insurance: {
        type: DataTypes.BOOLEAN,
        //allowNull: true,
        // comment: 'Seguro prestamista'
    },
    contract_number: {
        type: DataTypes.STRING,
        //allowNull: true,
        // comment: 'Número do contrato'
    }
}, {
    timestamps: false,
});

ProcessDetails.associate = () => {
    const Processes = require("./ProcessesModel");
    ProcessDetails.belongsTo(Processes, {
      foreignKey: "process_number",
      targetKey: "process_number",
      as: "process"
    });
  };
  
  

module.exports = ProcessDetails;