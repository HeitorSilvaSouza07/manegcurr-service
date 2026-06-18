import { prisma } from '../../config/prisma';

export class UsersRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  create(data: { name: string; email: string; passwordHash: string; isAdmin: boolean }) {
    return prisma.user.create({ data });
  }
}

export const usersRepository = new UsersRepository();
