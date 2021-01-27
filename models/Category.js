import mongoose from 'mongoose';

const Category = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 60,
    unique: true,
    index: true
  },

  products: { type: [mongoose.Schema.Types.ObjectId], ref: 'Product' }
});

export default mongoose.models.Category || mongoose.model('Category', Category);
