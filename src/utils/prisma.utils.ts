import { Prisma } from '@prisma/client';
import { PrismaErrorCode } from './prisma-error-codes.enum';

export function isPrismaError(error: unknown, code?: PrismaErrorCode): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return code ? error.code === code : true;
  }
  return false;
}
