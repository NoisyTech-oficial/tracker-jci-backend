const express = require("express");
const { check } = require("express-validator");
const PermissaoVisualizacaoEnums = require("../enums/permissaoVisualizacao.enum");
const { novoFuncionario, obterFuncionariosPorDocumentoEmpresa, atualizarPermissoesVisualizacao, deletarFuncionario } = require("../controllers/funcionarioController");

const router = express.Router();

/**
 * @swagger
 * /api/funcionarios/cadastrar:
 *   post:
 *     summary: Cadastrar um novo funcionário no sistema
 *     description: Cria um novo funcionário vinculado a uma empresa.
 *     tags:
 *       - Funcionários
 *     security:
 *       - bearerAuth: []  # Protege o endpoint usando autenticação JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documento
 *               - senha
 *               - permissoes_visualizacao
 *             properties:
 *               documento:
 *                 type: string
 *                 description: CPF do funcionário
 *                 example: 22965975485
 *               senha:
 *                 type: string
 *                 description: Senha do funcionário
 *                 example: 123Teste
 *               permissoes_visualizacao:
 *                 type: array
 *                 description: Lista de permissões de visualização atribuídas ao funcionário
 *                 items:
 *                   type: string
 *                   enum: [TOTAL, DASHBOARD, LEADS, FUNCIONARIOS, MEUS_PROCESSOS]
 *                 example: ["DASHBOARD", "LEADS"]
 *     responses:
 *       201:
 *         description: Funcionário cadastrado com sucesso
 *       400:
 *         description: Erro ao cadastrar funcionário
 *       500:
 *         description: Erro interno no servidor
 */
router.post("/funcionarios/cadastrar", [
    check("documento", "CPF/CNPJ é obrigatório").not().isEmpty(),
    check("senha", "A senha deve ter pelo menos 8 caracteres").isLength({ min: 8 }),
    check("permissoes_visualizacao", "Deve informar pelo menos uma permissão válida")
        .isIn([
            PermissaoVisualizacaoEnums.DASHBOARD,
            PermissaoVisualizacaoEnums.FUNCIONARIOS,
            PermissaoVisualizacaoEnums.LEADS,
            PermissaoVisualizacaoEnums.MEUS_PROCESSOS
        ])
], novoFuncionario);


/**
 * @swagger
 * /api/funcionarios/por-documento-empresa:
 *   get:
 *     summary: Buscar funcionários pelo CNPJ da empresa
 *     description: Retorna todos os funcionários associados ao CNPJ da empresa autenticada.
 *     tags:
 *       - Funcionários
 *     security:
 *       - bearerAuth: []  # Token JWT obrigatório para autenticação
 *     responses:
 *       200:
 *         description: Lista de funcionários retornada com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Nenhum funcionário encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/funcionarios/por-documento-empresa", obterFuncionariosPorDocumentoEmpresa);


/**
 * @swagger
 * /api/funcionarios/permissoes-visualizacao:
 *   put:
 *     summary: Alterar permissões de visualização
 *     description: Atualiza as permissões de visualização de um funcionário.
 *     tags:
 *       - Funcionários
 *     security:
 *       - bearerAuth: []  # Token JWT obrigatório para autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documento
 *               - permissoes_visualizacao
 *             properties:
 *               documento:
 *                 type: string
 *                 description: CPF do funcionário
 *                 example: 22965975485
 *               permissoes_visualizacao:
 *                 type: array
 *                 description: Lista de permissões atribuídas ao funcionário
 *                 items:
 *                   type: string
 *                   enum: [TOTAL, DASHBOARD, LEADS, FUNCIONARIOS, MEUS_PROCESSOS]
 *                 example: ["DASHBOARD", "LEADS", "FUNCIONARIOS"]
 *     responses:
 *       200:
 *         description: Permissões atualizadas com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Funcionário não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.put("/funcionarios/permissoes-visualizacao", [
    check("documento", "CPF/CNPJ é obrigatório").not().isEmpty(),
    check("permissoes_visualizacao", "Deve informar pelo menos uma permissão válida")
        .isIn([
            PermissaoVisualizacaoEnums.DASHBOARD,
            PermissaoVisualizacaoEnums.LEADS,
            PermissaoVisualizacaoEnums.FUNCIONARIOS,
            PermissaoVisualizacaoEnums.MEUS_PROCESSOS
        ])
], atualizarPermissoesVisualizacao);


/**
 * @swagger
 * /api/funcionarios/deletar:
 *   delete:
 *     summary: Excluir funcionário
 *     description: Remove um funcionário vinculado à empresa autenticada.
 *     tags:
 *       - Funcionários
 *     security:
 *       - bearerAuth: []  # Token JWT obrigatório para autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documento
 *             properties:
 *               documento:
 *                 type: string
 *                 description: CPF do funcionário
 *                 example: 22965975485
 *     responses:
 *       200:
 *         description: Funcionário excluído com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Funcionário não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.delete("/funcionarios/deletar", [
    check("documento", "CPF é obrigatório").not().isEmpty(),
], deletarFuncionario);

module.exports = router;