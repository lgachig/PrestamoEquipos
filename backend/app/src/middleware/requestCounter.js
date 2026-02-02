/**
 * Middleware que incrementa en Redis el contador de peticiones totales (para reporte-sistema).
 */
const TOTAL_REQUESTS_KEY = 'total_requests';

async function requestCounter(req, res, next) {
  const { redisClient } = req.app.locals;
  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.incr(TOTAL_REQUESTS_KEY);
    } catch (e) {
      // ignore
    }
  }
  next();
}

module.exports = requestCounter;
