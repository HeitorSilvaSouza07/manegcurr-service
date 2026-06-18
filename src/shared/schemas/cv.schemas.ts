import { z } from 'zod';

export const createCvSchema = z.object({
  name: z.string().trim().min(2).max(160),
});

export const cvIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CreateCvInput = z.infer<typeof createCvSchema>;
export type CvPathParams = z.infer<typeof cvIdParamsSchema>;
