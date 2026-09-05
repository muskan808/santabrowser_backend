import { jest } from '@jest/globals';

const emitMock = jest.fn();

jest.unstable_mockModule('../src/socket.js', () => ({
  emitUploadNotification: emitMock
}));

const { emitUploadNotification } = await import('../src/socket.js');

test('emits an upload notification payload when a file is uploaded', async () => {
  const file = { _id: 'f1', originalName: 'photo.jpg' };
  const userId = 'u1';

  emitUploadNotification({ userId, file, message: `Uploaded ${file.originalName}` });

  expect(emitMock).toHaveBeenCalledWith({
    userId,
    file,
    message: 'Uploaded photo.jpg'
  });
});
