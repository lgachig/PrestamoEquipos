const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const loanRoutes = require('./routes/loan.routes');
const reportRoutes = require('./routes/report.routes');
const requestCounter = require('./middleware/requestCounter');
const reporteSistema = require('./routes/reporte-sistema.routes');

const app = express();

app.locals.redisClient = null;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(requestCounter);

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', reporteSistema);
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

module.exports = app;