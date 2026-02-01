const express = require('express');
const AuthService = require('../services/AuthService');

const router = express.Router();
const authService = new AuthService();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;