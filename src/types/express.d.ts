import type { JwtUser } from '../shared/types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtUser;
    validatedBody?: unknown;
    validatedParams?: unknown;
    validatedQuery?: unknown;
    file?: Express.Multer.File;
  }
}

export {};
