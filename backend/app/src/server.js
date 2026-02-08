require('dotenv').config();
const os = require('os'); // Para identificar la instancia en logs
const app = require('./app');
const connectMongo = require('./config/mongo');
const { redisClient, connectRedis } = require('./config/redis');
const LoanService = require('./services/LoanService');

const PORT = process.env.PORT || 3000;
const instanceId = os.hostname(); // ID del contenedor (ej: backend-1)
const loanService = new LoanService();

// --- WORKER: PROCESAR COLA DE SATURACIÓN CON EVIDENCIA ---
async function processQueue() {
  if (!redisClient.isOpen) return;
  
  const COUNT_KEY = 'available_request_count';
  const QUEUE_KEY = 'cola_prestamos_pendientes';

  try {
    const count = await redisClient.get(COUNT_KEY);
    // Solo procesar si la carga es baja (evidencia de que la saturación terminó)
    if (parseInt(count || '0', 10) < 20) {
      // rPop es atómico: en un clúster, solo una instancia agarrará el préstamo
      const data = await redisClient.rPop(QUEUE_KEY);
      if (data) {
        const { email, equipmentId, quantity } = JSON.parse(data);
        // LOG DE EVIDENCIA: Indica qué instancia del clúster está persistiendo el dato
        console.log(`[INSTANCIA: ${instanceId}] 🔄 Procesando préstamo diferido para: ${email}`);
        await loanService.loanEquipment(email, equipmentId, quantity);
      }
    }
  } catch (err) {
    console.error(`[INSTANCIA: ${instanceId}] ❌ Error en Worker:`, err.message);
  }
}

(async () => {
  await connectMongo();
  await connectRedis();
  app.locals.redisClient = redisClient;
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Backend [${instanceId}] running on port ${PORT}`);
    // Revisar la cola cada 3 segundos para una respuesta más rápida post-saturación
    setInterval(processQueue, 3000);
  });
})();