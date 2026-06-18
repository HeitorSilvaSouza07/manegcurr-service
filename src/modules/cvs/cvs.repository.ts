import { prisma } from '../../config/prisma';

export class CvsRepository {
  create(data: { userId: string; name: string; documentPath: string }) {
    return prisma.cv.create({ data });
  }

  findById(id: string) {
    return prisma.cv.findUnique({ where: { id } });
  }

  listByUserId(userId: string) {
    return prisma.cv.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  delete(id: string) {
    return prisma.cv.delete({ where: { id } });
  }
}

export const cvsRepository = new CvsRepository();
