import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { User, IUser } from '../models/user.model';
import { JwtPayload } from '../types';

const SALT_ROUNDS = 10;

/** Helper to parse JWT_EXPIRES_IN like "7d" into seconds */
const parseJwtExpiresIn = (value: string): number => {
  const num = parseInt(value.slice(0, -1), 10);
  const unit = value.slice(-1).toLowerCase();
  switch (unit) {
    case 'd':
      return num * 24 * 60 * 60;
    case 'h':
      return num * 60 * 60;
    case 'm':
      return num * 60;
    case 's':
      return num;
    default:
      return 24 * 60 * 60; // fallback 1 day
  }
};

/** Sign a JWT for a user */
const signJwt = (sub: string, email: string, role: 'user' | 'admin'): string => {
  const payload: JwtPayload = {
    sub,
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000 + parseJwtExpiresIn(ENV.JWT_EXPIRES_IN)),
  };
  return jwt.sign(payload, ENV.JWT_SECRET);
};

/** Register a new user */
export const registerUser = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name?: string;
}): Promise<{ token: string; user: IUser }> => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error('Email already in use');
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    email,
    passwordHash,
    name: name ?? '',
    role: 'user',
    isOnboarded: false,
  });
  const token = signJwt(user.id, user.email, user.role);
  return { token, user: user.toObject({ getters: true, versionKey: false }) };
};

/** Login an existing user */
export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ token: string; user: IUser }> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }
  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw new Error('Invalid email or password');
  }
  const token = signJwt(user.id, user.email, user.role);
  return { token, user: user.toObject({ getters: true, versionKey: false }) };
};

