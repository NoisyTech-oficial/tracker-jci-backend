const express = require("express");
const router = express.Router();
const { getUserData, changePassword, updateUserData } = require("../controllers/userController");
const { check } = require('express-validator');

/**
 * @swagger
 * /api/user/data:
 *   get:
 *     summary: Obter dados do usuário autenticado
 *     description: Retorna as informações detalhadas do usuário com base no token JWT fornecido.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []  # Token JWT obrigatório para autenticação
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Nome do usuário
 *                   example: Dominic Toretto
 *                 document:
 *                   type: string
 *                   description: CPF ou CNPJ do usuário
 *                   example: 22965975485
 *                 plan:
 *                   type: string
 *                   description: Plano ativo do usuário
 *                   example: PREMIUM
 *                 plan_plus:
 *                   type: string
 *                   description: Se o plano do cliente é Plus
 *                   example: true
 *                 profile:
 *                   type: string
 *                   description: Perfil do usuário (Administrador ou Funcionário)
 *                   example: Administrador
 *                 viewing_permission:
 *                   type: array
 *                   description: Permissões de visualização do usuário
 *                   items:
 *                     type: string
 *                   example: ["DASHBOARD", "RELATORIOS"]
 *                 company_document:
 *                   type: string
 *                   description: CNPJ da empresa associada ao usuário
 *                   example: 37702561000145
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/user/data', getUserData);

/**
 * @swagger
 * /api/user/data:
 *   put:
 *     summary: Alterar dados do usuario
 *     description: Alterar dados do usuario no sistema
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []  # Protege o endpoint usando autenticação JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - first_access
 *               - oldPassword
 *               - newPassword
 *               - agree_terms
 *               - user_activated
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário
 *                 example: Marcos França
 *               first_access:
 *                 type: boolean
 *                 description: Se é o primeiro acesso
 *                 example: false
 *               oldPassword:
 *                 type: string
 *                 description: Senha antiga
 *                 example: Teste123
 *               newPassword:
 *                 type: string
 *                 description: Senha antiga
 *                 example: Teste456
 *               agree_terms:
 *                 type: boolean
 *                 description: Termos aceitos
 *                 example: true
 *               user_activated:
 *                 type: boolean
 *                 description: Se o usuário tem permissão para acessar o sistema 
 *                 example: true
 *     responses:
 *       201:
 *         description: Usuário atualizado com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário atualizado com sucesso!
 *       400:
 *         description: Usuário não encontrado!
 *       500:
 *         description: Erro interno no servidor
 */
router.put("/user/data", [
    check("name").optional().isString().withMessage("O nome deve ser uma string").isLength({ min: 5 }).withMessage("O nome deve ter pelo menos 5 caracteres"),
    check("first_access").optional().isBoolean().withMessage("O campo first_access deve ser um booleano"),
    check("new_password").optional().isString().withMessage("A senha deve ser uma string").isLength({ min: 8 }).withMessage("A senha deve ter pelo menos 8 caracteres"),
    check("agree_terms").optional().isBoolean().withMessage("O campo agree_terms deve ser um booleano"),
    check("user_activated").optional().isBoolean().withMessage("O campo user_activated deve ser um booleano"),
], updateUserData);

/**
 * @swagger
 * /api/user/change-password:
 *   put:
 *     summary: Alterar a senha do usuário autenticado
 *     description: Permite que o usuário autenticado altere sua senha informando a senha atual e a nova senha.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []  # Token JWT obrigatório para autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Senha atual do usuário
 *                 example: Teste456
 *               newPassword:
 *                 type: string
 *                 description: Nova senha do usuário
 *                 example: Teste123
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Senha alterada com sucesso!
 *       400:
 *         description: Erro ao alterar senha (senha atual incorreta ou campos inválidos)
 *       401:
 *         description: Token JWT ausente ou inválido
 *       500:
 *         description: Erro interno no servidor
 */
router.put("/user/change-password", [
    check("oldPassword", "Senha antiga é obrigatória").not().isEmpty(),
    check("newPassword", "Senha nova é obrigatória").not().isEmpty()
], changePassword);

module.exports = router;