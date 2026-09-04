import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  originalName: { type: String, required: true, trim: true, maxlength: 255 },
  publicId: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  resourceType: { type: String, enum: ['image', 'video', 'raw', 'audio'], required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true, min: 0 },
  tags: [{ type: String, trim: true, lowercase: true, maxlength: 40 }],
  viewCount: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

fileSchema.index({ originalName: 'text', tags: 'text' });
fileSchema.index({ owner: 1, createdAt: -1 });

export default mongoose.model('File', fileSchema);
