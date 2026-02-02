/**
 * Ruta /api/reporte-sistema: métricas para evidencia de saturación.
 */
const express = require('express');
const router = express.Router();

const TOTAL_REQUESTS_KEY = 'total_requests';
const COUNT_KEY = 'available_request_count';
const THRESHOLD = 50;

/**
 * GET /api/reporte-sistema
 * Devuelve:
 * - totalPeticiones: total histórico de peticiones
 * - fuente_datos: estado del sistema bajo carga (DB vs Caché Redis)
 */
router.get('/reporte-sistema', async (req, res) => {
  try {
    const redis = req.app.locals.redisClient;

    let totalPeticiones = 0;
    let fuente_datos = 'Base de Datos';

    if (redis && redis.isOpen) {
      const [total, count] = await Promise.all([
        redis.get(TOTAL_REQUESTS_KEY),
        redis.get(COUNT_KEY),
      ]);

      totalPeticiones = parseInt(total || '0', 10);
      const concurrentAvailable = parseInt(count || '0', 10);

      if (concurrentAvailable > THRESHOLD) {
        fuente_datos = 'Caché Redis';
      }
    }

    res.json({
      totalPeticiones,
      fuente_datos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;