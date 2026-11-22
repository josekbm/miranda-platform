import { AsyncLocalStorage } from "node:async_hooks";
import type { Prisma, PrismaClient } from "../generated/prisma/client";

type PrismaLike = PrismaClient | Prisma.TransactionClient;

const storage = new AsyncLocalStorage<Prisma.TransactionClient>();

export function getPrismaClient(base: PrismaClient): PrismaLike {
  return storage.getStore() ?? base;
}

export function runInTransaction<T>(base: PrismaClient, work: () => Promise<T>): Promise<T> {
  return base.$transaction((tx) => storage.run(tx, work));
}
