const StatusLead = require("../models/StatusLeadModel");

// Criar (POST)
const novoStatus = async (req) => {
    const { nome, descricao, codigo_cor } = req.body;

    await StatusLead.create({
        nome,
        descricao,
        codigo_cor
    });

    return { message: "Status criado com sucesso!" };
};

// Listar todos (GET)
const listarStatus = async () => {
    return await StatusLead.findAll({
        attributes: ["id", "nome", "descricao", "codigo_cor"]
    });
};

// Atualizar (PUT)
const atualizarStatus = async (id, dados) => {
    const { nome, descricao, codigo_cor } = dados;

    const status = await StatusLead.findByPk(id);
    if (!status) {
        throw new Error("Status não encontrado!");
    }

    await StatusLead.update(
        { nome, descricao, codigo_cor },
        { where: { id } }
    );

    return { message: "Status atualizado com sucesso!" };
};

// Deletar (DELETE)
const deletarStatus = async (id) => {
    const status = await StatusLead.findByPk(id);
    if (!status) {
        throw new Error("Status não encontrado!");
    }

    await status.destroy();
    return { message: "Status excluído com sucesso!" };
};

module.exports = { novoStatus, listarStatus, atualizarStatus, deletarStatus };