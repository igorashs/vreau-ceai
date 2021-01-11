import mongoose from 'mongoose';

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    trim: true
  },

  passwords: {
    type: String,
    minLength: 8,
    required: true
  },

  isAdmin: {
    type: Boolean,
    default: false
  },

  isManager: {
    type: Boolean,
    default: false
  },

  orders: [mongoose.Schema.Types.ObjectId]
});

export default mongoose.models.User || mongoose.model('User', User);
