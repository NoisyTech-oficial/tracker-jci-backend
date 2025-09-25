const { getProcessesWithDetails, changeDetailsObtainedProcess, processCountForCNPJ } = require('../services/processesObtainedService');   

const processesWithDetails = async (req, res) => {
  try {
      const employerDocument = req.user.documentCompany ?? req.user.document;
      const isPlus = req.user.plan_plus;

      if (!employerDocument) {
          return res.status(400).json({ message: "O campo employerDocument é obrigatório." });
      }

      const processes = await getProcessesWithDetails(employerDocument, isPlus);
      res.status(200).json(processes);
  } catch (error) {
    if (error.message === "Nenhum processo encontrado para esse usuário.") {
      return res.status(404).json({ message: error.message });  
    }
    
    return res.status(500).json({ message: "Erro ao obter processos", error: error.message });
  }
};

const updateDetailsObtainedProcess = async (req, res) => {
  try {
    const documentCompany = req.user.documentCompany ?? req.user.document;
    const { processNumber, status, notes } = req.body;

    if (!processNumber && !status && !notes) {
      return res.status(400).json({ message: "O campo processNumber e status ou notes são obrigatórios." });
    }

    const response = await changeDetailsObtainedProcess(documentCompany, processNumber, status, notes);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar o processo", error: error.message });
  }
};

const getProcessCountForCNPJ = async (req, res) => {
  try {
      const employerDocument = req.user.documentCompany ?? req.user.document;
      const { month, year } = req.query;

      if (!month || !year) {
          return res.status(400).json({ message: "Os campos month e year são obrigatórios." });
      }

      const response = await processCountForCNPJ(employerDocument, month, year);
      res.status(200).json(response);
  } catch (error) {
      res.status(500).json({ message: "Erro ao obter a quantidade de processos", error: error.message });
  }
};

module.exports = { processesWithDetails, updateDetailsObtainedProcess, getProcessCountForCNPJ };

