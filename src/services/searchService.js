import File from '../models/File.js';

export const searchFiles = async ({ ownerId, query = '', type, tag, from, to, page = 1, limit = 12 }) => {
  const filter = { owner: ownerId };
  if (type) filter.resourceType = type;
  if (tag) filter.tags = tag.toLowerCase();
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const normalized = query.trim().toLowerCase();
  if (normalized) {
    filter.$or = [
      { originalName: { $regex: normalized, $options: 'i' } },
      { tags: { $regex: normalized, $options: 'i' } },
      { mimeType: { $regex: normalized, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    File.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    File.countDocuments(filter)
  ]);

  const scored = items.map((file) => {
    const name = file.originalName.toLowerCase();
    const tags = file.tags.join(' ').toLowerCase();
    let relevance = 0;
    if (normalized) {
      if (name === normalized) relevance += 100;
      if (name.includes(normalized)) relevance += 50;
      if (tags.split(/\s+/).includes(normalized)) relevance += 70;
      if (tags.includes(normalized)) relevance += 30;
      if (file.mimeType.toLowerCase().includes(normalized)) relevance += 20;
    }
    const ageDays = Math.max(0, (Date.now() - new Date(file.createdAt).getTime()) / 86400000);
    const freshness = Math.max(0, 20 - ageDays / 30);
    const popularity = Math.min(30, Math.log10(file.viewCount + 1) * 10);
    return { ...file, relevanceScore: Number((relevance + freshness + popularity).toFixed(2)) };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.createdAt) - new Date(a.createdAt));

  return { items: scored, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};
