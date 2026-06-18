import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().optional(),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().min(1).default('1h'),
  UPLOADS_DIR: z.string().min(1).default('./uploads'),
  RATE_LIMIT_WINDOW_MS: z.string().default('60000'),
  RATE_LIMIT_MAX: z.string().default('10'),
});

const parsed = envSchema.parse(process.env);

export const env = {
  port: Number(parsed.PORT ?? '3000'),
  databaseUrl: parsed.DATABASE_URL,
  jwtSecret: parsed.JWT_SECRET,
  jwtExpiresIn: parsed.JWT_EXPIRES_IN,
  uploadsDir: parsed.UPLOADS_DIR,
  rateLimitWindowMs: Number(parsed.RATE_LIMIT_WINDOW_MS),
  rateLimitMax: Number(parsed.RATE_LIMIT_MAX),
};
