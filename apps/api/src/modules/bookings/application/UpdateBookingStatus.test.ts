import { describe, expect, it } from "vitest";
import type { BookingStatus } from "../domain/BookingStatus";
import { fixedNow, makeBooking } from "../test/factories";
import { FakeClock, InMemoryBookingRepository, RecordingBookingNotifier } from "../test/fakes";
import { UpdateBookingStatus } from "./UpdateBookingStatus";

function setup(status: BookingStatus = "PENDING") {
  const bookings = new InMemoryBookingRepository();
  const booking = makeBooking({ status });
  const clock = new FakeClock(fixedNow);
  const notifier = new RecordingBookingNotifier();
  const useCase = new UpdateBookingStatus(bookings, clock, notifier);

  return { useCase, bookings, booking, notifier };
}

describe("UpdateBookingStatus", () => {
  it("confirms a pending booking and notifies the guest", async () => {
    const { useCase, bookings, booking, notifier } = setup();
    await bookings.save(booking);

    const result = await useCase.execute(booking.id, "CONFIRMED");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.status).toBe("CONFIRMED");
    expect(notifier.confirmed).toHaveLength(1);
  });

  it("checks in and checks out a confirmed booking", async () => {
    const { useCase, bookings, booking } = setup("CONFIRMED");
    await bookings.save(booking);

    const checkIn = await useCase.execute(booking.id, "CHECKED_IN");
    expect(checkIn.ok).toBe(true);
    if (!checkIn.ok) return;
    expect(checkIn.value.status).toBe("CHECKED_IN");

    const checkOut = await useCase.execute(booking.id, "CHECKED_OUT");
    expect(checkOut.ok).toBe(true);
    if (!checkOut.ok) return;
    expect(checkOut.value.status).toBe("CHECKED_OUT");
  });

  it("rejects invalid transitions", async () => {
    const { useCase, bookings, booking } = setup();
    await bookings.save(booking);

    const result = await useCase.execute(booking.id, "CHECKED_IN");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("INVALID_STATUS_TRANSITION");
  });

  it("returns BOOKING_NOT_FOUND for unknown bookings", async () => {
    const { useCase } = setup();

    const result = await useCase.execute("missing", "CONFIRMED");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("BOOKING_NOT_FOUND");
  });
});
