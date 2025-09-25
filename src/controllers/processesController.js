const { getTotalNumberProcess, getExportData } = require('../services/processesService');
const { registerExportedProcesses } = require('../services/processesObtainedService');   

const totalNumberProcess = async (req, res) => {
  try {
    const filters = {
      ...req.body,
      plan: req.user.plan,
      document: req.user.document
    };
    
    const total = await getTotalNumberProcess(filters);
    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const exportProcesses = async (req, res) => {
  try {    
    const filters = {
      ...req.body,
      plan: req.user.plan,
      plan_plus: req.user.plan_plus,
      document: req.user.document,
      document_company: req.user.documentCompany
    };
    
    const data = await getExportData(filters);

    // Registra os processos exportados na tabela de visualizados
    if (data.length > 0) {
      await registerExportedProcesses(data, req.user);
    }

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = { totalNumberProcess, exportProcesses };

