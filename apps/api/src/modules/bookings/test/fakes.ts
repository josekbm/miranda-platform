import type { Booking } from "../domain/Booking";
import type { DateRange } from "../domain/DateRange";
import type {
  BookableRoom,
  BookableRoomRepository,
  BookingNotifier,
  BookingQuery,
  BookingReferenceGenerator,
  BookingRepository,
  Paginated,
} from "../domain/ports";

export {
  FakeClock,
  ImmediateUnitOfWork,
  SequentialIdGenerator,
} from "../../../test/fakes";

export class InMemoryBookingRepository implements BookingRepository {
  private readonly items = new Map<string, Booking>();

  async findById(id: string): Promise<Booking | null> {
    return this.items.get(id) ?? null;
  }

  async findOverlapping(roomId: string, range: DateRange, excludeId?: string): Promise<Booking[]> {
    return [...this.items.values()].filter(
      (booking) =>
        booking.roomId === roomId &&
        booking.id !== excludeId &&
        ["PENDING", "CONFIRMED", "CHECKED_IN"].includes(booking.status) &&
        booking.range.overlaps(range),
    );
  }

  async list(query: BookingQuery): Promise<Paginated<Booking>> {
    const search = query.search?.toLowerCase();
    const filtered = [...this.items.values()].filter((booking) => {
      if (query.status && booking.status !== query.status) return false;
      if (search && !booking.guestName.toLowerCase().includes(search)) return false;
      return true;
    });

    const sort = query.sort ?? "createdAt";
    const direction = query.order === "asc" ? 1 : -1;
    const sorted = filtered.sort((a, b) => {
      const aValue =
        sort === "guestName" ? a.guestName : sort === "checkIn" ? a.range.checkIn : a.createdAt;
      const bValue =
        sort === "guestName" ? b.guestName : sort === "checkIn" ? b.range.checkIn : b.createdAt;

      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });

    const start = (query.page - 1) * query.pageSize;
    const data = sorted.slice(start, start + query.pageSize);

    return {
      data,
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total: sorted.length,
        totalPages: Math.ceil(sorted.length / query.pageSize),
      },
    };
  }

  async save(booking: Booking): Promise<void> {
    this.items.set(booking.id, booking);
  }

  async update(booking: Booking): Promise<void> {
    this.items.set(booking.id, booking);
  }
}

export class InMemoryBookableRoomRepository implements BookableRoomRepository {
  private readonly rooms: Map<string, BookableRoom>;

  constructor(rooms: BookableRoom[]) {
    this.rooms = new Map(rooms.map((room) => [room.id, room]));
  }

  async findById(id: string): Promise<BookableRoom | null> {
    return this.rooms.get(id) ?? null;
  }
}

export class FakeBookingReferenceGenerator implements BookingReferenceGenerator {
  private sequence = 0;

  async next(): Promise<string> {
    this.sequence += 1;
    return `B-2026-${String(this.sequence).padStart(4, "0")}`;
  }
}

export class RecordingBookingNotifier implements BookingNotifier {
  readonly requested: Booking[] = [];
  readonly confirmed: Booking[] = [];

  async bookingRequested(booking: Booking): Promise<void> {
    this.requested.push(booking);
  }

  async bookingConfirmed(booking: Booking): Promise<void> {
    this.confirmed.push(booking);
  }
}
