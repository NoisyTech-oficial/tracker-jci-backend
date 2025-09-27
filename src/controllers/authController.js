const authService = require("../services/authService");
const PerfisEnums = require("../enums/perfis.enum");

const cadastrarAdministrador = async (req, res) => {
    try {
        await authService.cadastrarAdministrador(req.body, PerfisEnums.ADMINISTRADOR);
        res.status(201).json({ message: "Usuário registrado com sucesso!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const token = await authService.login(req.body);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { cadastrarAdministrador, login };
