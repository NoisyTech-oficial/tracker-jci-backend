const express = require("express");
const router = express.Router();
const { processesWithDetails, updateDetailsObtainedProcess, getProcessCountForCNPJ } = require("../controllers/processesObtainedController");
const { check } = require('express-validator');

/**
 * @swagger
 * /api/processes-obtained/details:
 *   get:
 *     summary: Obter processos já obtidos com detalhes
 *     description: Retorna processos obtidos com detalhes do cliente e do processo.
 *     tags:
 *       - Processos Obtidos
 *     security:
 *       - bearerAuth: []  # Token JWT obrigatório para autenticação
 *     responses:
 *       200:
 *         description: Processos obtidos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do processo obtido
 *                     example: 1
 *                   process_number:
 *                     type: string
 *                     description: Número do processo
 *                     example: "1001963-18.2025.8.26.0562"
 *                   employer_document:
 *                     type: string
 *                     description: Documento do empregador (CNPJ)
 *                     example: "1234567890001"
 *                   export_document:
 *                     type: string
 *                     description: Documento de quem exportou os processos
 *                     example: "9876543210001"
 *                   data_exporting:
 *                     type: string
 *                     format: date-time
 *                     description: Data e hora da exportação dos processos
 *                     example: "2024-03-12T10:00:00Z"
 *                   crm_update_document:
 *                     type: string
 *                     nullable: true
 *                     description: Documento de quem atualizou o CRM
 *                     example: "55555555000199"
 *                   status:
 *                     type: string
 *                     enum: ["Cliente encontrado", "Cliente desconhecido", "Processo desativado"]
 *                     description: Status do processo no CRM
 *                     example: "Cliente encontrado"
 *                   notes:
 *                     type: string
 *                     nullable: true
 *                     description: Observações sobre o processo
 *                     example: "Processo ativo"
 *                   company_name:
 *                     type: string
 *                     description: Nome do cliente associado ao processo
 *                     example: "Maria Angela"
 *                   cpf_cnpj:
 *                     type: string
 *                     description: CPF ou CNPJ do cliente
 *                     example: "12345678901"
 *                   phone1:
 *                     type: string
 *                     description: Número de telefone principal
 *                     example: "11987654321"
 *                   phone2:
 *                     type: string
 *                     nullable: true
 *                     description: Número de telefone secundário
 *                     example: "11976543210"
 *                   email:
 *                     type: string
 *                     nullable: true
 *                     description: Email do cliente
 *                     example: "empresa@email.com"
 *                   address:
 *                     type: string
 *                     nullable: true
 *                     description: Endereço do cliente
 *                     example: "Rua das Empresas, 123"
 *                   installment_amount:
 *                     type: number
 *                     format: float
 *                     description: Valor da parcela
 *                     example: 1500.00
 *                   remaining_installments:
 *                     type: integer
 *                     description: Quantidade de parcelas faltantes
 *                     example: 12
 *                   paid_installments:
 *                     type: integer
 *                     description: Quantidade de parcelas pagas
 *                     example: 24
 *                   overdue_installments:
 *                     type: integer
 *                     description: Quantidade de parcelas em atraso
 *                     example: 3
 *                   vehicle_brand:
 *                     type: string
 *                     nullable: true
 *                     description: Marca do veículo
 *                     example: "Toyota"
 *                   vehicle_model:
 *                     type: string
 *                     nullable: true
 *                     description: Modelo do veículo
 *                     example: "Corolla"
 *                   vehicle_color:
 *                     type: string
 *                     nullable: true
 *                     description: Cor do veículo
 *                     example: "Prata"
 *                   vehicle_year:
 *                     type: string
 *                     nullable: true
 *                     description: Ano do veículo
 *                     example: "2022"
 *                   vehicle_plate:
 *                     type: string
 *                     nullable: true
 *                     description: Placa do veículo
 *                     example: "ABC1D23"
 *                   vehicle_renavam:
 *                     type: string
 *                     nullable: true
 *                     description: Renavam do veículo
 *                     example: "123456789"
 *                   contract_interest_rate:
 *                     type: number
 *                     format: float
 *                     description: Taxa de juros do contrato
 *                     example: 2.5
 *                   contract_fee:
 *                     type: number
 *                     format: float
 *                     description: Taxa administrativa do contrato
 *                     example: 10.00
 *                   credit_life_insurance:
 *                     type: boolean
 *                     description: Seguro prestamista
 *                     example: true
 *                   contract_number:
 *                     type: string
 *                     nullable: true
 *                     description: Número do contrato
 *                     example: "CONTRATO-001"
 *       400:
 *         description: Requisição inválida (Parâmetros ausentes ou incorretos)
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Nenhum processo encontrado para esse empregador
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/processes-obtained/details", processesWithDetails);

/**
 * @swagger
 * /api/processes-obtained/details:
 *   put:
 *     summary: Atualizar status e notas de um processo
 *     description: Atualiza o status, notes e a data de atualização do CRM (`crm_update_document`) para um processo obtido, verificando tanto o número do processo quanto o CNPJ do empregador.
 *     tags:
 *       - Processos Obtidos
 *     security:
 *       - bearerAuth: []  # Token JWT obrigatório para autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - processNumber
 *             properties:
 *               processNumber:
 *                 type: string
 *                 description: Número do processo que será atualizado
 *                 example: "1001963-18.2025.8.26.0562"
 *               status:
 *                 type: string
 *                 enum: ["Cliente encontrado", "Cliente desconhecido", "Processo desativado"]
 *                 description: Novo status do processo (opcional)
 *                 example: "Cliente encontrado"
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 description: Observações adicionais sobre o processo (opcional)
 *                 example: "Processo revisado e atualizado"
 *     responses:
 *       200:
 *         description: Processo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Processo atualizado com sucesso!"
 *       400:
 *         description: Requisição inválida (Parâmetros ausentes ou incorretos)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Os campos processNumber e employerDocument são obrigatórios."
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Processo não encontrado para o empregador informado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Processo não encontrado para o empregador informado."
 *       500:
 *         description: Erro interno no servidor
 */
