const DocumentoProcesso = require("./DocumentosProcessoModel");
const Lead = require("./LeadsModel");
const Status = require("./StatusLeadModel");
const Usuarios = require("./UsuariosModel");
const Advogado = require("./AdvogadoModel");

function setAssociations() {
  // Relacionamento Leads -> Status
  Lead.belongsTo(Status, { foreignKey: "id_status", as: "status" });
  Status.hasMany(Lead, { foreignKey: "id_status", as: "leads" });

  // Relacionamento DocumentoProcesso -> Lead
  DocumentoProcesso.belongsTo(Lead, { foreignKey: "id_lead", as: "lead" });
  Lead.hasMany(DocumentoProcesso, { foreignKey: "id_lead", as: "documentos" });
  Advogado.hasMany(Usuarios, { foreignKey: "id_advogado", as: "usuarios" });
  Usuarios.belongsTo(Advogado, { foreignKey: "id_advogado", as: "advogado" });
  // Relacionamento futuro com Advogado
  // Advogado.hasMany(Lead, { foreignKey: "id_advogado" });
}

module.exports = { setAssociations };