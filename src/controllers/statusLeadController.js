const statusLeadService = require("../services/statusLeadService");

// Criar (POST)
const novoStatus = async (req, res) => {
    try {
        const response = await statusLeadService.novoStatus(req);
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Listar todos (GET)
const listarStatus = async (req, res) => {
    try {
        const status = await statusLeadService.listarStatus();
        res.status(200).json(status);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Atualizar (PUT)
const atualizarStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await statusLeadService.atualizarStatus(id, req.body);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Deletar (DELETE)
const deletarStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await statusLeadService.deletarStatus(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { novoStatus, listarStatus, atualizarStatus, deletarStatus };