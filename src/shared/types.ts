import type { PositionStatus } from '@prisma/client';

export interface JwtUser {
  sub: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export type { PositionStatus };
