const express = require('express');
const LoanService = require('../services/LoanService');
const { cacheEquiposDisponibles, resolveEquiposDisponibles } = require('../middleware/cacheEquiposDisponibles');

const router = express.Router();
const loanService = new LoanService();

/** POST /api/loans - Prestar equipo (usa realizarPrestamo con idEquipo, idUsuario). */
router.post('/', async (req, res) => {
  try {
    const { email, equipment, quantity = 1 } = req.body;
    const result = await loanService.realizarPrestamo(equipment, email, quantity);
    // Ahora result contiene { status, message }
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/** PUT /api/loans/return/:loanId - Devolver equipo (lógica polimórfica computadora/periférico). */
router.put('/return/:loanId', async (req, res) => {
  try {
    const loanId = parseInt(req.params.loanId);
    const { email } = req.body;
    const result = await loanService.returnEquipment(loanId, email);
    res.json(result);
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

/** GET /api/loans/available - Equipos disponibles (caché Redis en saturación). */
router.get('/available', cacheEquiposDisponibles, async (req, res) => {
  try {
    await resolveEquiposDisponibles(req, res, () => loanService.getAllInventory());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** GET /api/loans/equipment/:id - Read de un equipo por ID (CRUD). */
router.get('/equipment/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const equipment = await loanService.getEquipmentById(id);
    if (!equipment) return res.status(404).json({ error: 'Equipo no encontrado' });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** PUT /api/loans/equipment/:id - Update de un equipo (CRUD). */
router.put('/equipment/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await loanService.updateEquipment(id, req.body);
    res.json({ message: 'Equipo actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas dinámicas al final (Las que tienen :parámetro)
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