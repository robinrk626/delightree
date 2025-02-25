const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidV4 } = require('uuid');
const { GENDER } = require('../constants/constants');

const CustomerSchema = new Schema({
  _id: { type: String, default: uuidV4 },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  location: { type: String, default: '' },
  gender: { type: String, required: true, enum: Object.values(GENDER) },
}, { timestamps: true });

module.exports = mongoose.model('customers', CustomerSchema, 'customers');