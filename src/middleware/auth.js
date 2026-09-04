import User from '../models/User.js';
import { env } from '../config/env.js';
import { verifyAccessToken } from '../utils/auth.js';
import { ApiError } from '../utils/apiError.js';

export const requireAuth = async (req, _res, next) => {
  try {
    const token = req.cookies?.[env.cookieName];
    if (!token) throw new ApiError(401, 'Authentication required');
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (!user) throw new ApiError(401, 'Invalid authentication');
    req.user = user;
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, 'Invalid or expired token'));
  }
};
