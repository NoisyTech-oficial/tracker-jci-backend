const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const cep = sequelize.define("cep", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Nome da cidade'
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Sigla do estado'
    }
},{
    freezeTableName: true, 
    timestamps: false,
});

cep.associate = () => {
    const Processes = require("./ProcessesModel");
    cep.hasMany(Processes, {
      foreignKey: "cidade_id",
      as: "processes"
    });
  };
  

module.exports = cep;