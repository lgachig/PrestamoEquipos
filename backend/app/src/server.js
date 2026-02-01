const app = require('./app');
const connectMongo = require('./config/mongo');

const PORT = process.env.PORT || 3000;

(async () => {
  await connectMongo();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
})();