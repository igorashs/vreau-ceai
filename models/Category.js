import mongoose from 'mongoose';

const Category = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 60,
    trim: true
  }
});

export default mongoose.models.Category || mongoose.model('Category', Category);
