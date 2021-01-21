import mongoose from 'mongoose';

const Token = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  refresh_token: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: { unique: true, expires: '1d' }
  }
});

export default mongoose.models.Token || mongoose.model('Token', Token);
