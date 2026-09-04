import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/models/File.js', () => ({
  default: {
    find: jest.fn(() => ({
      sort: jest.fn(() => ({
        skip: jest.fn(() => ({
          limit: jest.fn(() => ({
            lean: jest.fn(async () => [
              { originalName: 'video.mp4', tags: ['video', 'demo'], mimeType: 'video/mp4', viewCount: 10, createdAt: new Date() },
              { originalName: 'photo.jpg', tags: ['photo'], mimeType: 'image/jpeg', viewCount: 1, createdAt: new Date() }
            ])
          }))
        }))
      }))
    })),
    countDocuments: jest.fn(async () => 2)
  }
}));

const { searchFiles } = await import('../src/services/searchService.js');

test('ranks keyword matches ahead of unrelated files', async () => {
  const result = await searchFiles({ ownerId: 'u1', query: 'video' });
  expect(result.items[0].originalName).toBe('video.mp4');
  expect(result.pagination.total).toBe(2);
});
