const express = require('express');
const ReportService = require('../services/ReportService');

const router = express.Router();
const reportService = new ReportService();

router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const report = await reportService.getUserFullReport(email);
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;