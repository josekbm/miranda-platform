import type { PrismaClient } from "../../../generated/prisma/client";
import { getPrismaClient } from "../../../lib/prisma-context";
import type { BookableRoom, BookableRoomRepository } from "../domain/ports";

export class PrismaBookableRoomRepository implements BookableRoomRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<BookableRoom | null> {
    const row = await getPrismaClient(this.prisma).room.findUnique({ where: { id } });

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      roomNumber: row.roomNumber,
      type: row.type,
      priceCents: row.priceCents,
      discountPct: row.discountPct,
      capacity: row.capacity,
      isActive: row.isActive,
    };
  }
}
