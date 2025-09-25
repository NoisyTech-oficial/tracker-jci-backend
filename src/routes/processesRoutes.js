const express = require("express");
const { totalNumberProcess } = require('../controllers/processesController');
const { exportProcesses } = require('../controllers/processesController');
const { check } = require('express-validator');

const router = express.Router();

/**
 * @swagger
 * /api/processes/total-number:
 *   post:
 *     summary: Obter numero total de processos com base nos filtros
 *     description: Pesquisa o total de processos com os filtros aplicados isponivel dentro do nosso banco de dados 
 *     tags:
 *       - Processos Disponiveis
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               banks:
 *                 type: array
 *                 description: Nome dos bancos solicitados
 *                 example: ["Banco do Brasil", "Bradesco"]
 *               minimum_value:
 *                 type: number
 *                 description: Minimo do valor da ação
 *                 example: 10000
 *               maximum_value:
 *                 type: number
 *                 description: maximo do valor da ação
 *                 example: 10000000
 *               city:
 *                 type: array
 *                 description: Nome das cidades solicitadas
 *                 example: ["São Paulo", "Campinas"]
 *               state:
 *                 type: array
 *                 description: Estado dos processo solicitados
 *                 example: ["SP"]
 *     responses:
 *       200:
 *         description: Sucesso - Retorna o resultado da operação solicitada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 numberprocess:
 *                   type: number
 *                   exemple: 100
 *       400:
 *         description: Valores não reconhecidos
 *       500:
 *         description: Erro interno no servidor
 */
router.post("/processes/total-number", [
    check("banks", "Bancos é opcional").optional().isArray(),
    check("minimum_value", "Valor Minimo é Opcional").optional().isNumeric(),
    check("maximum_value", "Valor Maximo é Opcional").optional().isNumeric(),
    check("city", "Cidade é Opcional").optional().isString(),
    check("state", "Estado é Opcional").optional().isString()
], totalNumberProcess);

/**
  * @swagger
 * /api/processes/export:
 *   post:
 *     summary: Obter processos com base nos filtros
 *     description: Pesquisa  processos com os filtros aplicados 
 *     tags:
 *       - Processos Disponiveis
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               banks:
 *                 type: array
 *                 description: Nome dos bancos solicitados
 *                 example: ["Banco do Brasil", "Bradesco"]
 *               minimum_value:
 *                 type: number
 *                 description: Minimo do valor da ação
 *                 example: 10000
 *               maximum_value:
 *                 type: number
 *                 description: maximo do valor da ação
 *                 example: 10000000
 *               city:
 *                 type: array
 *                 description: Nome das cidades solicitadas
 *                 example: ["São Paulo", "Campinas"]
 *               state:
 *                 type: array
 *                 description: Estado dos processo solicitados
 *                 example: ["SP"]
 *     responses:
 *       200:
 *         description: Sucesso - Retorna o resultado da operação solicitada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 numberprocess:
 *                   type: number
 *                   exemple: 100
 *       400:
 *         description: Valores não reconhecidos
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/processes/export', [
    check('banks').optional().isArray().withMessage('Banks deve ser um array'),
    check('minimum_value').optional().isNumeric().withMessage('Minimum value deve ser um número'),
    check('maximum_value').optional().isNumeric().withMessage('Maximum value deve ser um número'),
    check('city').optional().isArray().withMessage('City deve ser um array'),
    check('state').optional().isArray().withMessage('State deve ser um array'),
], exportProcesses);

module.exports = router;