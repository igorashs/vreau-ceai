import mongoose from 'mongoose';

const Session = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },

  refresh_token: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '1d' }
  }
});

export default mongoose.models.Session || mongoose.model('Session', Session);
