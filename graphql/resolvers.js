const { mergeResolvers } = require('@graphql-tools/merge');

const customerResolver = require('./modules/customer/customerResolver');
const orderResolver = require('./modules/orders/ordersResolver');
const productResolver = require('./modules/products/productsResolver');

module.exports = mergeResolvers([customerResolver, orderResolver, productResolver]);