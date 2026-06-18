import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';
import type { JwtUser } from '../types';

export function signToken(payload: JwtUser): string {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, env.jwtSecret as Secret, options);
}

export function verifyToken(token: string): JwtUser {
  return jwt.verify(token, env.jwtSecret as Secret) as JwtUser;
}
