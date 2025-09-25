const { Op, Sequelize } = require("sequelize");
const Processes = require('../models/ProcessesModel');
const ProcessDetails = require('../models/ProcessDetailsModel');
const CEP = require('../models/CepModel');
const ProcessesObtained = require('../models/ProcessesObtainedModel');

/**
 * Aplica as condições específicas do plano no objeto whereClause.
 * @param {object} whereClause - Objeto com as condições já aplicadas.
 * @param {string} plan - Plano do usuário (BASIC, INTERMEDIARIO, PREMIUM).
 * @returns {object} whereClause modificado.
 */
function applyPlanFilters(whereClause, plan) {
  const allowedPlans = ['BASICO', 'INTERMEDIARIO', 'PREMIUM'];
  
  if (!plan || !allowedPlans.includes(plan.toUpperCase())) {
    // Retorna zero resultados
    whereClause.id = { [Op.eq]: null };
    return whereClause;
  }
  
  if (plan.toUpperCase() === 'BASICO') {
    whereClause.updated_at = { [Op.not]: null };
  } else if (plan.toUpperCase() === 'INTERMEDIARIO') {
    const today = new Date();
    // getDay(): 0=Domingo, 1=Segunda, …, 6=Sábado
    const daysToSubtract = today.getDay() === 1 ? 3 : 1; 

    const targetDay = new Date();
    targetDay.setDate(today.getDate() - daysToSubtract);

    const startOfDay = new Date(
      targetDay.getFullYear(),
      targetDay.getMonth(),
      targetDay.getDate(),
      0, 0, 0
    );
    const endOfDay = new Date(
      targetDay.getFullYear(),
      targetDay.getMonth(),
      targetDay.getDate(),
      23, 59, 59
    );

    whereClause.created_at = {
      [Op.between]: [startOfDay, endOfDay]
    };
  } else if (plan.toUpperCase() === 'PREMIUM') {
    const now = new Date();
    let startDate;
    
    if (now.getDay() === 1) {
      const lastFriday = new Date(now);
      lastFriday.setDate(now.getDate() - 3);
      lastFriday.setHours(20, 0, 0, 0);
      startDate = lastFriday;
    } else {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      yesterday.setHours(20, 0, 0, 0);
      startDate = yesterday;
    }
    
    // Filtra os processos entre a data de início definida e o momento atual
    whereClause.created_at = {
      [Op.between]: [startDate, now]
    };
  }
  
  return whereClause;
}

// Alteração- Função add "Ready" inicio:
function buildFilters({ banks, minimum_value, maximum_value, city, state, plan }) {
  const whereClause = {};

  // 🔹 Regra para apenas processos prontos
  whereClause.ready = true;

  if (banks && Array.isArray(banks) && banks.length > 0) {
    whereClause.applicant_name = { [Op.in]: banks };
  }

  if (minimum_value || maximum_value) {
    whereClause.value = {};
    if (minimum_value) {
      whereClause.value[Op.gte] = minimum_value;
    }
    if (maximum_value) {
      whereClause.value[Op.lte] = maximum_value;
    }
  }

  applyPlanFilters(whereClause, plan);

  if ((state && state.length > 0) || (city && city.length > 0)) {
    const cepWhere = {};
    if (state && state.length > 0) {
      cepWhere.state = { [Op.in]: state };
    }
    if (city && city.length > 0) {
      cepWhere.city = { [Op.in]: city };
    }

    return CEP.findAll({
      attributes: ['id'],
      where: cepWhere
    }).then(ceps => {
      const cepIds = ceps.map(cep => cep.id);
      whereClause.cidade_id = { [Op.in]: cepIds };
      return whereClause;
    });
  }

  return Promise.resolve(whereClause);
}
// Fim da alteração

