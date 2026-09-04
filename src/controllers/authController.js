import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { signAccessToken, setAuthCookie } from '../utils/auth.js';
import { ApiError } from '../utils/apiError.js';

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email });

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'Email is already registered');
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  const token = signAccessToken(user._id.toString());
  setAuthCookie(res, token);
  res.status(201).json({ success: true, token, user: publicUser(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new ApiError(401, 'Invalid email or password');
  const token = signAccessToken(user._id.toString());
  setAuthCookie(res, token);
  res.json({ success: true, token, user: publicUser(user) });
};


export const me = async (req, res) => res.json({ success: true, user: publicUser(req.user) });

export const logout = async (_req, res) => {
  res.clearCookie(env.cookieName, { httpOnly: true, secure: env.nodeEnv === 'production', sameSite: env.nodeEnv === 'production' ? 'none' : 'lax', path: '/' });
  res.json({ success: true, message: 'Logged out' });
};
