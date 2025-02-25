const { getTopProductsBySale } = require("../../../helpers/salesHelper");

const productResolver = {
  Query: {
    getTopSellingProducts: async (__dirname, { limit, pageNumber = 1 }) => {
      return getTopProductsBySale({ limit, skip: (pageNumber - 1) * limit });
    }
  }
};

module.exports = productResolver;