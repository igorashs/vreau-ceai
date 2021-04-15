import mongoose, { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isManager: boolean;
  orders: Array<mongoose.Schema.Types.ObjectId>;
}

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 60,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    maxLength: 60,
    unique: true,
    index: true,
  },

  password: {
    type: String,
    minLength: 8,
    maxLength: 128,
    required: true,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  isManager: {
    type: Boolean,
    default: false,
  },

  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
});

export default mongoose.models?.User ||
  mongoose.model<User>('User', userSchema);
