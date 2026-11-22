import { describe, expect, it } from "vitest";
import { fixedNow } from "../test/factories";
import { Booking } from "./Booking";
import { DateRange } from "./DateRange";
import { BookingValidationError, InvalidStatusTransitionError } from "./errors";

function createBooking(overrides: Partial<Parameters<typeof Booking.create>[0]> = {}) {
  return Booking.create({
    id: "00000000-0000-4000-8000-000000000001",
    reference: "B-2026-0001",
    roomId: "room-1",
    guestName: "  Ada Lovelace  ",
    guestEmail: "ADA@EXAMPLE.COM",
    guestPhone: "+34600000000",
    range: DateRange.from("2026-12-01", "2026-12-03"),
    totalCents: 20_000,
    specialRequests: "  Late check-in  ",
    source: "WEBSITE",
    now: fixedNow,
    ...overrides,
  });
}

describe("Booking", () => {
  it("creates a pending booking and normalizes guest data", () => {
    const booking = createBooking();

    expect(booking.status).toBe("PENDING");
    expect(booking.guestName).toBe("Ada Lovelace");
    expect(booking.guestEmail).toBe("ada@example.com");
    expect(booking.specialRequests).toBe("Late check-in");
  });

  it("rejects invalid guest data", () => {
    expect(() => createBooking({ guestName: "   " })).toThrow(BookingValidationError);
    expect(() => createBooking({ guestEmail: "not-an-email" })).toThrow(BookingValidationError);
    expect(() => createBooking({ guestPhone: "" })).toThrow(BookingValidationError);
    expect(() => createBooking({ totalCents: -1 })).toThrow(BookingValidationError);
  });

  it("enforces status transitions", () => {
    const booking = createBooking();

    booking.confirm(fixedNow);
    expect(booking.status).toBe("CONFIRMED");

    booking.checkIn(fixedNow);
    expect(booking.status).toBe("CHECKED_IN");

    booking.checkOut(fixedNow);
    expect(booking.status).toBe("CHECKED_OUT");

    expect(() => booking.confirm(fixedNow)).toThrow(InvalidStatusTransitionError);
  });
});
