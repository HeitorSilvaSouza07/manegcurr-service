import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { upload } from '../../config/multer';
import { validateParams, validateBody } from '../../middlewares/validate.middleware';
import { createCvSchema, cvIdParamsSchema } from '../../shared/schemas/cv.schemas';
import { createCvController, deleteCvController, getCvController, listCvsController } from './cvs.controller';

export const cvsRouter = Router();

cvsRouter.post('/cvs', authMiddleware, upload.single('document'), validateBody(createCvSchema), createCvController);
cvsRouter.get('/cvs', authMiddleware, listCvsController);
cvsRouter.get('/cvs/:id', authMiddleware, validateParams(cvIdParamsSchema), getCvController);
cvsRouter.delete('/cvs/:id', authMiddleware, validateParams(cvIdParamsSchema), deleteCvController);
