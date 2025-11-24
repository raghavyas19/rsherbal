const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  contact: {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  address: {
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String, default: 'India' },
  },
  utrNumber: { type: String },
  paymentScreenshot: { type: String }, // store image path or URL
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  courierName: { type: String },
  trackingId: { type: String },
  deliveryDate: { type: Date },
  cancelledDate: { type: Date },
}, { timestamps: { createdAt: true, updatedAt: true } });

module.exports = mongoose.model('Order', orderSchema); 