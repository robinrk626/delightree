const { mergeTypeDefs } = require('@graphql-tools/merge');

const customerTypeDefs = require('./modules/customer/customerTypeDef');
const orderTypeDefs = require('./modules/orders/ordersTypeDef');
const productsTypeDefs = require('./modules/products/productsTypeDef');

module.exports = mergeTypeDefs([
  customerTypeDefs,
  orderTypeDefs,
  productsTypeDefs,
]);