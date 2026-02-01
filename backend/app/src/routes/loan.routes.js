const express = require('express');
const LoanService = require('../services/LoanService');

const router = express.Router();
const loanService = new LoanService();

// Prestar equipo
router.post('/', async (req, res) => {
  try {
    const { email, equipment, quantity } = req.body; 
    await loanService.loanEquipment(email, equipment, quantity);
    res.json({ message: 'Préstamo realizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.put('/return/:loanId', async (req, res) => {
  try {
    const loanId = parseInt(req.params.loanId);
    const { email } = req.body; 
    await loanService.returnEquipment(loanId, email);
    res.json({ message: 'Equipo devuelto correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const allHistory = await loanService.getAllLoans(); 
    res.json(allHistory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/active', async (req, res) => {
  try {
    const activeLoans = await loanService.getActiveLoans(); 
    res.json(activeLoans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/available', async (req, res) => {
  try {
    const inventory = await loanService.getAllInventory();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Rutas dinámicas al final (Las que tienen :parámetro)
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const history = await loanService.getUserLoanHistory(email);
    res.json(history);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// AGREGAR EQUIPO
router.post('/equipment', async (req, res) => {
  try {
    const { name, type, quantity } = req.body;
    await loanService.addEquipment(name, type, quantity); // Verifica que LoanService tenga este método
    res.json({ message: 'Equipo agregado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ELIMINAR EQUIPO
// Nota: Usa /:id para que Express reconozca el parámetro
router.delete('/equipment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await loanService.deleteEquipment(id); 
    res.json({ message: 'Equipo eliminado' });
  } catch (error) {
    // Si el error es por préstamos activos, aquí caerá el mensaje
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;