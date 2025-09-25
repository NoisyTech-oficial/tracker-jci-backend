const bcrypt = require("bcryptjs");
const Users = require("../models/UsersModel");
const authService = require("./authService");
const ProfilesEnums = require("../enums/profiles.enum");

const getEmployeesByCompanyDocument = async (req) => {
    const document = req.user.documentCompany ?? req.user.document;
    return await Users.findAll({
        where: {
            company_document: document,
            profile: ProfilesEnums.EMPLOYEE
        },
        attributes: ['name', 'document', 'viewing_permission']
    });
};

// Registrar Funcionario
const registerEmployee = async (req) => {
    const { document, password, viewing_permission } = req.body;

    const userExists = await Users.findOne({ where: { document } });
    if (userExists) throw new Error("CPF/CNPJ já cadastrado!");

    const hashedPassword = await bcrypt.hash(password, 10);
    const tokenData = authService.decryptToken(req.header("Authorization"));

    await Users.create({
        name: null,
        document,
        password: hashedPassword,
        agree_terms: false,
        plan: tokenData.plan,
        plan_plus: tokenData.plan_plus,
        first_access: true,
        profile: ProfilesEnums.EMPLOYEE,
        viewing_permission: viewing_permission,
        company_document: tokenData.document,
        number_available_processes: 0,
        user_activated: true
    });
};

// Alterar Visualizacao Funcionario
const updateViewingPermission = async (companyDocument, documentEmployee, viewingPermission) => {
    try {
        const employee = await Users.findOne({ 
            where: {
                document: documentEmployee, 
                company_document: companyDocument 
            } 
        });

        if (!employee) {
            throw new Error("Funcionário não encontrado!");
        }

        if (!Array.isArray(viewingPermission) || viewingPermission.length === 0) {
            throw new Error("O campo 'viewing_permission' deve ser um array não vazio.");
        }

        await Users.update(
            { 
                viewing_permission: viewingPermission, 
                updatedAt: new Date() 
            },
            { 
                where: {
                    document: documentEmployee, 
                    company_document: companyDocument 
                }  
            }
        );
        return { message: "Permissões de visualização atualizadas com sucesso!" };
    } catch (error) {
        throw new Error(error.message || "Erro ao atualizar permissões de visualização");
    }
};

// Deletar Funcionario
const deleteEmployee = async (documentEmployee, companyDocument) => {
    try {
        const employee = await Users.findOne({ 
            where: { 
                document: documentEmployee, 
                company_document: companyDocument 
            } 
        });

        if (!employee) {
            throw new Error("Funcionário não encontrado para esta empresa.");
        }

        await employee.destroy();

        return { message: "Funcionário excluído com sucesso!" };
    } catch (error) {
        throw new Error(error.message || "Erro ao excluir funcionário");
    }
};

module.exports = { registerEmployee, getEmployeesByCompanyDocument, updateViewingPermission, deleteEmployee };
