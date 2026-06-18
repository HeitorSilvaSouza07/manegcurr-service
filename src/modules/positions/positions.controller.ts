import type { Request, Response } from 'express';
import { getValidatedBody, getValidatedParams, getValidatedQuery } from '../../middlewares/validate.middleware';
import { sendSuccess } from '../../shared/utils/envelope';
import type {
  CreatePositionInput,
  PositionPathParams,
  UpdatePositionInput,
  UpdatePositionStatusInput,
  PositionsListQuery,
} from '../../shared/schemas/position.schemas';
import { positionsService } from './positions.service';

export async function createPositionController(req: Request, res: Response): Promise<Response> {
  const body = getValidatedBody<CreatePositionInput>(req);
  const userId = req.user?.sub ?? '';
  const position = await positionsService.create(userId, body);
  return sendSuccess(res, position, 201);
}

export async function listPositionsController(req: Request, res: Response): Promise<Response> {
  const query = getValidatedQuery<PositionsListQuery>(req);
  const userId = req.user?.sub ?? '';
  const positions = await positionsService.list(userId, query.status);
  return sendSuccess(res, positions);
}

export async function getPositionController(req: Request, res: Response): Promise<Response> {
  const { id } = getValidatedParams<PositionPathParams>(req);
  const userId = req.user?.sub ?? '';
  const position = await positionsService.getById(userId, id);
  return sendSuccess(res, position);
}

export async function updatePositionStatusController(req: Request, res: Response): Promise<Response> {
  const { id } = getValidatedParams<PositionPathParams>(req);
  const body = getValidatedBody<UpdatePositionStatusInput>(req);
  const userId = req.user?.sub ?? '';
  const position = await positionsService.updateStatus(userId, id, body.status);
  return sendSuccess(res, position);
}

export async function updatePositionController(req: Request, res: Response): Promise<Response> {
  const { id } = getValidatedParams<PositionPathParams>(req);
  const body = getValidatedBody<UpdatePositionInput>(req);
  const userId = req.user?.sub ?? '';
  const position = await positionsService.update(userId, id, body);
  return sendSuccess(res, position);
}

export async function deletePositionController(req: Request, res: Response): Promise<Response> {
  const { id } = getValidatedParams<PositionPathParams>(req);
  const userId = req.user?.sub ?? '';
  await positionsService.delete(userId, id);
  return sendSuccess(res, { deleted: true });
}
