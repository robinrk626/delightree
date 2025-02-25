const { getSalesAnalyticsInDuration } = require("../../../helpers/salesHelper");
const { createNewOrder } = require('../../../helpers/orderHelper');

const orderResolver = {
  Query: {
    getSalesAnalytics: async (_, { startDate, endDate }) => {
      return getSalesAnalyticsInDuration({ startDate, endDate });
    },
  },

  Mutation: {
    createOrder: async (_, { products }, { userId }) => {
      if (!userId) {
        // authentication
        throw {
          message: 'Invalid or missing token',
        }
      }
      await createNewOrder({
        products,
        customerId: userId,
      });
      return true;
    },
  }
};

module.exports = orderResolver;