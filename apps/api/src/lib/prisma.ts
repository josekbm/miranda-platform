import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../env";
import { PrismaClient } from "../generated/prisma/client";

let client: PrismaClient | null = null;

export function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export function getPrisma(): PrismaClient {
  client ??= createPrismaClient();
  return client;
}
