/**
 * Conexión a MongoDB. Usa variable de entorno MONGO_URI (.env).
 */
const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectMongo;