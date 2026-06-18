import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { rateLimitMiddleware } from '../../middlewares/rate-limit.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../../shared/schemas/auth.schemas';
import { loginController, meController, registerController } from './users.controller';

export const usersRouter = Router();

usersRouter.post('/auth/register', rateLimitMiddleware, validateBody(registerSchema), registerController);
usersRouter.post('/auth/login', rateLimitMiddleware, validateBody(loginSchema), loginController);
usersRouter.get('/users/me', authMiddleware, meController);
