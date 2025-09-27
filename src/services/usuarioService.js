const bcrypt = require("bcryptjs");
const Usuarios = require("../models/UsuariosModel");
const authService = require("./authService");

const alterarSenha = async (token, oldPassword, newPassword) => {
    try {
        // Verifica e decodifica o token JWT
        const decoded = authService.decryptToken(token, process.env.JWT_SECRET);
        
        // Busca o usuário pelo CPF/CNPJ armazenado no token
        const usuario = await Usuarios.findOne({ where: { document: decoded.document } });
        if (!usuario) throw new Error("Usuário não encontrado!");

        if (oldPassword) {
            // Verifica se a senha antiga está correta
            const isMatch = await bcrypt.compare(oldPassword, usuario.password);
            if (!isMatch) throw new Error("Senha atual incorreta!");
        }

        // Atualiza a senha
        usuario.password = await bcrypt.hash(newPassword, 10);
        await usuario.save();

        return "Senha alterada com sucesso!";
    } catch (error) {
        throw new Error(error.message);
    }
};

const atualizarDadosUsuario = async (req) => {
    try {
        const token = req.header("Authorization");
        const decoded = authService.decryptToken(token, process.env.JWT_SECRET);
        const document = decoded.document;
        const updateData = req.body;

        const usuario = await Usuarios.findOne({ where: { document } });
        if (!usuario) {
            throw new Error("Usuário não encontrado!");
        }

        // Define os campos permitidos para atualização
        const allowedFields = ["name", "first_access", "agree_terms", "usuario_activated"];
        const filteredData = {};

        Object.keys(updateData).forEach((key) => {
            if (allowedFields.includes(key)) {
                filteredData[key] = updateData[key];
            }
        });

        await usuario.update({
            ...filteredData,
            updatedAt: new Date()
        });

        if (updateData.new_password) {
            usuario.password = await bcrypt.hash(updateData.new_password, 10);
            await usuario.save();        
        }

        return { message: "Usuário atualizado com sucesso!" };
    } catch (error) {
        throw new Error(error.message || "Erro ao atualizar usuário");
    }
};

const obterDadosUsuarioPorDocumento = async (req) => {
    const tokenData = authService.decryptToken(req.header("Authorization"));
    const document = tokenData.document;

    return await Usuarios.findOne({
        where: { document },
        attributes: ['name', 'document', 'plan', 'plan_plus', 'first_access', 'profile', 'viewing_permission', 'company_document', 'usuario_activated']
    });
};

module.exports = { alterarSenha, obterDadosUsuarioPorDocumento, atualizarDadosUsuario };
