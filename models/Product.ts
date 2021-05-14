import mongoose, { Document } from 'mongoose';

export interface Product extends Document {
  name: string;
  category_id: mongoose.Types.ObjectId;
  src: string;
  price: number;
  quantity: number;
  total_quantity: number;
  description: string;
  recommend: boolean;
}

const productSchema = new mongoose.Schema<Product>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 60,
    unique: true,
    index: true,
  },

  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  src: {
    type: String,
    default: 'placeholder.png',
  },

  price: {
    type: Number,
    min: 0,
    default: 0,
    index: true,
  },

  quantity: {
    type: Number,
    min: 0,
    default: 0,
  },

  total_quantity: {
    type: Number,
    min: 0,
    default: 0,
    index: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
    max: 2000,
  },

  recommend: {
    type: Boolean,
    default: false,
    index: true,
  },
});

export default mongoose.models?.Product ||
  mongoose.model<Product>('Product', productSchema);
