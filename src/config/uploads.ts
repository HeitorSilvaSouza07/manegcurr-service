import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from './env';
import { sanitizeFileName } from '../shared/utils/sanitize-file-name';

export interface UploadedDocument {
  originalName: string;
  storedName: string;
  filePath: string;
  mimeType: string;
  size: number;
}

export async function persistDocument(originalName: string, mimeType: string, buffer: Buffer): Promise<UploadedDocument> {
  await fs.mkdir(path.resolve(env.uploadsDir), { recursive: true });
  const safeName = sanitizeFileName(originalName || 'document');
  const storedName = `${Date.now()}-${safeName}`;
  const filePath = path.resolve(env.uploadsDir, storedName);
  await fs.writeFile(filePath, buffer);
  return {
    originalName,
    storedName,
    filePath,
    mimeType,
    size: buffer.length,
  };
}

export async function removeDocument(filePath: string): Promise<void> {
  await fs.rm(filePath, { force: true });
}
