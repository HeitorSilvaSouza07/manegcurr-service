import { ForbiddenError } from '../../shared/errors/forbidden-error';
import { NotFoundError } from '../../shared/errors/not-found-error';
import type { Position, PositionStatus } from '@prisma/client';
import { cvsRepository } from '../cvs/cvs.repository';
import { positionsRepository } from './positions.repository';

export class PositionsService {
  async create(
    userId: string,
    input: { name: string; description?: string | null; requirements?: string | null; cvId?: string | null; status?: PositionStatus },
  ): Promise<Position> {
    if (input.cvId) {
      const cv = await cvsRepository.findById(input.cvId);
      if (!cv || cv.userId !== userId) {
        throw new ForbiddenError('CV inválido para este usuário');
      }
    }

    return positionsRepository.create({
      userId,
      cvId: input.cvId ?? null,
      name: input.name,
      description: input.description ?? null,
      requirements: input.requirements ?? null,
      status: input.status ?? 'applied',
    });
  }

  list(userId: string, status?: PositionStatus) {
    return positionsRepository.listByUserId(userId, status);
  }

  async getById(userId: string, id: string) {
    const position = await positionsRepository.findById(id);
    if (!position) {
      throw new NotFoundError('Candidatura não encontrada');
    }
    if (position.userId !== userId) {
      throw new ForbiddenError('Você não tem acesso a esta candidatura');
    }
    return position;
  }

  async update(
    userId: string,
    id: string,
    input: { name?: string; description?: string | null; requirements?: string | null; cvId?: string | null },
  ) {
    const position = await this.getById(userId, id);
    if (input.cvId) {
      const cv = await cvsRepository.findById(input.cvId);
      if (!cv || cv.userId !== userId) {
        throw new ForbiddenError('CV inválido para este usuário');
      }
    }

    return positionsRepository.update(position.id, {
      name: input.name ?? position.name,
      description: input.description === undefined ? position.description : input.description,
      requirements: input.requirements === undefined ? position.requirements : input.requirements,
      cvId: input.cvId === undefined ? position.cvId : input.cvId,
    });
  }

  async updateStatus(userId: string, id: string, status: PositionStatus) {
    const position = await this.getById(userId, id);
    return positionsRepository.update(position.id, { status });
  }

  async delete(userId: string, id: string) {
    await this.getById(userId, id);
    await positionsRepository.delete(id);
  }
}

export const positionsService = new PositionsService();
