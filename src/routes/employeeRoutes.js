const express = require("express");
const { check } = require("express-validator");
const ViewingPermissionEnums = require("../enums/viewingPermission.enum");
const { registerEmployee, getEmployeesByCompanyDocument, updateViewingPermission, deleteEmployee } = require("../controllers/employeeController");

const router = express.Router();

/**
 * @swagger
 * /api/employee/register:
 *   post:
 *     summary: Cadastrar um novo funcionário no sistema
 *     description: Cria um novo funcionário no sistema
 *     tags:
 *       - Funcionarios
 *     security:
 *       - bearerAuth: []  # Protege o endpoint usando autenticação JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *               - password
 *               - viewing_permission
 *             properties:
 *               document:
 *                 type: string
 *                 description: CPF do funcionário
 *                 example: 22965975485
 *               password:
 *                 type: string
 *                 description: Senha do funcionário
 *                 example: 123Teste
 *               viewing_permission:
 *                 type: array
 *                 description: Lista de permissões de visualização atribuídas ao funcionário
 *                 items:
 *                   type: string
 *                   enum: [TOTAL, DASHBOARD, OBTER_PROCESSOS, FUNCIONARIOS, MEUS_PROCESSOS]
 *                 example: ["DASHBOARD", "OBTER_PROCESSOS"]
 *     responses:
 *       201:
 *         description: Funcionário registrado com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Funcionário registrado com sucesso!
 *       400:
 *         description: Erro ao registrar um novo funcionário
 *       500:
 *         description: Erro interno no servidor
 */
router.post("/employee/register", [
    check("document", "CPF/CNPJ é obrigatório").not().isEmpty(),
    check("password", "A senha deve ter pelo menos 8 caracteres").isLength({ min: 8 }),
    check("viewing_permission", "Informar o que o funcionario pode visualizar").isIn([ViewingPermissionEnums.DASHBOARD, ViewingPermissionEnums.OBTER_PROCESSOS, ViewingPermissionEnums.EMPLOYEES, ViewingPermissionEnums.MEUS_PROCESSOS])
], registerEmployee);

/**
 * @swagger
 * /api/employee/employees-by-company-document:
 *   get:
 *     summary: Buscar funcionários pelo CNPJ da empresa
 *     description: Retorna a lista de funcionários associados ao CNPJ da empresa autenticada.
 *     tags:
 *       - Funcionarios
 *     security:
 *       - bearerAuth: []  # Token JWT obrigatório para autenticação
 *     responses:
 *       200:
 *         description: Lista de funcionários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Nome do funcionário
 *                     example: Brian Oconner
 *                   document:
 *                     type: string
 *                     description: CPF do funcionário
 *                     example: 22965975485
 *                   viewing_permission:
 *                     type: array
 *                     description: Permissões de visualização do funcionário
 *                     items:
 *                       type: string
 *                     example: ["DASHBOARD", "MEUS_PROCESSOS"]
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Nenhum funcionário encontrado para o CNPJ fornecido
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/employee/employees-by-company-document', getEmployeesByCompanyDocument);

/**
 * @swagger
 * /api/employee/viewing-permission:
 *   put:
 *     summary: Alterar a permissão de visualização
 *     description: Alterar a permissão de visualização do funcionario.
 *     tags:
 *       - Funcionarios
 *     security:
 *       - bearerAuth: []  # Token JWT obrigatório para autenticação
*     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *               - viewing_permission
 *             properties:
 *               document:
 *                 type: string
 *                 description: CPF do funcionário
 *                 example: 22965975485
 *               viewing_permission:
 *                 type: array
 *                 description: Lista de permissões de visualização atribuídas ao funcionário
 *                 items:
 *                   type: string
 *                   enum: [TOTAL, OBTER_PROCESSOS, FUNCIONARIOS, MEUS_PROCESSOS]
 *                 example: ["DASHBOARD", "OBTER_PROCESSOS", "FUNCIONARIOS", "MEUS_PROCESSOS"]
 *     responses:
 *       200:
 *         description: Permissões alteradas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   viewing_permission:
 *                     type: array
 *                     description: Permissões de visualização do funcionário
 *                     items:
 *                       type: string
 *                     example: ["DASHBOARD", "OBTER_PROCESSOS", "FUNCIONARIOS", "MEUS_PROCESSOS"]
 *       401:
 *         description: Token JWT ausente ou inválido
 *       500:
 *         description: Erro interno no servidor
 */
router.put('/employee/viewing-permission', [
    check("document", "CPF/CNPJ é obrigatório").not().isEmpty(),
    check("viewing_permission", "Informar o que o funcionario pode visualizar").isIn([ViewingPermissionEnums.DASHBOARD, ViewingPermissionEnums.OBTER_PROCESSOS, ViewingPermissionEnums.EMPLOYEES, ViewingPermissionEnums.MEUS_PROCESSOS])
], updateViewingPermission);

/**
 * @swagger
 * /api/employee/delete:
 *   delete:
 *     summary: Excluir funcionário
 *     description: Excluir funcionário da empresa.
 *     tags:
 *       - Funcionarios
 *     security:
 *       - bearerAuth: []  # Token JWT obrigatório para autenticação
*     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *             properties:
 *               document:
 *                 type: string
 *                 description: CPF do funcionário
 *                 example: 22965975485
 *     responses:
 *       200:
 *         description: Funcionário excluído com sucesso!
 *       401:
 *         description: Token JWT ausente ou inválido
 *       500:
 *         description: Erro interno no servidor
 */
router.delete('/employee/delete', [
    check("document", "CPF é obrigatório").not().isEmpty(),
], deleteEmployee);

module.exports = router;