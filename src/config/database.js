const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: console.log,
        dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false }  // 🔒 habilita conexão SSL
        }
    }
);

// sequelize.sync({ alter: true }) 
    // .then(() => console.log("📦 Banco de dados sincronizado e atualizado!"))
    // .catch((err) => console.error("❌ Erro ao sincronizar banco:", err));

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("🟢 Conexão com o banco de dados estabelecida com sucesso.");
    } catch (error) {
        console.error("🔴 Erro ao conectar ao banco de dados:", error);
    }
};

testConnection();

module.exports = sequelize;
