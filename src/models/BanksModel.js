const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Banks = sequelize.define("banks", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Nome do banco'
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Código do banco'
    }
},{
    freezeTableName: true, 
    timestamps: false,
});

module.exports = Banks;