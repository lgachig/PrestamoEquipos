/**
 * Middleware de caché y saturación para GET /api/loans/available.
 * Si la carga es alta (polling masivo), responde desde Redis para evitar saturar la DB.
 */
const THRESHOLD = 50;
const CACHE_KEY = 'equipos_disponibles';
const COUNT_KEY = 'available_request_count';
const TTL_COUNT = 60;
const TTL_CACHE = 30;

async function cacheEquiposDisponibles(req, res, next) {
  const { redisClient } = req.app.locals;
  if (!redisClient || (typeof redisClient.isOpen === 'boolean' && !redisClient.isOpen)) {
    return next();
  }
  try {
    const count = await redisClient.incr(COUNT_KEY);
    await redisClient.expire(COUNT_KEY, TTL_COUNT).catch(() => {});
    req._cacheCount = count;
    req._saturaciónActiva = count > THRESHOLD;
    req._redis = redisClient;
    next();
  } catch (err) {
    next();
  }
}

/**
 * Resuelve la respuesta: desde Redis si hay saturación y hay caché, o desde DB.
 * Debe usarse en la ruta de available después de este middleware.
 * @param {Object} req - req._redis, req._saturaciónActiva
 * @param {Object} res
 * @param {Function} fetchFromDb - async () => datos
 */
async function resolveEquiposDisponibles(req, res, fetchFromDb) {
  const redis = req._redis;
  const useCache = req._saturaciónActiva;
  if (useCache && redis && redis.isOpen) {
    try {
      const cached = await redis.get(CACHE_KEY);
      if (cached) {
        res.setHeader('X-Fuente-Datos', 'Caché Redis');
        return res.json(JSON.parse(cached));
      }
    } catch (e) {
      // fallthrough to DB
    }
  }
  const data = await fetchFromDb();
  if (redis && redis.isOpen) {
    try {
      await redis.set(CACHE_KEY, JSON.stringify(data), { EX: TTL_CACHE });
    } catch (e) {
      // ignore
    }
  }
  res.setHeader('X-Fuente-Datos', 'Base de Datos');
  res.json(data);
}

module.exports = { cacheEquiposDisponibles, resolveEquiposDisponibles };
