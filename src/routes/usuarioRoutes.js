const express = require("express");
const router = express.Router();
const { obterDadosUsuario, alterarSenha, atualizarDadosUsuario } = require("../controllers/usuarioController");
const { check } = require("express-validator");

/**
 * @swagger
 * /api/usuario/dados:
 *   get:
 *     summary: Obter dados do usuário autenticado
 *     description: Retorna as informações detalhadas do usuário com base no token JWT fornecido.
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []  # Token JWT obrigatório para autenticação
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/usuario/dados", obterDadosUsuario);

/**
 * @swagger
 * /api/usuario/dados:
 *   put:
 *     summary: Atualizar dados do usuário
 *     description: Permite atualizar dados do usuário no sistema.
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []  # Protege o endpoint usando autenticação JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do usuário
 *                 example: Marcos França
 *               primeiro_acesso:
 *                 type: boolean
 *                 description: Indica se é o primeiro acesso
 *                 example: false
 *               senha_antiga:
 *                 type: string
 *                 description: Senha atual do usuário
 *                 example: Teste123
 *               senha_nova:
 *                 type: string
 *                 description: Nova senha do usuário
 *                 example: Teste456
 *               aceitou_termos:
 *                 type: boolean
 *                 description: Se o usuário aceitou os termos
 *                 example: true
 *               usuario_ativo:
 *                 type: boolean
 *                 description: Se o usuário tem permissão para acessar o sistema
 *                 example: true
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso!
 *       400:
 *         description: Usuário não encontrado!
 *       500:
 *         description: Erro interno no servidor
 */
router.put("/usuario/dados", [
    check("nome").optional().isString().withMessage("O nome deve ser uma string").isLength({ min: 5 }).withMessage("O nome deve ter pelo menos 5 caracteres"),
    check("primeiro_acesso").optional().isBoolean().withMessage("O campo primeiro_acesso deve ser um booleano"),
    check("senha_nova").optional().isString().withMessage("A senha deve ser uma string").isLength({ min: 8 }).withMessage("A senha deve ter pelo menos 8 caracteres"),
    check("aceitou_termos").optional().isBoolean().withMessage("O campo aceitou_termos deve ser um booleano"),
    check("usuario_ativo").optional().isBoolean().withMessage("O campo usuario_ativo deve ser um booleano"),
], atualizarDadosUsuario);

/**
 * @swagger
 * /api/usuario/alterar-senha:
 *   put:
 *     summary: Alterar a senha do usuário autenticado
 *     description: Permite que o usuário altere sua senha informando a senha atual e a nova senha.
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []  # Token JWT obrigatório para autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senha_antiga
 *               - senha_nova
 *             properties:
 *               senha_antiga:
 *                 type: string
 *                 description: Senha atual do usuário
 *                 example: Teste456
 *               senha_nova:
 *                 type: string
 *                 description: Nova senha do usuário
 *                 example: Teste123
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso!
 *       400:
 *         description: Erro ao alterar senha (senha incorreta ou dados inválidos)
 *       401:
 *         description: Token JWT ausente ou inválido
 *       500:
 *         description: Erro interno no servidor
 */
router.put("/usuario/alterar-senha", [
    check("senha_antiga", "A senha antiga é obrigatória").not().isEmpty(),
    check("senha_nova", "A nova senha é obrigatória").not().isEmpty()
], alterarSenha);

module.exports = router;