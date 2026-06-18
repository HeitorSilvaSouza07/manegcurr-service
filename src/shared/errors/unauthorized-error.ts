import { AppError } from './app-error';

export class UnauthorizedError extends AppError {
  constructor(message = 'Não autorizado') {
    super('UNAUTHORIZED', message, 401);
  }
}
