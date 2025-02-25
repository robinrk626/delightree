const mongoose = require('mongoose');
const { v4: uuidV4} = require('uuid');

const { PRODUCT_CATEGORIES } = require('../constants/constants');
const { Schema } = mongoose;

const ProductsSchema = new Schema({
  _id: { type: String, default: uuidV4 },
  name: { type: String, required: true },
  category: { type: String, required: true, enum: Object.values(PRODUCT_CATEGORIES) },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('products', ProductsSchema, 'products');