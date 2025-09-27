const express = require("express");
const router = express.Router();
const statusLeadController = require("../controllers/statusLeadController");

/**
 * @swagger
 * tags:
 *   name: StatusLead
 *   description: Endpoints de gerenciamento de status dos leads
 */

/**
 * @swagger
 * /api/status:
 *   post:
 *     summary: Criar um novo status
 *     description: Adiciona um novo status de lead ao sistema.
 *     tags: [StatusLead]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Em andamento
 *               descricao:
 *                 type: string
 *                 example: Lead em processo de contato
 *               codigo_cor:
 *                 type: string
 *                 example: "#FF5733"
 *     responses:
 *       201:
 *         description: Status criado com sucesso
 *       400:
 *         description: Erro ao criar status
 */
router.post("/status", statusLeadController.novoStatus);

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Listar todos os status
 *     description: Retorna a lista completa de status de leads cadastrados.
 *     tags: [StatusLead]
 *     responses:
 *       200:
 *         description: Lista de status retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                   codigo_cor:
 *                     type: string
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/status", statusLeadController.listarStatus);

/**
 * @swagger
 * /api/status/{id}:
 *   put:
 *     summary: Atualizar um status
 *     description: Atualiza os dados de um status existente.
 *     tags: [StatusLead]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do status a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Contatado
 *               descricao:
 *                 type: string
 *                 example: Lead já foi contatado
 *               codigo_cor:
 *                 type: string
 *                 example: "#008000"
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar status
 *       404:
 *         description: Status não encontrado
 */
router.put("/status/:id", statusLeadController.atualizarStatus);

/**
 * @swagger
 * /api/status/{id}:
 *   delete:
 *     summary: Deletar um status
 *     description: Remove um status existente do sistema.
 *     tags: [StatusLead]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do status a ser removido
 *     responses:
 *       200:
 *         description: Status removido com sucesso
 *       404:
 *         description: Status não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.delete("/status/:id", statusLeadController.deletarStatus);

module.exports = router;