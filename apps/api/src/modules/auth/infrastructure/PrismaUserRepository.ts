import type { PrismaClient, User as PrismaUser } from "../../../generated/prisma/client";
import { getPrismaClient } from "../../../lib/prisma-context";
import type { UserRepository } from "../domain/ports";
import { User } from "../domain/User";

function toDomain(row: PrismaUser): User {
  return User.reconstitute({
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    name: row.name,
    phone: row.phone,
    role: row.role,
    status: row.status,
    avatarUrl: row.avatarUrl,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const row = await getPrismaClient(this.prisma).user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    return row ? toDomain(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const row = await getPrismaClient(this.prisma).user.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }
}
