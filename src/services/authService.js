// Dependências
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuarios = require("../models/UsuariosModel"); // Model
const ProfilesEnums = require("../enums/profiles.enum"); // ENUMs
const ViewingPermissionEnums = require("../enums/viewingPermission.enum");

// Gerar Token JWT
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            document: user.document,
            profile: user.profile,
            plan: user.plan,
            plan_plus: user.plan_plus,
            documentCompany: user.profile === ProfilesEnums.EMPLOYEE ? user.company_document : null,
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
        req.user = decoded;
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
const registerAdministrator = async ({ name, document, password, plan, plan_plus, number_available_processes }) => {
    const userExists = await Usuarios.findOne({ where: { document } });
    if (userExists) throw new Error("CPF/CNPJ já cadastrado!");

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
        profile: ProfilesEnums.ADMINISTRADOR,
        viewing_permission: [ViewingPermissionEnums.ALL],
        company_document: null,
        user_activated: true
    });
};

// Login de Usuário
const login = async ({ document, password }) => {
    const user = await Usuarios.findOne({ where: { document } });
    if (!user) throw new Error("Credenciais inválidas!");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Credenciais inválidas!");

    return generateToken(user);
};

module.exports = { generateToken, verifyToken, decryptToken, registerAdministrator, login };
