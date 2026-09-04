import multer from 'multer';
import { ApiError } from '../utils/apiError.js';

export const notFound = (_req, _res, next) => next(new ApiError(404, 'Route not found'));

export const errorHandler = (err, _req, res, _next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details;
  if (err instanceof multer.MulterError) {
    status = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'File exceeds the configured size limit' : err.message;
  }
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => e.message);
  }
  if (err.code === 11000) {
    status = 409;
    message = 'A record with that value already exists';
  }
  res.status(status).json({ success: false, message, ...(details ? { details } : {}) });
};
