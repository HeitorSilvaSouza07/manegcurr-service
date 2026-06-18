import { app } from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';
import { logInfo } from './shared/utils/logger';

export async function startServer() {
  await prisma.$connect();
  const server = app.listen(env.port, () => {
    logInfo('server_started', { port: env.port });
  });
  return server;
}
