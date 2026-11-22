import { describe, expect, it } from "vitest";
import type { BookableRoom } from "../domain/ports";
import { fixedNow, makeBooking, makeRoom } from "../test/factories";
import {
  FakeBookingReferenceGenerator,
  FakeClock,
  ImmediateUnitOfWork,
  InMemoryBookableRoomRepository,
  InMemoryBookingRepository,
  RecordingBookingNotifier,
  SequentialIdGenerator,
} from "../test/fakes";
import { CreateBooking } from "./CreateBooking";

function setup(roomOverrides: Partial<BookableRoom> = {}) {
  const bookings = new InMemoryBookingRepository();
  const rooms = new InMemoryBookableRoomRepository([makeRoom(roomOverrides)]);
  const clock = new FakeClock(fixedNow);
  const ids = new SequentialIdGenerator();
  const references = new FakeBookingReferenceGenerator();
  const uow = new ImmediateUnitOfWork();
  const notifier = new RecordingBookingNotifier();
  const useCase = new CreateBooking(bookings, rooms, uow, clock, ids, references, notifier);

  return { useCase, bookings, notifier };
}

const validInput = {
  roomId: "room-1",
  guestName: "Ada Lovelace",
  guestEmail: "ada@example.com",
  guestPhone: "+34600000000",
  checkIn: "2026-12-01",
  checkOut: "2026-12-03",
};

describe("CreateBooking", () => {
  it("creates a pending booking with server-side pricing", async () => {
    const { useCase, bookings, notifier } = setup({ priceCents: 10_000, discountPct: 10 });

    const result = await useCase.execute(validInput);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.status).toBe("PENDING");
    expect(result.value.totalCents).toBe(18_000);
    expect(result.value.reference).toBe("B-2026-0001");
    expect(await bookings.findById(result.value.id)).not.toBeNull();
    expect(notifier.requested).toHaveLength(1);
  });

  it("returns ROOM_NOT_FOUND for unknown rooms", async () => {
    const { useCase } = setup();

    const result = await useCase.execute({ ...validInput, roomId: "missing" });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("ROOM_NOT_FOUND");
  });

  it("returns ROOM_NOT_FOUND for inactive rooms", async () => {
    const { useCase } = setup({ isActive: false });

    const result = await useCase.execute(validInput);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("ROOM_NOT_FOUND");
  });

  it("rejects guests over the room capacity", async () => {
    const { useCase } = setup({ capacity: 2 });

    const result = await useCase.execute({ ...validInput, guests: 3 });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("BOOKING_VALIDATION");
  });

  it("returns ROOM_NOT_AVAILABLE when another booking overlaps", async () => {
    const { useCase, bookings } = setup();
    await bookings.save(makeBooking({ status: "CONFIRMED" }));

    const result = await useCase.execute(validInput);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("ROOM_NOT_AVAILABLE");
  });

  it("ignores cancelled bookings when checking availability", async () => {
    const { useCase, bookings } = setup();
    await bookings.save(makeBooking({ status: "CANCELLED" }));

    const result = await useCase.execute(validInput);

    expect(result.ok).toBe(true);
  });

  it("returns INVALID_DATE_RANGE for invalid stays", async () => {
    const { useCase } = setup();

    const result = await useCase.execute({ ...validInput, checkOut: validInput.checkIn });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("INVALID_DATE_RANGE");
  });

  it("returns BOOKING_VALIDATION for invalid guest data", async () => {
    const { useCase } = setup();

    const result = await useCase.execute({ ...validInput, guestEmail: "invalid" });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("BOOKING_VALIDATION");
  });
});
