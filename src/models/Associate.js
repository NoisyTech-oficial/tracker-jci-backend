// src/models/associate.js
const ProcessDetails = require("./ProcessDetailsModel");
const Processes = require("./ProcessesModel");
const cep = require("./CepModel");

function setAssociations() {
  if (ProcessDetails.associate) {
    ProcessDetails.associate({ processes: Processes });
  }
  if (Processes.associate) {
    Processes.associate({ ProcessDetails, cep });
  }
  if (cep.associate) {
    cep.associate({ processes: Processes });
  }
}

module.exports = { setAssociations };