const redisClient = require('./redis-connection');
const { ONE_DAY_IN_SECONDS } = require('../constants/constants');

const setKey = async (key, value) => {
  return redisClient.set(key, value);
};

const getKey = async (key) => {
  return redisClient.get(key);
};

const setRedisKeyExpiry = async (key, expiryTimeInSeconds) => {
  return redisClient.expire(key, expiryTimeInSeconds);
};

const deleteKey = async (key) => {
  return redisClient.DEL(key);
}

const cacheToRedis = async (
  method,
  params,
  key,
  expiryTimeInSeconds = ONE_DAY_IN_SECONDS,
) => {
  let data = await getKey(key);
  if (data) return JSON.parse(data);
  data = await method(params);
  await setKey(key, JSON.stringify(data));
  await setRedisKeyExpiry(key, expiryTimeInSeconds);
  return data;
}


module.exports = {
  setKey,
  getKey,
  setRedisKeyExpiry,
  cacheToRedis,
  deleteKey,
};
