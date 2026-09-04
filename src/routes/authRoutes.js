import { Router } from 'express';
import { body } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { register, login, me, logout } from '../controllers/authController.js';

const router = Router();
const credentials = [body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 8, max: 72 })];
router.post('/register', body('name').trim().isLength({ min: 2, max: 80 }), ...credentials, validate, asyncHandler(register));
router.post('/login', ...credentials, validate, asyncHandler(login));
router.get('/me', requireAuth, asyncHandler(me));
router.post('/logout', asyncHandler(logout));
export default router;
