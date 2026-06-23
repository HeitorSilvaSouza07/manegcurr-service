import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../shared/errors/unauthorized-error';
import type { JwtUser } from '../shared/types';
import { verifyToken } from '../shared/utils/token';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next(new UnauthorizedError('Token ausente'));
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    next(new UnauthorizedError('Token ausente'));
    return;
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    next(new UnauthorizedError('Token inválido ou expirado'));
  }
}
