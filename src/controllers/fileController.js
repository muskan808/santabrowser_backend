import File from '../models/File.js';
import { uploadBuffer, destroyAsset } from '../services/cloudinaryService.js';
import { ApiError } from '../utils/apiError.js';
import { searchFiles } from '../services/searchService.js';

const allowed = new Map([
  ['image', ['image/jpeg', 'image/png', 'image/webp', 'image/gif']],
  ['video', ['video/mp4', 'video/webm', 'video/quicktime']],
  ['audio', ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4']],
  ['raw', ['application/pdf']]
]);

const detectResourceType = (mime) => [...allowed.entries()].find(([, types]) => types.includes(mime))?.[0];

export const uploadFile = async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file supplied');
  const resourceType = detectResourceType(req.file.mimetype);
  if (!resourceType) throw new ApiError(400, 'Unsupported file type');
  const tags = String(req.body.tags || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean).slice(0, 15);
  const result = await uploadBuffer(req.file.buffer, { resourceType, folder: `multimedia-search/${req.user._id}`, originalName: req.file.originalname });
  const file = await File.create({
    owner: req.user._id,
    originalName: req.file.originalname,
    publicId: result.public_id,
    url: result.secure_url,
    resourceType,
    mimeType: req.file.mimetype,
    size: req.file.size,
    tags
  });
  res.status(201).json({ success: true, file });
};

export const listFiles = async (req, res) => {
  const data = await searchFiles({ ownerId: req.user._id, query: '', page: Number(req.query.page || 1), limit: Number(req.query.limit || 12) });
  res.json({ success: true, ...data });
};

export const search = async (req, res) => {
  const data = await searchFiles({
    ownerId: req.user._id,
    query: req.query.query || '',
    type: req.query.type,
    tag: req.query.tag,
    from: req.query.from,
    to: req.query.to,
    page: Math.max(1, Number(req.query.page || 1)),
    limit: Math.min(50, Math.max(1, Number(req.query.limit || 12)))
  });
  res.json({ success: true, ...data });
};

export const getFile = async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, owner: req.user._id });
  if (!file) throw new ApiError(404, 'File not found');
  await File.updateOne({ _id: file._id }, { $inc: { viewCount: 1 } });
  file.viewCount += 1;
  res.json({ success: true, file });
};

export const deleteFile = async (req, res) => {
  const file = await File.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!file) throw new ApiError(404, 'File not found');
  await destroyAsset(file.publicId, file.resourceType).catch(() => null);
  res.json({ success: true, message: 'File deleted' });
};
