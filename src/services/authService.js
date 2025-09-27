// Dependências
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuarios = require("../models/UsuariosModel"); // Model
const PerfisEnums = require("../enums/perfis.enum"); // ENUMs
const PermissaoVisualizacaoEnums = require("../enums/permissaoVisualizacao.enum");

// Gerar Token JWT
const generateToken = (usuario) => {
    return jwt.sign(
        {
            id: usuario.id,
            document: usuario.document,
            profile: usuario.profile,
            plan: usuario.plan,
            plan_plus: usuario.plan_plus,
            documentCompany: usuario.profile === PerfisEnums.FUNCIONARIO ? usuario.company_document : null,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

// Verificar Token (Middleware)
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Acesso negado! Token não fornecido." });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido!" });
    }
};

// Descriptografar Token
const decryptToken = (token) => {
    try {
        return jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Registrar Administrador
const cadastrarAdministrador = async ({ name, document, password, plan, plan_plus, number_available_processes }) => {
    const usuarioExists = await Usuarios.findOne({ where: { document } });
    if (usuarioExists) throw new Error("CPF/CNPJ já cadastrado!");

    const hashedPassword = await bcrypt.hash(password, 10);

    await Usuarios.create({
        name,
        document,
        password: hashedPassword,
        agree_terms: false,
        first_access: true,
        plan,
        plan_plus,
        number_available_processes,
        profile: PerfisEnums.ADMINISTRADOR,
        viewing_permission: [PermissaoVisualizacaoEnums.TOTAL],
        company_document: null,
        usuario_activated: true
    });
};

// Login de Usuário
const login = async ({ document, password }) => {
    const usuario = await Usuarios.findOne({ where: { document } });
    if (!usuario) throw new Error("Credenciais inválidas!");

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) throw new Error("Credenciais inválidas!");

    return generateToken(usuario);
};

module.exports = { generateToken, verifyToken, decryptToken, cadastrarAdministrador, login };
