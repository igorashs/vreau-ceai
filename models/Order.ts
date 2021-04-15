import mongoose, { Document } from 'mongoose';

export interface Order extends Document {
  user: mongoose.Schema.Types.ObjectId;
  number: string;
  total_price: number;
  status: 'processing' | 'inDelivery' | 'canceled' | 'completed';
  items: Array<{
    count: number;
    product: { name: string; price: number; quantity: number };
  }>;
  address: string;
  tel: string;
  orderedAt: Date;
  completedAt: Date;
}

const orderSchema = new mongoose.Schema<Order>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  number: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  total_price: {
    type: Number,
    min: 0,
    default: 0,
  },

  status: {
    type: String,
    enum: ['processing', 'inDelivery', 'canceled', 'completed'],
    default: 'processing',
    index: true,
  },

  items: [
    {
      count: {
        type: Number,
        min: 1,
        required: true,
      },

      product: {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    },
  ],

  address: {
    type: String,
    required: true,
    trim: true,
  },

  tel: {
    type: String,
    required: true,
    trim: true,
  },

  orderedAt: {
    type: Date,
    default: Date.now,
  },

  completedAt: {
    type: Date,
  },
});

export default mongoose.models?.Order ||
  mongoose.model<Order>('Order', orderSchema);
