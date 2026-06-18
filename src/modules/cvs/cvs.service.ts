import fs from 'node:fs/promises';
import { ForbiddenError } from '../../shared/errors/forbidden-error';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { BadRequestError } from '../../shared/errors/bad-request-error';
import type { Cv } from '@prisma/client';
import { cvsRepository } from './cvs.repository';

export class CvsService {
  async create(userId: string, input: { name: string }, file?: Express.Multer.File): Promise<Cv> {
    if (!file) {
      throw new BadRequestError('Arquivo do CV é obrigatório');
    }

    return cvsRepository.create({
      userId,
      name: input.name,
      documentPath: file.path,
    });
  }

  list(userId: string) {
    return cvsRepository.listByUserId(userId);
  }

  async getById(userId: string, id: string) {
    const cv = await cvsRepository.findById(id);
    if (!cv) {
      throw new NotFoundError('CV não encontrado');
    }
    if (cv.userId !== userId) {
      throw new ForbiddenError('Você não tem acesso a este CV');
    }
    return cv;
  }

  async delete(userId: string, id: string) {
    const cv = await this.getById(userId, id);
    await fs.rm(cv.documentPath, { force: true });
    await cvsRepository.delete(id);
  }
}

export const cvsService = new CvsService();
