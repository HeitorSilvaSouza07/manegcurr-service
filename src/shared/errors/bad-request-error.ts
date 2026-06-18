import { AppError } from './app-error';

export class BadRequestError extends AppError {
  constructor(message: string, code = 'BAD_REQUEST') {
    super(code, message, 400);
  }
}
