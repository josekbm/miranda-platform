import { Booking, type BookingProps } from "../domain/Booking";
import { DateRange } from "../domain/DateRange";
import type { BookableRoom } from "../domain/ports";

export const fixedNow = new Date("2026-11-21T10:00:00.000Z");
export const TEST_ROOM_ID = "00000000-0000-4000-8000-000000000010";

export function makeRoom(overrides: Partial<BookableRoom> = {}): BookableRoom {
  return {
    id: "room-1",
    roomNumber: "101",
    type: "DOUBLE",
    priceCents: 10_000,
    discountPct: 0,
    capacity: 2,
    isActive: true,
    ...overrides,
  };
}

export function makeBooking(overrides: Partial<BookingProps> = {}): Booking {
  return Booking.reconstitute({
    id: "00000000-0000-4000-8000-000000000001",
    reference: "B-2026-0001",
    roomId: "room-1",
    guestName: "Ada Lovelace",
    guestEmail: "ada@example.com",
    guestPhone: "+34600000000",
    range: DateRange.from("2026-12-01", "2026-12-03"),
    status: "PENDING",
    totalCents: 20_000,
    specialRequests: null,
    source: "WEBSITE",
    createdAt: fixedNow,
    updatedAt: fixedNow,
    ...overrides,
  });
}
