/**
 * Configuración del cliente Redis.
 * Usado para caché de equipos disponibles y contador de peticiones (reporte-sistema).
 */
const redis = require('redis');

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10)
  }
});

redisClient.on('error', () => {});
redisClient.on('connect', () => console.log('✅ Redis conectado'));

/** Conecta al servidor Redis (llamar al arranque del servidor). */
const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.warn('Redis no disponible, caché deshabilitada:', err.message);
  }
};

module.exports = { redisClient, connectRedis };
