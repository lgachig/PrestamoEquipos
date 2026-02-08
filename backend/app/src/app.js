const express = require('express');
const cors = require('cors');
const os = require('os');

const authRoutes = require('./routes/auth.routes');
const loanRoutes = require('./routes/loan.routes');
const reportRoutes = require('./routes/report.routes');
const requestCounter = require('./middleware/requestCounter');
const reporteSistema = require('./routes/reporte-sistema.routes');

const app = express();

app.locals.redisClient = null;

// Configuración de CORS dinámica para el clúster
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// EVIDENCIA: Header para identificar la instancia que atiende la petición
app.use((req, res, next) => {
  res.setHeader('X-Backend-Instance', os.hostname());
  next();
});

app.use(requestCounter);

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', reporteSistema);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", instance: os.hostname() });
});

module.exports = app;