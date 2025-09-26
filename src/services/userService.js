const bcrypt = require("bcryptjs");
const Usuarios = require("../models/UsuariosModel");
const authService = require("../services/authService");

const changePassword = async (token, oldPassword, newPassword) => {
    try {
        // Verifica e decodifica o token JWT
        const decoded = authService.decryptToken(token, process.env.JWT_SECRET);
        
        // Busca o usuário pelo CPF/CNPJ armazenado no token
        const user = await Usuarios.findOne({ where: { document: decoded.document } });
        if (!user) throw new Error("Usuário não encontrado!");

        if (oldPassword) {
            // Verifica se a senha antiga está correta
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) throw new Error("Senha atual incorreta!");
        }

        // Atualiza a senha
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return "Senha alterada com sucesso!";
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateUserData = async (req) => {
    try {
        const token = req.header("Authorization");
        const decoded = authService.decryptToken(token, process.env.JWT_SECRET);
        const document = decoded.document;
        const updateData = req.body;

        const user = await Usuarios.findOne({ where: { document } });
        if (!user) {
            throw new Error("Usuário não encontrado!");
        }

        // Define os campos permitidos para atualização
        const allowedFields = ["name", "first_access", "agree_terms", "user_activated"];
        const filteredData = {};

        Object.keys(updateData).forEach((key) => {
            if (allowedFields.includes(key)) {
                filteredData[key] = updateData[key];
            }
        });

        await user.update({
            ...filteredData,
            updatedAt: new Date()
        });

        if (updateData.new_password) {
            user.password = await bcrypt.hash(updateData.new_password, 10);
            await user.save();        
        }

        return { message: "Usuário atualizado com sucesso!" };
    } catch (error) {
        throw new Error(error.message || "Erro ao atualizar usuário");
    }
};

const getUserByDocument = async (req) => {
    const tokenData = authService.decryptToken(req.header("Authorization"));
    const document = tokenData.document;

    return await Usuarios.findOne({
        where: { document },
        attributes: ['name', 'document', 'plan', 'plan_plus', 'first_access', 'profile', 'viewing_permission', 'company_document', 'user_activated']
    });
};

module.exports = { changePassword, getUserByDocument, updateUserData };
