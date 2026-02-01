const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const loanRoutes = require('./routes/loan.routes');
const reportRoutes = require('./routes/report.routes');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/reports', reportRoutes);

module.exports = app;