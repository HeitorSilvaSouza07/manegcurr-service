import type { Request, Response } from 'express';
import { signToken } from '../../shared/utils/token';
import { getValidatedBody } from '../../middlewares/validate.middleware';
import type { LoginInput, RegisterInput } from '../../shared/schemas/auth.schemas';
import { usersService } from './users.service';
import { sendSuccess } from '../../shared/utils/envelope';

export async function registerController(req: Request, res: Response): Promise<Response> {
  const body = getValidatedBody<RegisterInput>(req);
  const user = await usersService.register(body.name, body.email, body.password);
  return sendSuccess(res, user, 201);
}

export async function loginController(req: Request, res: Response): Promise<Response> {
  const body = getValidatedBody<LoginInput>(req);
  const { user, tokenPayload } = await usersService.login(body.email, body.password);
  return sendSuccess(res, { user, token: signToken(tokenPayload) });
}

export async function meController(req: Request, res: Response): Promise<Response> {
  const userId = req.user?.sub ?? '';
  const user = await usersService.getMe(userId);
  return sendSuccess(res, user);
}
