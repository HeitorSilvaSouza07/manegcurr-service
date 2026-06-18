import { Prisma } from '@prisma/client';
import { BadRequestError } from '../../shared/errors/bad-request-error';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { UnauthorizedError } from '../../shared/errors/unauthorized-error';
import { comparePassword, hashPassword } from '../../shared/utils/password';
import { usersRepository } from './users.repository';

function toSafeUser(user: Prisma.UserGetPayload<{}>) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export class UsersService {
  async register(name: string, email: string, password: string) {
    const existingUser = await usersRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError('Já existe um usuário com este email', 'EMAIL_ALREADY_EXISTS');
    }

    const user = await usersRepository.create({
      name,
      email,
      passwordHash: await hashPassword(password),
      isAdmin: false,
    });

    return toSafeUser(user);
  }

  async login(email: string, password: string) {
    const user = await usersRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    return {
      user: toSafeUser(user),
      tokenPayload: {
        sub: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    };
  }

  async getMe(userId: string) {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }
    return toSafeUser(user);
  }
}

export const usersService = new UsersService();
