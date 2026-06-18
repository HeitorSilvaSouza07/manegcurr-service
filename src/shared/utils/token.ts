import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import type { JwtUser } from '../types';

export function signToken(payload: JwtUser): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyToken(token: string): JwtUser {
  return jwt.verify(token, env.jwtSecret) as JwtUser;
}
