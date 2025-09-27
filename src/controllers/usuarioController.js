const usuarioService = require("../services/usuarioService");

const alterarSenha = async (req, res) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ message: "Token não fornecido!" });

        const message = await usuarioService.alterarSenha(token, req.body.oldPassword, req.body.newPassword);
        res.json({ message });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const obterDadosUsuario = async (req, res) => {
    try {
        const usuario = await usuarioService.obterDadosUsuarioPorDocumento(req);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const atualizarDadosUsuario = async (req, res) => {
    try {
        const response = await usuarioService.atualizarDadosUsuario(req);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { alterarSenha, obterDadosUsuario, atualizarDadosUsuario };