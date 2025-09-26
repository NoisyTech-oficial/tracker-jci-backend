// Express
const express = require("express");

// Rotas
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const administratorRoutes = require("./routes/administratorRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

// Services
const { verifyToken } = require("./services/authService");

// Configurações
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const init = require("./config/initDatabase");
const { setupMiddlewares } = require("./config/middlewares");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS
const allowedOrigins = [
 "https://juristracker.com.br"
];

app.use(cors({
  origin: (origin, callback) => {
    // Se você quiser liberar todas as origens, pode deixar simplesmente:
    //callback(null, true);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Não permitido pelo CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middlewares globais
app.use(express.json());

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api", verifyToken, [
  userRoutes,
  administratorRoutes,
  employeeRoutes,
]);

setupMiddlewares(app);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
