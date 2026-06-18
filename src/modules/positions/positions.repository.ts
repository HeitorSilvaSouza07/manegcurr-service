import { prisma } from '../../config/prisma';
import type { PositionStatus } from '@prisma/client';

export class PositionsRepository {
  create(data: {
    userId: string;
    cvId?: string | null;
    name: string;
    description?: string | null;
    requirements?: string | null;
    status: PositionStatus;
  }) {
    return prisma.position.create({ data });
  }

  findById(id: string) {
    return prisma.position.findUnique({ where: { id } });
  }

  listByUserId(userId: string, status?: PositionStatus) {
    return prisma.position.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  update(id: string, data: {
    name?: string;
    description?: string | null;
    requirements?: string | null;
    cvId?: string | null;
    status?: PositionStatus;
  }) {
    return prisma.position.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return prisma.position.delete({ where: { id } });
  }
}

export const positionsRepository = new PositionsRepository();
