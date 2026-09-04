import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signAccessToken = (userId) => jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
export const verifyAccessToken = (token) => jwt.verify(token, env.jwtSecret);

export const setAuthCookie = (res, token) => {
  const isProduction = env.nodeEnv === 'production' || Boolean(process.env.RAILWAY_ENVIRONMENT);
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
    path: '/'
  });
};

