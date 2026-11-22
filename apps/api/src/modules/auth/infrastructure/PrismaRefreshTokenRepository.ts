import type { PrismaClient } from "../../../generated/prisma/client";
import { getPrismaClient } from "../../../lib/prisma-context";
import type {
  CreateRefreshTokenInput,
  RefreshTokenRecord,
  RefreshTokenRepository,
} from "../domain/ports";

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    const row = await getPrismaClient(this.prisma).refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      userId: row.userId,
      tokenHash: row.tokenHash,
      expiresAt: row.expiresAt,
      revokedAt: row.revokedAt,
      userAgent: row.userAgent,
      ip: row.ip,
      createdAt: row.createdAt,
    };
  }

  async create(input: CreateRefreshTokenInput): Promise<void> {
    await getPrismaClient(this.prisma).refreshToken.create({
      data: {
        id: input.id,
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        userAgent: input.userAgent,
        ip: input.ip,
      },
    });
  }

  async revoke(id: string, revokedAt: Date): Promise<void> {
    await getPrismaClient(this.prisma).refreshToken.update({
      where: { id },
      data: { revokedAt },
    });
  }

  async revokeAllForUser(userId: string, revokedAt: Date): Promise<void> {
    await getPrismaClient(this.prisma).refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt },
    });
  }
}
