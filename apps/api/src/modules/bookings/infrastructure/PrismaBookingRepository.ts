import type {
  Prisma,
  Booking as PrismaBooking,
  PrismaClient,
} from "../../../generated/prisma/client";
import { getPrismaClient } from "../../../lib/prisma-context";
import { Booking } from "../domain/Booking";
import { DateRange } from "../domain/DateRange";
import type { BookingQuery, BookingRepository, Paginated } from "../domain/ports";

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED", "CHECKED_IN"] as const;

function toDomain(row: PrismaBooking): Booking {
  return Booking.reconstitute({
    id: row.id,
    reference: row.reference,
    roomId: row.roomId,
    guestName: row.guestName,
    guestEmail: row.guestEmail,
    guestPhone: row.guestPhone,
    range: DateRange.from(row.checkIn, row.checkOut),
    status: row.status,
    totalCents: row.totalCents,
    specialRequests: row.specialRequests,
    source: row.source,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

function dateAtStart(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function dateAtEnd(value: string): Date {
  return new Date(`${value}T23:59:59.999Z`);
}

export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Booking | null> {
    const row = await getPrismaClient(this.prisma).booking.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async findOverlapping(roomId: string, range: DateRange, excludeId?: string): Promise<Booking[]> {
    const where: Prisma.BookingWhereInput = {
      roomId,
      status: { in: [...ACTIVE_STATUSES] },
      checkIn: { lt: range.checkOut },
      checkOut: { gt: range.checkIn },
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const rows = await getPrismaClient(this.prisma).booking.findMany({
      where,
      orderBy: { checkIn: "asc" },
    });

    return rows.map(toDomain);
  }

  async list(query: BookingQuery): Promise<Paginated<Booking>> {
    const where: Prisma.BookingWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.guestName = { contains: query.search, mode: "insensitive" };
    }

    if (query.from) {
      where.checkOut = { gte: dateAtStart(query.from) };
    }

    if (query.to) {
      where.checkIn = { lte: dateAtEnd(query.to) };
    }

    const sort = query.sort ?? "createdAt";
    const order = query.order ?? "desc";
    const client = getPrismaClient(this.prisma);

    const [total, rows] = await Promise.all([
      client.booking.count({ where }),
      client.booking.findMany({
        where,
        orderBy: { [sort]: order },
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

  async save(booking: Booking): Promise<void> {
    const props = booking.toPrimitives();

    await getPrismaClient(this.prisma).booking.create({
      data: {
        id: props.id,
        reference: props.reference,
        roomId: props.roomId,
        guestName: props.guestName,
        guestEmail: props.guestEmail,
        guestPhone: props.guestPhone,
        checkIn: props.range.checkIn,
        checkOut: props.range.checkOut,
        status: props.status,
        totalCents: props.totalCents,
        specialRequests: props.specialRequests,
        source: props.source,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      },
    });
  }

  async update(booking: Booking): Promise<void> {
    const props = booking.toPrimitives();

    await getPrismaClient(this.prisma).booking.update({
      where: { id: props.id },
      data: {
        roomId: props.roomId,
        guestName: props.guestName,
        guestEmail: props.guestEmail,
        guestPhone: props.guestPhone,
        checkIn: props.range.checkIn,
        checkOut: props.range.checkOut,
        status: props.status,
        totalCents: props.totalCents,
        specialRequests: props.specialRequests,
        source: props.source,
        updatedAt: props.updatedAt,
      },
    });
  }
}
