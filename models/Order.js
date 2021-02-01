import mongoose from 'mongoose';

const Order = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  total_price: {
    type: Number,
    min: 0,
    default: 0
  },

  status: {
    type: String,
    enum: ['processing', 'inDelivery', 'canceled', 'completed'],
    default: 'processing',
    index: true
  },

  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

  address: {
    type: String,
    required: true,
    trim: true
  },

  tel: {
    type: String,
    required: true,
    trim: true
  },

  orderedAt: {
    type: Date,
    default: Date.now
  },

  completedAt: {
    type: Date
  }
});

export default mongoose.models?.Order || mongoose.model('Order', Order);
