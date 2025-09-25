// config/initDatabase.js
const sequelize = require("./database");
const { setAssociations } = require("../models/Associate");

// Importa os modelos para que sejam definidos e registrados
require("../models/ProcessDetailsModel");
require("../models/ProcessesModel");
require("../models/CepModel");
require("../models/ProcessesObtainedModel");
require("../models/UsersModel");
require("../models/BanksModel");

async function initDatabase() {
  // Configura as associações
  setAssociations();

  // Sincroniza o banco de dados (altere as opções conforme sua necessidade)
  try {
    await sequelize.sync({ alter: true });
    console.log("📦 Banco de dados sincronizado e atualizado!");
  } catch (error) {
    console.error("❌ Erro ao sincronizar banco:", error);
    throw error;
  }
}

module.exports = initDatabase;
