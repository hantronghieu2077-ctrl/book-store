const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String },
  items: [],
  total: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: 'Chờ xác nhận' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
