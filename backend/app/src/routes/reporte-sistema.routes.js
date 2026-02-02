/**
 * Ruta /api/reporte-sistema: métricas para evidencia (peticiones totales, fuente de datos).
 */
const express = require('express');
const router = express.Router();

const TOTAL_REQUESTS_KEY = 'total_requests';
const COUNT_KEY = 'available_request_count';
const THRESHOLD = 50;

/** GET /api/reporte-sistema - Devuelve peticiones totales y fuente_datos (DB vs Caché Redis). */
router.get('/reporte-sistema', async (req, res) => {
  try {
    const redis = req.app.locals.redisClient;
    let totalPeticiones = 0;
    let fuente_datos = 'Base de Datos';

    if (redis && redis.isOpen) {
      try {
        const total = await redis.get(TOTAL_REQUESTS_KEY);
        totalPeticiones = parseInt(total || '0', 10);
        const count = await redis.get(COUNT_KEY);
        const n = parseInt(count || '0', 10);
        if (n > THRESHOLD) {
          fuente_datos = 'Caché Redis';
        }
      } catch (e) {
        // ignore
      }
    }

    res.json({
      totalPeticiones,
      fuente_datos
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
