import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { env } from './env';

const uploadDir = path.resolve(env.uploadsDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const safeName = file.originalname.replace(/[^\w.\-]+/g, '_');
      cb(null, `${Date.now()}-${safeName}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ((ext !== '.pdf' && ext !== '.docx') || !allowedMimeTypes.has(file.mimetype)) {
      cb(new Error('Somente arquivos .pdf e .docx são permitidos'));
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
