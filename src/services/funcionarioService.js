const bcrypt = require("bcryptjs");
const Usuarios = require("../models/UsuariosModel");
const authService = require("./authService");
const PerfisEnums = require("../enums/perfis.enum");

// Obter funcionários pelo documento da empresa
const obterFuncionariosPorDocumentoEmpresa = async (req) => {
    const documento = req.usuario.documento_empresa ?? req.usuario.documento;
    return await Usuarios.findAll({
        where: {
            documento_empresa: documento,
            perfil: PerfisEnums.FUNCIONARIO
        },
        attributes: ["nome", "documento", "permissoes_visualizacao"]
    });
};

// Registrar novo funcionário
const novoFuncionario = async (req) => {
    const { documento, senha, permissoes_visualizacao } = req.body;

    const usuarioExistente = await Usuarios.findOne({ where: { documento } });
    if (usuarioExistente) throw new Error("CPF/CNPJ já cadastrado!");

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const dadosToken = authService.decryptToken(req.header("Authorization"));

    await Usuarios.create({
        nome: null,
        documento,
        senha: senhaCriptografada,
        aceitou_termos: false,
        plano: dadosToken.plano,
        plano_plus: dadosToken.plano_plus,
        primeiro_acesso: true,
        perfil: PerfisEnums.FUNCIONARIO,
        permissoes_visualizacao,
        documento_empresa: dadosToken.documento,
        numero_processos_disponiveis: 0,
        usuario_ativo: true
    });
};

// Atualizar permissões de visualização
const atualizarPermissoesVisualizacao = async (documentoEmpresa, documentoFuncionario, permissoesVisualizacao) => {
    try {
        const funcionario = await Usuarios.findOne({ 
            where: {
                documento: documentoFuncionario, 
                documento_empresa: documentoEmpresa 
            } 
        });

        if (!funcionario) {
            throw new Error("Funcionário não encontrado!");
        }

        if (!Array.isArray(permissoesVisualizacao) || permissoesVisualizacao.length === 0) {
            throw new Error("O campo 'permissoes_visualizacao' deve ser um array não vazio.");
        }

        await Usuarios.update(
            { 
                permissoes_visualizacao: permissoesVisualizacao, 
                atualizado_em: new Date() 
            },
            { 
                where: {
                    documento: documentoFuncionario, 
                    documento_empresa: documentoEmpresa 
                }  
            }
        );
        return { message: "Permissões de visualização atualizadas com sucesso!" };
    } catch (error) {
        throw new Error(error.message || "Erro ao atualizar permissões de visualização");
    }
};

// Deletar funcionário
const deletarFuncionario = async (documentoFuncionario, documentoEmpresa) => {
    try {
        const funcionario = await Usuarios.findOne({ 
            where: { 
                documento: documentoFuncionario, 
                documento_empresa: documentoEmpresa 
            } 
        });

        if (!funcionario) {
            throw new Error("Funcionário não encontrado para esta empresa.");
        }

        await funcionario.destroy();

        return { message: "Funcionário excluído com sucesso!" };
    } catch (error) {
        throw new Error(error.message || "Erro ao excluir funcionário");
    }
};

module.exports = { 
    novoFuncionario, 
    obterFuncionariosPorDocumentoEmpresa, 
    atualizarPermissoesVisualizacao, 
    deletarFuncionario 
};