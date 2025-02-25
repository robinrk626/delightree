const REDIS_KEYS = {
  CUSTOMER_SPENDING_STATS: ({ customerId = '' }) => `CUSTOMER_SPENDING_STATS${customerId}`,
};

module.exports = {
  REDIS_KEYS,
};
