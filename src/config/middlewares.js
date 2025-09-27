const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const setupMiddlewares = (app) => {
    app.use(express.json());  // Permite trabalhar com JSON
    app.use(cors());          // Habilita CORS
};

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "Acesso negado! Token não fornecido." });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido!" });
    }
};

module.exports = { setupMiddlewares, authMiddleware };