router.put("/processes-obtained/details", [
    check("processNumber").isString().not().optional().withMessage("O número do processo é obrigatório"),
    check("status").optional().isIn(['Cliente encontrado', 'Cliente desconhecido', 'Processo desativado']).withMessage("O status deve ser 'Cliente encontrado', 'Cliente desconhecido' ou 'Processo desativado'"),
    check("notes").optional().isString().withMessage("As notas devem ser uma string"),
], updateDetailsObtainedProcess);

/**
 * @swagger
 * /api/processes-obtained/number-processes-obtained:
 *   get:
 *     summary: Obter a quantidade de processos obtidos e o limite para um CNPJ
 *     description: Retorna o total de processos visualizados vinculados a um CNPJ no mês e ano informados, além do limite de processos permitido conforme o plano.
 *     tags:
 *       - Processos Obtidos
 *     security:
 *       - bearerAuth: []  # Token JWT obrigatório para autenticação
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *         description: Mês desejado (1 a 12)
 *         example: 3
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ano desejado
 *         example: 2024
 *     responses:
 *       200:
 *         description: Quantidade de processos obtidos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 month:
 *                   type: integer
 *                   description: Mês consultado
 *                   example: 3
 *                 year:
 *                   type: integer
 *                   description: Ano consultado
 *                   example: 2024
 *                 usedProcesses:
 *                   type: integer
 *                   description: Quantidade de processos utilizados no período
 *                   example: 15
 *                 limitProcesses:
 *                   type: integer
 *                   description: Limite de processos disponível conforme o plano
 *                   example: 50
 *       400:
 *         description: Requisição inválida (Parâmetros ausentes ou incorretos)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Os parâmetros cnpj, month e year são obrigatórios."
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Nenhum dado encontrado para esse CNPJ no período informado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado para o CNPJ informado."
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/processes-obtained/total-number", getProcessCountForCNPJ);

module.exports = router;