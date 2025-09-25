const express = require("express");
const { getCitiesAndStates, getBanksContainLawsuits } = require("../controllers/generalDataController");

const router = express.Router();

/**
 * @swagger
 * /api/general-data/cities-and-states:
 *   get:
 *     summary: Buscar estados e cidades que contém processos judiciais
 *     description: Buscar estados e cidades que contém processos judiciais.
 *     tags:
 *       - Dados Gerais
 *     security:
 *       - bearerAuth: []  # Token JWT obrigatório para autenticação
 *     responses:
 *       200:
 *         description: Lista de cidades e estados retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: Nome da cidade
 *                     example: Santo André
 *                   state:
 *                     type: string
 *                     description: Nome do estado
 *                     example: São Paulo
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Nenhum funcionário encontrado para o CNPJ fornecido
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/general-data/cities-and-states', getCitiesAndStates);

/**
 * @swagger
 * /api/general-data/cities-and-states:
 *   get:
 *     summary: Buscar os bancos que contém processos judiciais
 *     description: Buscar os bancos que contém processos judiciais.
 *     tags:
 *       - Dados Gerais
 *     security:
 *       - bearerAuth: []  # Token JWT obrigatório para autenticação
 *     responses:
 *       200:
 *         description: Lista de bancos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Nome do banco
 *                     example: Santander
 *                   code:
 *                     type: string
 *                     description: Código do banco	
 *                     example: 627
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Nenhum funcionário encontrado para o CNPJ fornecido
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/general-data/banks-contain-lawsuits', getBanksContainLawsuits);

module.exports = router;