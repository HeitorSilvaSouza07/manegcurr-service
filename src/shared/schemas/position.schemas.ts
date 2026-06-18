import { z } from 'zod';

export const positionStatusSchema = z.enum(['applied', 'in_review', 'interview', 'rejected', 'approved']);

export const createPositionSchema = z.object({
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().min(1).max(5000).nullable().optional(),
  requirements: z.string().trim().min(1).max(5000).nullable().optional(),
  cvId: z.string().uuid().nullable().optional(),
  status: positionStatusSchema.optional(),
});

export const updatePositionSchema = z.object({
  name: z.string().trim().min(2).max(160).optional(),
  description: z.string().trim().min(1).max(5000).nullable().optional(),
  requirements: z.string().trim().min(1).max(5000).nullable().optional(),
  cvId: z.string().uuid().nullable().optional(),
});

export const updatePositionStatusSchema = z.object({
  status: positionStatusSchema,
});

export const positionIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const positionsListQuerySchema = z.object({
  status: positionStatusSchema.optional(),
});

export type CreatePositionInput = z.infer<typeof createPositionSchema>;
export type UpdatePositionInput = z.infer<typeof updatePositionSchema>;
export type UpdatePositionStatusInput = z.infer<typeof updatePositionStatusSchema>;
export type PositionPathParams = z.infer<typeof positionIdParamsSchema>;
