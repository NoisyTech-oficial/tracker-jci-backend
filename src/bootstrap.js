// bootstrap.js
const initDatabase = require("./config/initDatabase");

initDatabase()
  .then(() => {
    // Após a inicialização do banco, inicia o servidor
    require("./server");
  })
  .catch((err) => {
    console.error("Falha ao inicializar o banco de dados. O servidor não será iniciado.", err);
  });
