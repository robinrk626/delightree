const { ORDER_STATUS } = require("../mongodb/constants/constants");
const { OrdersModel, ProductsModel } = require("../mongodb/models");
const { logger } = require("../utils/logger/logger");
const { deleteKey } = require("../utils/redis/redis-utils");
const { REDIS_KEYS } = require("../utils/redis/redisKkeys");

const getCustomerSpendingByCustomerId = async ({ customerId }) => {
  try {
    const matchClause = {
      $match: {
        customerId,
        status: ORDER_STATUS.COMPLETED,
      },
    };
    const groupClause = {
      $group: {
        _id: null,
        customerId: { $first: '$customerId' },
        totalSpent: { $sum: '$totalAmount' },
        averageOrderValue: { $avg: '$totalAmount' },
        lastOrderDate: { $max: '$orderDate' },
      },
    };
    const aggregateQuery = [matchClause, groupClause];
    const customerSpending = await OrdersModel.aggregate(aggregateQuery);
    if (!customerSpending.length) {
      // if Customer has not ordered anything till now,
      throw {
        message: 'Customer Does not have ordered anything'
      }
    }
    return customerSpending[0];
  } catch (error) {
    logger.log(error);
    throw {
      message: error.message || 'Internal Server Error'
    };
  }
};

// call this function when any order status is updating 
const deleteCacheOfSpendingAnalyticsByCustomerId = async ({ customerId }) => {
  await deleteKey(REDIS_KEYS.CUSTOMER_SPENDING_STATS({ customerId }));
}

const getCustomerOrdersHelper = async ({
  customerId, limit, skip,
}) => {
  const aggregateQuery = [
    {
      $match: { customerId },
    },
    {
      $sort: { 'orderDate': -1 }
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $unwind: {
        path: '$productDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: ProductsModel.collection.name,
        foreignField: '_id',
        localField: 'products.productId',
        as: 'productDetails'
      }
    },
    {
      $group: {
        _id: '$_id',
        totalAmount: { $first: '$totalAmount' },
        orderDate: { $first: '$orderDate' },
        status: { $first: '$status' },
        products: {
          $push: {
            name: { $arrayElemAt: ['$productDetails.name', 0] },
            quantity: { $first: '$products.quantity' },
            priceAtPurchase: { $first: '$products.priceAtPurchase' },
          },
        },
      }
    }
  ];
  const orders = await OrdersModel.aggregate(aggregateQuery);
  return { orders };
};


module.exports = {
  getCustomerSpendingByCustomerId,
  deleteCacheOfSpendingAnalyticsByCustomerId,
  getCustomerOrdersHelper,
};