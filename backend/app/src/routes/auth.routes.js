const express = require('express');
const AuthService = require('../services/AuthService');

const router = express.Router();
const authService = new AuthService();

/** POST /api/auth/login - Inicio de sesión (contraseña validada con bcrypt). */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/** POST /api/auth/register - Registro de usuario (contraseña hasheada con bcrypt). */
router.post('/register', async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;