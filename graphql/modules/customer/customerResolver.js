const { getCustomerSpendingByCustomerId, getCustomerOrdersHelper } = require("../../../helpers/customerHelper");
const { cacheToRedis } = require("../../../utils/redis/redis-utils");
const { REDIS_KEYS } = require("../../../utils/redis/redisKkeys");

const customerResolver = {
  Query: {
    getCustomerSpending: async (_, { customerId }) => {
      return cacheToRedis(
        getCustomerSpendingByCustomerId,
        { customerId },
        REDIS_KEYS.CUSTOMER_SPENDING_STATS({ customerId }),
      );
    },

    getCustomerOrders: async (_, { customerId, limit, pageNumber = 1 }) => {
      return getCustomerOrdersHelper({
        customerId,
        limit,
        skip: (pageNumber - 1) * limit,
      });
    },
  }
};

module.exports = customerResolver;