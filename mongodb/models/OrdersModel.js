const mongoose = require('mongoose');
const { v4: uuidV4 } = require('uuid');

const CustomerModel = require('./CustomerModel');
const ProductsModel = require('./ProductsModel');
const { ORDER_STATUS } = require('../constants/constants');

const { Schema } = mongoose;

const OrderedProduct = new Schema({
  productId: { type: String, required: true, ref: ProductsModel.collection.name },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true },
}, { _id: false });

const OrdersSchema = new Schema({
  _id: { type: String, default: uuidV4 },
  customerId: { type: String, required: true, ref: CustomerModel.collection.name },
  products: [OrderedProduct],
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: ORDER_STATUS.PENDING, enum: Object.values(ORDER_STATUS) },
}, { timestamps: true });

OrdersSchema.pre('save', function (next) {
  this.totalAmount = this.products.reduce((sum, product) => {
    return sum + (product.quantity * product.priceAtPurchase);
  }, 0);
  next();
});

OrdersSchema.index({ customerId: 1 });
OrdersSchema.index({ 'products.productId': 1 });
OrdersSchema.index({ orderDate: 1 });

module.exports = mongoose.model('orders', OrdersSchema, 'orders');