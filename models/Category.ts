import mongoose, { Document } from 'mongoose';

export interface Category extends Document {
  name: string;
  products: Array<mongoose.Schema.Types.ObjectId>;
}

const categorySchema = new mongoose.Schema<Category>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 60,
    unique: true,
    index: true,
  },

  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

export default mongoose.models?.Category ||
  mongoose.model<Category>('Category', categorySchema);
