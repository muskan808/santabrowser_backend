import { Router } from 'express';
import multer from 'multer';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadFile, listFiles, search, getFile, deleteFile } from '../controllers/fileController.js';
import { env } from '../config/env.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: env.maxFileSizeMb * 1024 * 1024 } });
router.use(requireAuth);
router.post('/upload', upload.single('file'), asyncHandler(uploadFile));
router.get('/', asyncHandler(listFiles));
router.get('/search', asyncHandler(search));
router.get('/:id', asyncHandler(getFile));
router.delete('/:id', asyncHandler(deleteFile));
export default router;
