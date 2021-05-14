import mongoose, { Document } from 'mongoose';

export interface Session extends Document {
  user_id: mongoose.Types.ObjectId;
  refresh_token: string;
  createdAt: Date;
}

const sessionSchema = new mongoose.Schema<Session>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },

  refresh_token: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '1d' },
  },
});

export default mongoose.models?.Session ||
  mongoose.model<Session>('Session', sessionSchema);
