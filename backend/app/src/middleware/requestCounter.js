const os = require('os');
const TOTAL_REQUESTS_KEY = 'total_requests';
const INSTANCE_PREFIX = 'requests_node:';
const CONCURRENT_COUNT_KEY = 'available_request_count'; // Usado para medir saturación

async function requestCounter(req, res, next) {
  const { redisClient } = req.app.locals;
  if (redisClient && redisClient.isOpen) {
    try {
      const hostname = os.hostname();
      // Incrementamos el total global, el contador de saturación y el específico del nodo
      await Promise.all([
        redisClient.incr(TOTAL_REQUESTS_KEY),
        redisClient.incr(CONCURRENT_COUNT_KEY),
        redisClient.incr(`${INSTANCE_PREFIX}${hostname}`)
      ]);
      
      // El contador de saturación expira rápido para reflejar carga "en tiempo real"
      await redisClient.expire(CONCURRENT_COUNT_KEY, 10); 
    } catch (e) {
      // ignore
    }
  }
  next();
}

module.exports = requestCounter;