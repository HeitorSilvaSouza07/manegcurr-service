import express from 'express';
import { errorMiddleware } from './middlewares/error.middleware';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { usersRouter } from './modules/users/users.routes';
import { cvsRouter } from './modules/cvs/cvs.routes';
import { positionsRouter } from './modules/positions/positions.routes';

export function createApp() {
  const app = express();

  app.use(requestLoggerMiddleware);
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: false }));

  app.get('/', (_req, res) => {
    res.json({ success: true, data: { message: 'Servidor Express com TypeScript está funcionando' } });
  });

  app.use(usersRouter);
  app.use(cvsRouter);
  app.use(positionsRouter);

  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Rota não encontrada' },
    });
  });

  app.use(errorMiddleware);
  return app;
}

export const app = createApp();
