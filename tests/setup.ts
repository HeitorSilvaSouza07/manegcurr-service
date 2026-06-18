import { afterAll, beforeEach } from '@jest/globals';
import { closePrisma } from '../src/config/prisma';
import { resetDatabase } from './helpers';

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await closePrisma();
});
