const { ORDER_STATUS } = require("../mongodb/constants/constants");
const { OrdersModel, ProductsModel } = require("../mongodb/models");

const getSalesAnalyticsInDuration = async ({
  startDate, endDate,
}) => {
  const aggregateQuery = [
    {
      $match: {
        orderDate: { $gte: startDate, $lte: endDate },
        status: { $eq: ORDER_STATUS.COMPLETED },
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        completedOrders: { $sum: 1 },
        products: { $push: '$products' }
      },
    },
    {
      $unwind: { path: '$products' }
    },
    {
      $unwind: { path: '$products' }
    },
    {
      $group: {
        _id: '$products.productId',
        totalRevenue: { $first: '$totalRevenue' },
        completedOrders: { $first: '$completedOrders' },
        revenue: {
          $sum: {
            $multiply: ['$products.priceAtPurchase', '$products.quantity']
          },
        },
      },
    },
    {
      $lookup: {
        from: 'products',
        foreignField: '_id',
        localField: '_id',
        as: 'product'
      },
    },
    {
      $unwind: {
        path: '$product'
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $first: '$totalRevenue' },
        completedOrders: { $first: '$completedOrders' },
        categoryBreakdown: {
          $push: {
            category: '$product.name',
            revenue: '$revenue'
          },
        },
      },
    },
  ];
  const salesAnalytics = await OrdersModel.aggregate(aggregateQuery);
  if (!salesAnalytics.length) {
    throw {
      message: "Don't have any records in specific time",
    };
  }
  return salesAnalytics[0];
};

const getTopProductsBySale = async ({ limit, skip }) => {
  const aggregateQuery = [
    {
      $match: {
        status: { $eq: ORDER_STATUS.COMPLETED },
      }
    },
    {
      $unwind: '$products',
    },
    {
      $group: {
        _id: '$products.productId',
        productId: { $first: '$products.productId' },
        totalSold: { $sum: '$products.quantity', },
      },
    },
    {
      $sort: { 'totalSold': -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: ProductsModel.collection.name,
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails', 
      },
    },
    {
      $unwind: '$productDetails',
    },
    {
      $project: {
        _id: 0,
        name: '$productDetails.name',
        productId: 1,
        totalSold: 1,
      },
    }
  ];
  const topProducts = await OrdersModel.aggregate(aggregateQuery);
  return topProducts;
};

module.exports = {
  getSalesAnalyticsInDuration,
  getTopProductsBySale,
}