import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true, unique: true },
  shortCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  visitCount: { type: Number, default: 0 },
  lastVisitedAt: { type: Date, default: null }
});

urlSchema.index({ longUrl: 'text' });
urlSchema.index({ shortCode: 'text' });

export default mongoose.model('Url', urlSchema);
