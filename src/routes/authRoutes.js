const express = require("express");
const { check } = require("express-validator");
const { cadastrarAdministrador, login } = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * /api/auth/cadastrar-administrador:
 *   post:
 *     summary: Cadastrar uma nova empresa no sistema
 *     description: Cria uma nova empresa no sistema com o perfil de administrador
 *     tags:
 *       - Registro e Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - documento
 *               - senha
 *               - aceitou_termos
 *               - plano
 *               - plano_plus
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do administrador ou empresa
 *                 example: Patmos
 *               documento:
 *                 type: string
 *                 description: CPF ou CNPJ do administrador
 *                 example: 37702561000145
 *               senha:
 *                 type: string
 *                 description: Senha do administrador
 *                 example: Teste123
 *               aceitou_termos:
 *                 type: boolean
 *                 description: Confirmação de concordância com os termos de privacidade
 *                 example: true
 *               plano:
 *                 type: string
 *                 description: Plano escolhido pelo administrador (BASICO, INTERMEDIARIO, PREMIUM)
 *                 enum: [BASICO, INTERMEDIARIO, PREMIUM]
 *                 example: PREMIUM
 *               plano_plus:
 *                 type: boolean
 *                 description: Se o plano do cliente é Plus ou não
 *                 example: true
 *     responses:
 *       201:
 *         description: Empresa cadastrada com sucesso
 *       400:
 *         description: Erro ao cadastrar empresa
 *       500:
 *         description: Erro interno no servidor
 */
router.post("/cadastrar-administrador", [
    check("documento", "CPF/CNPJ é obrigatório").not().isEmpty(),
    check("senha", "A senha deve ter pelo menos 8 caracteres").isLength({ min: 8 }),
], cadastrarAdministrador);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login do usuário no sistema
 *     description: Realiza o login do usuário no sistema
 *     tags:
 *       - Registro e Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documento
 *               - senha
 *             properties:
 *               documento:
 *                 type: string
 *                 description: CPF ou CNPJ do usuário
 *                 example: 37702561000145
 *               senha:
 *                 type: string
 *                 description: Senha do usuário   
 *                 example: Teste123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZG9jdW1lbnQiOiIzNzcwMjU2MTAwMDE0NSIsImlhdCI6MTczOTIxOTc0MywiZXhwIjoxNzM5MjIzMzQzfQ.PMSOv30Mc4GIR7DCJDhfrNcAaSMJMKaL9kVqxmpt2qs
 *       400:
 *         description: Erro ao efetuar login
 *       500:
 *         description: Erro interno no servidor
 */
router.post("/login", [
    check("documento", "CPF/CNPJ é obrigatório").not().isEmpty(),
    check("senha", "Senha é obrigatória").exists()
], login);

module.exports = router;