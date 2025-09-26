const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Enums traduzidos
const PerfisEnums = require("../enums/profiles.enum");
const PermissoesVisualizacaoEnums = require("../enums/viewingPermission.enum");

const Usuarios = sequelize.define("usuarios", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_advogado: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "advogado", key: "id" },
        //comentário: 'Referência ao advogado responsável pelo usuário'
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: true,
        //comentário: 'Nome do usuário'
    },
    documento: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
        //comentário: 'CPF ou CNPJ do usuário'
    },
    primeiro_acesso: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        //comentário: 'Se é o primeiro acesso'
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
        //comentário: 'Senha do usuário'
    },
    aceitou_termos: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        //comentário: 'Aceite dos termos de uso'
    },
    perfil: {
        type: DataTypes.ENUM(PerfisEnums.ADMINISTRADOR, PerfisEnums.FUNCIONARIO),
        allowNull: false,
        defaultValue: PerfisEnums.FUNCIONARIO,
        //comentário: 'Perfil do usuário'
    },
    permissao_visualizacao: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [PermissoesVisualizacaoEnums.DASHBOARD],
        allowNull: false,
        //comentário: 'Tudo que o usuário pode visualizar dentro do sistema'
    },
    documento_empresa: {
        type: DataTypes.STRING,
        allowNull: true,
        //comentário: 'CNPJ da empresa vinculada ao funcionário'
    },
    usuario_ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        //comentário: 'Se o usuário está ativo e pode acessar o sistema'
    },
    criado_em: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    atualizado_em: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    }
}, {
    timestamps: true,
    tableName: "usuarios",
});

module.exports = Usuarios;