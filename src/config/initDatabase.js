// config/initDatabase.js
const sequelize = require("./database");
const { setAssociations } = require("../models/Associate");

// Importa os modelos para que sejam definidos e registrados
require("../models/AdvogadoModel");
require("../models/DocumentosProcessoModel");
require("../models/LeadsModel");
require("../models/StatusLeadModel");
require("../models/UsuariosModel");

async function initDatabase() {
  // Sincroniza o banco de dados (altere as opções conforme sua necessidade)
  try {
    setAssociations();
    await sequelize.sync({ alter: true });
    console.log("📦 Banco de dados sincronizado e atualizado!");
  } catch (error) {
    console.error("❌ Erro ao sincronizar banco:", error);
    throw error;
  }
}

module.exports = initDatabase;
