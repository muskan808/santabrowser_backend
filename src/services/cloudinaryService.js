import { Readable } from 'node:stream';
import cloudinary from '../config/cloudinary.js';

export const uploadBuffer = (buffer, { resourceType, folder, originalName }) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream({
    resource_type: resourceType,
    folder,
    use_filename: true,
    unique_filename: true,
    filename_override: originalName,
    access_mode: 'public'
  }, (error, result) => error ? reject(error) : resolve(result));
  Readable.from(buffer).pipe(stream);
});

export const destroyAsset = (publicId, resourceType) => cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
