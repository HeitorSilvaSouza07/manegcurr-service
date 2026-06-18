import type { Request, Response } from 'express';
import { getValidatedBody, getValidatedParams } from '../../middlewares/validate.middleware';
import type { CreateCvInput, CvPathParams } from '../../shared/schemas/cv.schemas';
import { cvsService } from './cvs.service';
import { sendSuccess } from '../../shared/utils/envelope';

export async function createCvController(req: Request, res: Response): Promise<Response> {
  const body = getValidatedBody<CreateCvInput>(req);
  const file = req.file;
  const userId = req.user?.sub ?? '';
  const cv = await cvsService.create(userId, body, file);
  return sendSuccess(res, cv, 201);
}

export async function listCvsController(req: Request, res: Response): Promise<Response> {
  const userId = req.user?.sub ?? '';
  const cvs = await cvsService.list(userId);
  return sendSuccess(res, cvs);
}

export async function getCvController(req: Request, res: Response): Promise<Response> {
  const { id } = getValidatedParams<CvPathParams>(req);
  const userId = req.user?.sub ?? '';
  const cv = await cvsService.getById(userId, id);
  return sendSuccess(res, cv);
}

export async function deleteCvController(req: Request, res: Response): Promise<Response> {
  const { id } = getValidatedParams<CvPathParams>(req);
  const userId = req.user?.sub ?? '';
  await cvsService.delete(userId, id);
  return sendSuccess(res, { deleted: true });
}
