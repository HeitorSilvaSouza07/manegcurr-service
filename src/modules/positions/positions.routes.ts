import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateBody, validateParams, validateQuery } from '../../middlewares/validate.middleware';
import {
  createPositionSchema,
  positionIdParamsSchema,
  positionsListQuerySchema,
  updatePositionSchema,
  updatePositionStatusSchema,
} from '../../shared/schemas/position.schemas';
import {
  createPositionController,
  deletePositionController,
  getPositionController,
  listPositionsController,
  updatePositionController,
  updatePositionStatusController,
} from './positions.controller';

export const positionsRouter = Router();

positionsRouter.post('/positions', authMiddleware, validateBody(createPositionSchema), createPositionController);
positionsRouter.get('/positions', authMiddleware, validateQuery(positionsListQuerySchema), listPositionsController);
positionsRouter.get('/positions/:id', authMiddleware, validateParams(positionIdParamsSchema), getPositionController);
positionsRouter.patch(
  '/positions/:id/status',
  authMiddleware,
  validateParams(positionIdParamsSchema),
  validateBody(updatePositionStatusSchema),
  updatePositionStatusController,
);
positionsRouter.put(
  '/positions/:id',
  authMiddleware,
  validateParams(positionIdParamsSchema),
  validateBody(updatePositionSchema),
  updatePositionController,
);
positionsRouter.delete('/positions/:id', authMiddleware, validateParams(positionIdParamsSchema), deletePositionController);
