import type { NextFunction, Request, Response } from 'express';

export interface ParsedMultipartFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

function parseHeaderParams(value: string): Record<string, string> {
  const result: Record<string, string> = {};
  value.split(';').map((chunk) => chunk.trim()).forEach((chunk) => {
    const [key, raw] = chunk.split('=');
    if (!raw) {
      return;
    }
    result[key] = raw.replace(/^"|"$/g, '');
  });
  return result;
}

async function readBody(req: Request): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export async function multipartMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const contentType = req.headers['content-type'] ?? '';
  if (!contentType.startsWith('multipart/form-data')) {
    next();
    return;
  }

  const boundaryMatch = /boundary=([^;]+)/i.exec(contentType);
  if (!boundaryMatch) {
    next(new Error('Boundary multipart ausente'));
    return;
  }

  const boundary = `--${boundaryMatch[1]}`;
  const body = await readBody(req);
  const parts = body.toString('binary').split(boundary);
  const bodyFields: Record<string, string> = {};
  let file: ParsedMultipartFile | undefined;

  for (const rawPart of parts) {
    const part = rawPart.trim();
    if (!part || part === '--') {
      continue;
    }

    const separatorIndex = part.indexOf('\r\n\r\n');
    if (separatorIndex === -1) {
      continue;
    }

    const rawHeaders = part.slice(0, separatorIndex);
    const rawContent = part.slice(separatorIndex + 4).replace(/\r\n--$/, '');
    const headers = rawHeaders.split('\r\n');
    const dispositionHeader = headers.find((header) => header.toLowerCase().startsWith('content-disposition'));
    const typeHeader = headers.find((header) => header.toLowerCase().startsWith('content-type'));

    if (!dispositionHeader) {
      continue;
    }

    const disposition = parseHeaderParams(dispositionHeader.split(':')[1].trim());
    const fieldName = disposition.name;
    const filename = disposition.filename;

    if (!fieldName) {
      continue;
    }

    if (filename) {
      file = {
        originalname: filename,
        mimetype: typeHeader ? typeHeader.split(':')[1].trim() : 'application/octet-stream',
        buffer: Buffer.from(rawContent, 'binary'),
      };
    } else {
      bodyFields[fieldName] = rawContent.replace(/\r\n$/, '');
    }
  }

  (req as Request & { body: Record<string, string>; file?: ParsedMultipartFile }).body = {
    ...(req.body as Record<string, string> | undefined),
    ...bodyFields,
  };
  if (file) {
    (req as Request & { file?: ParsedMultipartFile }).file = file;
  }

  next();
}
