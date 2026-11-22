import type { Prisma, PrismaClient } from "../../../generated/prisma/client";
import { getPrismaClient } from "../../../lib/prisma-context";
import type { Paginated, RoomQuery, RoomRepository } from "../domain/ports";
import { Room } from "../domain/Room";

const roomInclude = {
  translations: true,
  images: { orderBy: { sortOrder: "asc" } },
  amenities: {
    include: {
      amenity: {
        include: {
          translations: true,
        },
      },
    },
  },
} satisfies Prisma.RoomInclude;

type RoomRow = Prisma.RoomGetPayload<{ include: typeof roomInclude }>;

function toDomain(row: RoomRow): Room {
  return Room.reconstitute({
    id: row.id,
    reference: row.reference,
    slug: row.slug,
    roomNumber: row.roomNumber,
    type: row.type,
    priceCents: row.priceCents,
    discountPct: row.discountPct,
    capacity: row.capacity,
    sizeSqm: row.sizeSqm,
    isActive: row.isActive,
    translations: row.translations.map((translation) => ({
      locale: translation.locale,
      name: translation.name,
      description: translation.description,
      cancellationPolicy: translation.cancellationPolicy,
    })),
    images: row.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      width: image.width,
      height: image.height,
      sortOrder: image.sortOrder,
    })),
    amenities: row.amenities.map((roomAmenity) => ({
      key: roomAmenity.amenity.key,
      icon: roomAmenity.amenity.icon,
      translations: roomAmenity.amenity.translations.map((translation) => ({
        locale: translation.locale,
        name: translation.name,
      })),
    })),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export class PrismaRoomRepository implements RoomRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Room | null> {
    const client = getPrismaClient(this.prisma) as PrismaClient;
    const row = await client.room.findUnique({ where: { id }, include: roomInclude });
    return row ? toDomain(row) : null;
  }

  async findBySlug(slug: string): Promise<Room | null> {
    const client = getPrismaClient(this.prisma) as PrismaClient;
    const row = await client.room.findUnique({ where: { slug }, include: roomInclude });
    return row ? toDomain(row) : null;
  }

  async list(query: RoomQuery): Promise<Paginated<Room>> {
    const client = getPrismaClient(this.prisma) as PrismaClient;
    const where: Prisma.RoomWhereInput = {};

    if (query.active !== undefined) {
      where.isActive = query.active;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.search) {
      where.OR = [
        { roomNumber: { contains: query.search, mode: "insensitive" } },
        { translations: { some: { name: { contains: query.search, mode: "insensitive" } } } },
      ];
    }

    const [total, rows] = await Promise.all([
      client.room.count({ where }),
      client.room.findMany({
        where,
        include: roomInclude,
        orderBy: { roomNumber: "asc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
    ]);

    return {
      data: rows.map(toDomain),
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  }
}
