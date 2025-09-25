const ProcessesObtained = require('../models/ProcessesObtainedModel');
const ProcessDetails = require("../models/ProcessDetailsModel");
const Processes = require("../models/ProcessesModel");
const Users = require("../models/UsersModel");
const CEP = require('../models/CepModel');

const { Op } = require("sequelize");

async function registerExportedProcesses(processesData, user) {
  // Extrai os números dos processos exportados
  let processes = [];

  processesData.map(item => {
    processes.push({
      processNumber: item.process_number, 
      distribution_date: item.distribution_date 
    });
  });

  // Monta os registros para inserção
  const recordsToInsert = processes.map(item => ({
    process_number: item.processNumber,
    employer_document: user.documentCompany ? user.documentCompany : user.document,
    export_document: user.document,
    data_exporting: new Date(),
    crm_update_document: null,
    status: null,
    notes: null,
  }));

  try {
    // Registra os processos exportados na tabela
    await ProcessesObtained.bulkCreate(recordsToInsert);
    console.log("Processos exportados registrados com sucesso.");
  } catch (error) {
    console.error("Erro ao registrar os processos exportados:", error);
    throw error;
  }
};

async function getProcessesWithDetails(employerDocument, isPlus) {
  try {
    // 1. Buscar processos pelo `employer_document`
    const processes = await ProcessesObtained.findAll({
      where: {
        employer_document: employerDocument
      },
      raw: true
    });

    if (processes.length === 0) {
      throw new Error("Nenhum processo encontrado para esse usuário.");
    }

    // 2. Extrair os números dos processos
    const processNumbers = processes.map(p => p.process_number);

    const baseProcesses = await Processes.findAll({
      where: {
        process_number: {
          [Op.in]: processNumbers
        }
      },
      include: [
        {
          model: CEP,
          as: "cep",
          attributes: ["city", "state"]
        }
      ],
      raw: true,
      nest: true
    });    

    // 3. Buscar detalhes dos processos na tabela `process_details`
    const details = await ProcessDetails.findAll({
      where: {
        process_number: {
          [Op.in]: processNumbers
        }
      },
      raw: true
    });

    // 4. Criar um mapa para acesso rápido dos detalhes por `process_number`
    const detailsMap = {};
    details.forEach(detail => {
      detailsMap[detail.process_number] = detail;
    });

    const baseMap = {};
    baseProcesses.forEach(p => {
      baseMap[p.process_number] = p;
    });

    // 5. Combinar os dados das duas tabelas e retornar apenas os campos necessários
    const combinedData = processes.map(process => {
      const details = detailsMap[process.process_number] || {};
      const base = baseMap[process.process_number] || {};

      return isPlus ? {
        ...process, // Retorna todos os dados caso seja Plus
        ...details,
        ...base
      } : {
        // Retorna apenas os campos básicos se não for Plus
        id: process.id,
        process_number: process.process_number,
        applicant_name: base.applicant_name || null,
        value: base.value || null,
        company_name: details.company_name || null,
        cpf_cnpj: details.cpf_cnpj || null,
        phone1: details.phone1 || null,
        phone2: details.phone2 || null,
        city: base.city || null,
        state: base.state || null,
        distribution_date: base.distribution_date || null,
        export_document: process.export_document,
        data_exporting: process.data_exporting,
        crm_update_document: process.crm_update_document,
        status: process.status,
        notes: process.notes,
      };
    });

    return combinedData;
  } catch (error) {
    throw new Error(error.message || "Erro ao obter processos e detalhes.");
  }
};

async function changeDetailsObtainedProcess(documentCompany, processNumber, status, notes) {
  try {
    // Verifica se o processo existe
    const process = await ProcessesObtained.findOne({
      where: {
        process_number: processNumber,
        employer_document: documentCompany
      }
    });

    if (!process) {
      throw new Error("Processo não encontrado.");
    }

    // Define os campos que serão atualizados
    const updateFields = {};
    if (status) updateFields.status = status;
    if (notes) updateFields.notes = notes;
    updateFields.crm_update_document = new Date().toISOString();

    await process.update(updateFields);

    return {
      message: "Processo atualizado com sucesso!"
    };
  } catch (error) {
    throw new Error(error.message || "Erro ao atualizar o processo.");
  }
};

async function processCountForCNPJ(cnpj, month, year) {
  try {
    // 1. Conta os processos visualizados no mês e ano informados
    const startDate = new Date(year, month - 1, 1); // Primeiro dia do mês
    const endDate = new Date(year, month, 0, 23, 59, 59); // Último dia do mês

    const processCount = await ProcessesObtained.count({
      where: {
        employer_document: cnpj,
        data_exporting: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    // 2. Obtém o limite de processos do usuário na tabela Users
    const user = await Users.findOne({
      where: {
        document: cnpj
   
      },
      attributes: ["number_available_processes"],
      raw: true
    });

    if (!user) {
      throw new Error("Usuário não encontrado para o CNPJ informado.");
    }

    return {
      usedProcesses: processCount,
      limitProcesses: user.number_available_processes
    };
  } catch (error) {
    throw new Error(error.message || "Erro ao obter quantidade de processos.");
  }
};

module.exports = {
  registerExportedProcesses,
  getProcessesWithDetails,
  changeDetailsObtainedProcess,
  processCountForCNPJ
};