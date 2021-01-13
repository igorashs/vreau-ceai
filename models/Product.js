import mongoose from 'mongoose';

const Product = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  src: {
    type: String,
    default: 'placeholder.png'
  },

  price: {
    type: Number,
    min: 0,
    default: 0
  },

  quantity: {
    type: Number,
    min: 0,
    default: 0
  },

  total_quantity: {
    type: Number,
    min: 0,
    default: 0
  },

  advertise: {
    type: Boolean,
    default: false
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

export default mongoose.models.Product || mongoose.model('Product', Product);
