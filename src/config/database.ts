import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from './env';
import type { DatabaseState } from '../shared/types';

const emptyState: DatabaseState = {
  users: [],
  cvs: [],
  positions: [],
};

export class Database {
  private readonly filePath: string;

  constructor() {
    this.filePath = path.resolve(env.dataDir, 'database.json');
  }

  async init(): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.mkdir(path.resolve(env.uploadsDir), { recursive: true });
    try {
      await fs.access(this.filePath);
    } catch {
      await this.write(emptyState);
    }
  }

  async read(): Promise<DatabaseState> {
    await this.init();
    const raw = await fs.readFile(this.filePath, 'utf8');
    if (!raw.trim()) {
      return structuredClone(emptyState);
    }
    return JSON.parse(raw) as DatabaseState;
  }

  async write(state: DatabaseState): Promise<void> {
    const tempPath = `${this.filePath}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(state, null, 2), 'utf8');
    await fs.rename(tempPath, this.filePath);
  }

  async transaction<T>(handler: (state: DatabaseState) => Promise<T> | T): Promise<T> {
    const state = await this.read();
    const result = await handler(state);
    await this.write(state);
    return result;
  }
}

export const database = new Database();