async function getTotalNumberProcess(filters) {
  const whereClause = await buildFilters(filters);

  // Excluir processos já visualizados por determinado documento
  if (filters.document) {
    const visualizedRecords = await ProcessesObtained.findAll({
      attributes: ['process_number'],
      where: { employer_document: filters.document }
    });
    const visualizedProcessNumbers = visualizedRecords.map(item => item.process_number);
    if (visualizedProcessNumbers.length > 0) {
      whereClause.process_number = { [Op.notIn]: visualizedProcessNumbers };
    }
  }

  return Processes.count({ where: whereClause });
}

async function getExportData(filters) {
  const whereClause = await buildFilters(filters);

  // Excluir processos já visualizados por determinado documento
  if (filters.document) {
    const visualizedRecords = await ProcessesObtained.findAll({
      attributes: ['process_number'],
      where: { employer_document: filters.document }
    });
    const visualizedProcessNumbers = visualizedRecords.map(item => item.process_number);
    if (visualizedProcessNumbers.length > 0) {
      whereClause.process_number = { [Op.notIn]: visualizedProcessNumbers };
    }
  }

  const processesAtributes = ['process_number', 'applicant_name', 'value', 'distribution_date'];
  const processesDetailsAtributes = await getProcessesDetailsAtributes(filters.plan_plus);
  const cityAtributes = ['city', 'state'];

  const exportData = await Processes.findAll({
    attributes: processesAtributes,
    where: whereClause,
    include: [
      {
        model: ProcessDetails,
        as: 'client',
        attributes: processesDetailsAtributes
      },
      {
        model: CEP,
        as: 'cep',
        attributes: cityAtributes
      }
    ]
  });

  return exportData.map(process => ({
    process_number: process.process_number,
    applicant_name: process.applicant_name,
    value: process.value,
    cpf_cnpj: process.client ? process.client.cpf_cnpj : null,
    company_name: process.client ? process.client.company_name : null,
    phone1: process.client ? process.client.phone1 : null,
    phone2: process.client ? process.client.phone2 : null,
    email: process.client ? process.client.email : null,
    address: process.client ? process.client.address : null,
    installment_amount: process.client ? process.client.installment_amount : null,
    remaining_installments: process.client ? process.client.remaining_installments : null,
    paid_installments: process.client ? process.client.paid_installments : null,
    overdue_installments: process.client ? process.client.overdue_installments : null,
    vehicle_brand: process.client ? process.client.vehicle_brand : null,
    vehicle_model: process.client ? process.client.vehicle_model : null,
    vehicle_color: process.client ? process.client.vehicle_color : null,
    vehicle_year: process.client ? process.client.vehicle_year : null,
    vehicle_plate: process.client ? process.client.vehicle_plate : null,
    vehicle_renavam: process.client ? process.client.vehicle_renavam : null,
    contract_interest_rate: process.client ? process.client.contract_interest_rate : null,
    contract_fee: process.client ? process.client.contract_fee : null,
    credit_life_insurance: process.client ? process.client.credit_life_insurance : null,
    contract_number: process.client ? process.client.contract_number : null,
    cep: {
      city: process.cep ? process.cep.city : null,
      state: process.cep ? process.cep.state : null,
    },
    distribution_date: process.distribution_date ? process.distribution_date : null
  }));
}

async function getProcessesDetailsAtributes(isPlus) {
  if (!isPlus) { 
    // Se não for 'plus', retorna atributos básicos
    return ['company_name', 'cpf_cnpj', 'phone1', 'phone2'];
  }

  // Se for 'plus', retorna os atributos adicionais
  return [
    'company_name',
    'cpf_cnpj',
    'phone1',
    'phone2',
    'email',
    'address',
    'installment_amount',
    'remaining_installments',
    'paid_installments',
    'overdue_installments',
    'vehicle_brand',
    'vehicle_model',
    'vehicle_color',
    'vehicle_year',
    'vehicle_plate',
    'vehicle_renavam',
    'contract_interest_rate',
    'contract_fee',
    'credit_life_insurance',
    'contract_number'
  ];
}

module.exports = { getTotalNumberProcess, getExportData };
