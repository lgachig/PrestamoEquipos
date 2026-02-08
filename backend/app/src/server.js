require('dotenv').config();
const app = require('./app');
const connectMongo = require('./config/mongo');
const { redisClient, connectRedis } = require('./config/redis');

const PORT = process.env.PORT || 3000;

(async () => {
  await connectMongo();
  await connectRedis();
  app.locals.redisClient = redisClient;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
  });
})();