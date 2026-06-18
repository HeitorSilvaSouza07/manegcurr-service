import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodError, type ZodTypeAny } from 'zod';

type ParsedRequest = Request & {
  validatedBody?: unknown;
  validatedParams?: unknown;
  validatedQuery?: unknown;
};

function handleValidationError(error: unknown, next: NextFunction): void {
  if (error instanceof ZodError) {
    next(error);
    return;
  }
  next(error);
}

export function validateBody(schema: ZodTypeAny): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      (req as ParsedRequest).validatedBody = schema.parse(req.body);
      next();
    } catch (error) {
      handleValidationError(error, next);
    }
  };
}

export function validateParams(schema: ZodTypeAny): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      (req as ParsedRequest).validatedParams = schema.parse(req.params);
      next();
    } catch (error) {
      handleValidationError(error, next);
    }
  };
}

export function validateQuery(schema: ZodTypeAny): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      (req as ParsedRequest).validatedQuery = schema.parse(req.query);
      next();
    } catch (error) {
      handleValidationError(error, next);
    }
  };
}

export function getValidatedBody<T>(req: Request): T {
  return (req as ParsedRequest).validatedBody as T;
}

export function getValidatedParams<T>(req: Request): T {
  return (req as ParsedRequest).validatedParams as T;
}

export function getValidatedQuery<T>(req: Request): T {
  return (req as ParsedRequest).validatedQuery as T;
}
