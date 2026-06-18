import type { JwtUser } from '../shared/types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
      validatedBody?: unknown;
      validatedParams?: unknown;
      file?: Express.Multer.File;
    }
  }
}

export {};
