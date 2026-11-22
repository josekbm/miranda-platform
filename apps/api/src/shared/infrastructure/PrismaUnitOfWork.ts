import type { PrismaClient } from "../../generated/prisma/client";
import { runInTransaction } from "../../lib/prisma-context";
import type { UnitOfWork } from "../ports";

export class PrismaUnitOfWork implements UnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  async transaction<T>(work: () => Promise<T>): Promise<T> {
    return runInTransaction(this.prisma, work);
  }
}
