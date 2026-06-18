import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/config/prisma';

export const api = request(app);

export async function resetDatabase() {
  await prisma.position.deleteMany();
  await prisma.cv.deleteMany();
  await prisma.user.deleteMany();
}

export { prisma };
