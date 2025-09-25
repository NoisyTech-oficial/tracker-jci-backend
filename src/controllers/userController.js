const userService = require("../services/userService");

const changePassword = async (req, res) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ message: "Token não fornecido!" });

        const message = await userService.changePassword(token, req.body.oldPassword, req.body.newPassword);
        res.json({ message });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUserData = async (req, res) => {
    try {
        const user = await userService.getUserByDocument(req);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUserData = async (req, res) => {
    try {
        const response = await userService.updateUserData(req);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { changePassword, getUserData, updateUserData };