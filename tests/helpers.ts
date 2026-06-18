import { AddressInfo } from 'node:net';
import { createApp } from '../src/app';
import { database } from '../src/config/database';

export async function createTestServer() {
  await database.init();
  await database.write({ users: [], cvs: [], positions: [] });

  const app = createApp();
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  return {
    baseUrl,
    server,
    async reset() {
      await database.write({ users: [], cvs: [], positions: [] });
    },
    async close() {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    },
  };
}
