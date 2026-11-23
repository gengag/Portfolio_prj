import { Request, Response } from 'express';
import { z } from 'zod';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { registerUser, loginUser } from '../services/auth.service';
import { User } from '../models/user.model';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const payload = registerSchema.parse(req.body);
    const { token, user } = await registerUser(payload);
    return sendSuccess(res, 'User registered', { token, user });
  } catch (err: any) {
    const message = err instanceof z.ZodError ? err.errors[0].message : err.message;
    return sendError(res, message, 400);
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const payload = loginSchema.parse(req.body);
    const { token, user } = await loginUser(payload);
    return sendSuccess(res, 'Login successful', { token, user });
  } catch (err: any) {
    const message = err instanceof z.ZodError ? err.errors[0].message : err.message;
    return sendError(res, message, 401);
  }
};

// GET current user
export const me = async (req: Request, res: Response) => {
  const requestWithUser = req as any;
  const user = requestWithUser.user;
  if (!user) return sendError(res, 'User not found', 404);
  return sendSuccess(res, 'Current user', { user });
};

// PUT update user (onboarding)
export const updateMe = async (req: Request, res: Response) => {
  const requestWithUser = req as any;
  const user = requestWithUser.user;
  if (!user) return sendError(res, 'User not found', 404);
  const updates = req.body;
  try {
    const updated = await User.findByIdAndUpdate(
      user.id,
      { $set: updates },
      { new: true, fields: '-passwordHash' }
    );
    return sendSuccess(res, 'Profile updated', { user: updated });
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};
