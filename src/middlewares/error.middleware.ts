import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import multer from 'multer';
import { AppError } from '../shared/errors/app-error';
import { logError } from '../shared/utils/logger';

export const errorMiddleware: ErrorRequestHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = err instanceof Error ? err.message : 'Erro inesperado';

  if (err instanceof ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = err.issues.map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`).join('; ');
  } else if (err instanceof multer.MulterError) {
    statusCode = 400;
    code = err.code === 'LIMIT_FILE_SIZE' ? 'FILE_TOO_LARGE' : 'UPLOAD_ERROR';
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
  } else if (err instanceof Error && err.message.includes('Somente arquivos')) {
    statusCode = 400;
    code = 'INVALID_FILE_TYPE';
  }

  logError('request_error', {
    method: req.method,
    path: req.path,
    code,
    message,
  });

  res.status(statusCode).json({
    success: false,
    error: { code, message },
  });
};
