const redis = require('redis');
const { logger } = require('../logger/logger');
const config = require('../../config').getConfig();

const redisClient = redis.createClient({
  url: `redis://${config.redisConnection.hostname}:${config.redisConnection.port}`
});

redisClient.on('connect', () => {
  module.exports.client = redisClient;
});

redisClient.on('error', (err) => {
  logger.log(err);
});


(async () => {
  try {
    await redisClient.connect();
    logger.log('Redis client connected successfully');
  } catch (err) {
    logger.error('Failed to connect to Redis:', err);
  }
})();

module.exports = redisClient;

