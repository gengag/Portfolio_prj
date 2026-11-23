import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { JwtPayload } from '../types';
import { sendError } from '../utils/apiResponse';
import { User } from '../models/user.model';

export interface AuthRequest extends Request {
  user?: typeof User.prototype;
}

/**
 * Middleware to verify JWT token.
 * Attaches the authenticated user document (without passwordHash) to req.user.
 */
export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return sendError(res, 'Missing Authorization header', 401);
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
    // fetch user, omit passwordHash for safety
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user) {
      return sendError(res, 'User not found', 401);
    }
    req.user = user;
    next();
  } catch (err: any) {
    return sendError(res, err.message ?? 'Invalid token', 401);
  }
};

