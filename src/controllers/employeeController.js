const employeeService = require("../services/employeeService");
const authService = require("../services/authService");

const getEmployeesByCompanyDocument = async (req, res) => {
    try {
        const user = await employeeService.getEmployeesByCompanyDocument(req);

        if (!user) {
            return res.status(404).json({ message: 'Nenhum funcionário encontrado para o CNPJ fornecido' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const registerEmployee = async (req, res) => {
    try {
        await employeeService.registerEmployee(req);
        res.status(201).json({ message: "Funcionário registrado com sucesso!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateViewingPermission = async (req, res) => {
    try {
        const decoded = authService.decryptToken(req.header("Authorization"), process.env.JWT_SECRET);
        const { document, viewing_permission } = req.body;

        const response = await employeeService.updateViewingPermission(decoded.document, document, viewing_permission);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const decoded = authService.decryptToken(req.header("Authorization"), process.env.JWT_SECRET);
        const { document } = req.body;

        const response = await employeeService.deleteEmployee(document, decoded.document);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { registerEmployee, getEmployeesByCompanyDocument, updateViewingPermission, deleteEmployee };
