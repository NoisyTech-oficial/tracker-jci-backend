const express = require("express");
const { check } = require("express-validator");
const { registerAdministrator, login } = require("../controllers/authController");
const PlansEnums = require("../enums/plans.enum");

const router = express.Router();

/**
 * @swagger
 * /api/auth/register-administrator:
 *   post:
 *     summary: Cadastrar uma nova empresa no sistema
 *     description: Cria uma nova empresa no sistema com o perfil de administrador
 *     tags:
 *       - Registro e Autenticacao
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - document
 *               - password
 *               - agree_terms
 *               - plan
 *               - plan_plus
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do administrador ou empresa
 *                 example: Patmos
 *               document:
 *                 type: string
 *                 description: CPF ou CNPJ do administrador
 *                 example: 37702561000145
 *               password:
 *                 type: string
 *                 description: Senha do administrador
 *                 example: Teste123
 *               agree_terms:
 *                 type: boolean
 *                 description: Confirmação de concordância com os termos de privacidade
 *                 example: true
 *               plan:
 *                 type: string
 *                 description: Plano escolhido pelo administrador (BASICO, INTERMEDIARIO, PREMIUM)
 *                 enum: [BASICO, INTERMEDIARIO, PREMIUM]
 *                 example: PREMIUM
 *               plan_plus:
 *                 type: boolean
 *                 description: Se o plano do cliente é plan_plus ou não
 *                 example: true
 *     responses:
 *       201:
 *         description: Empresa cadastrada com sucesso
 *       400:
 *         description: Erro ao cadastrar empresa
 *       500:
 *         description: Erro interno no servidor
 */
router.post("/register-administrator", [
    check("document", "CPF/CNPJ é obrigatório").not().isEmpty(),
    check("plan", "Plano deve ser Basico, Intermediario ou Premium").isIn([PlansEnums.BASIC, PlansEnums.INTERMEDIARY, PlansEnums.PREMIUM]),
    check("password", "A senha deve ter pelo menos 8 caracteres").isLength({ min: 8 }),
    check("plan_plus", "Deve informar se o plano é Plus").not().isEmpty(),
], registerAdministrator);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login do usuário no sistema
 *     description: Realiza o login do usuário no sistema
 *     tags:
 *       - Registro e Autenticacao
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *               - password
 *             properties:
 *               document:
 *                 type: string
 *                 description: CPF ou CNPJ do usuário
 *                 example: 37702561000145
 *               password:
 *                 type: string
 *                 description: Senha do usuário   
 *                 example: Teste123
 *     responses:
 *       200:
 *         description: Empresa cadastrada com sucesso
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
    check("document", "CPF/CNPJ é obrigatório").not().isEmpty(),
    check("password", "Senha é obrigatória").exists()
], login);

module.exports = router;