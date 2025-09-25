const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ProfilesEnums = require("../enums/profiles.enum");
const PlansEnums = require("../enums/plans.enum");
const ViewingPermissionEnums = require("../enums/viewingPermission.enum");

const Users = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
        //comment: 'Nome do usuario'
    },
    document: {
        type: DataTypes.STRING,
        allowNull: false,
        //unique: true,
        //comment: 'CPF ou CNPJ do usuario'
    },
    first_access: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        //comment: 'Primeiro acesso',
        defaultValue: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        //comment: 'Senha do usuario'
    },
    agree_terms: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        //comment: 'Aceite dos termos de uso'
    },
    plan: {
        type: DataTypes.ENUM(PlansEnums.BASIC, PlansEnums.INTERMEDIARY, PlansEnums.PREMIUM),
        allowNull: false,
        defaultValue: PlansEnums.BASIC,
        //comment: 'Plano adquirido pelo usuario'
    },
    plan_plus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        //comment: 'Se o usuario é plan_plus'
    },
    profile: {
        type: DataTypes.ENUM(ProfilesEnums.ADMINISTRATOR, ProfilesEnums.EMPLOYEE),
        allowNull: false,
        defaultValue: ProfilesEnums.EMPLOYEE,
        //comment: 'Perfil do usuario'
    },
    viewing_permission: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [ViewingPermissionEnums.DASHBOARD],
        allowNull: false,
        //comment: 'Tudo que um usuário pode ver dentro do sistema'
    },
    company_document: {
        type: DataTypes.STRING,
        allowNull: true,
        //comment: 'CNPJ da empresa do funcionario'
    },
    number_available_processes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        //comment: 'Número de processos que o usuário pode obter conforme plano'
    },
    user_activated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        //comment: 'Se o usuario tem permissão para acessar o sistema'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    }
}, {
    timestamps: true,
});

module.exports = Users;