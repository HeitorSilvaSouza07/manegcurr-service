import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { sendError } from '../shared/utils/envelope';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + env.rateLimitWindowMs });
    next();
    return;
  }

  if (current.count >= env.rateLimitMax) {
    sendError(res, 'RATE_LIMITED', 'Muitas tentativas, aguarde um pouco', 429);
    return;
  }

  current.count += 1;
  next();
}
