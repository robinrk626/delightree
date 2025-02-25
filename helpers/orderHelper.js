const mongoose = require('mongoose');
const {
  OrdersModel,
  ProductsModel,
} = require('../mongodb/models');

const createNewOrder = async ({
  products, customerId,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const productQuantityMap = products.reduce((acc, product) => {
      acc[product.productId] = product.quantity;
      return acc;
    }, {});
    const productIds = Object.keys(productQuantityMap);
    const productsData = await ProductsModel.find({ _id: { $in: productIds } }, { stock: 1 }).session(session).lean();
    if (productIds.length !== productsData.length) {
      throw { message: 'Invalid Products', }
    }
    const updateQueries = [];
    productsData.forEach((product) => {
      const orderQuantity = productQuantityMap[product._id];
      if (product.stock < orderQuantity) {
        throw { message: 'Insufficient Stock' };
      }
      updateQueries.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { stock: -orderQuantity } }
        }
      });
    });
    const order = new OrdersModel({
      products, customerId, totalAmount: 0,
    });
    await Promise.all([
      order.save({session}),
      ProductsModel.bulkWrite(updateQueries, { session }),
    ]);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

module.exports = {
  createNewOrder,
};
