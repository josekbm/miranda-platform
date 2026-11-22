import { describe, expect, it } from "vitest";
import { buildApp } from "../../../../app";
import { err, ok } from "../../../../lib/result";
import { createFakeContainer } from "../../../../test/container";
import type { TokenService } from "../../../auth/domain/ports";
import type { CreateBookingInput } from "../../application/CreateBooking";
import { RoomNotAvailableError } from "../../domain/errors";
import { fixedNow, makeBooking, TEST_ROOM_ID } from "../../test/factories";

const booking = makeBooking({ roomId: TEST_ROOM_ID });

function makeApp(bookings = {}, auth = {}) {
  return buildApp({
    logger: false,
    container: createFakeContainer({ auth, bookings }),
  });
}

const authHeader = { authorization: "Bearer valid" };

const receptionistTokens: TokenService = {
  async signAccessToken() {
    return "access-token";
  },
  async verifyAccessToken() {
    return {
      sub: "00000000-0000-4000-8000-000000000002",
      email: "reception@miranda.test",
      role: "RECEPTIONIST",
    };
  },
};

describe("booking routes", () => {
  it("creates a public booking request and forces the WEBSITE source", async () => {
    let received: CreateBookingInput | undefined;
    const app = makeApp({
      createBooking: {
        async execute(input: CreateBookingInput) {
          received = input;
          return ok(booking);
        },
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/public/bookings",
      payload: {
        roomId: TEST_ROOM_ID,
        guestName: "Ada Lovelace",
        guestEmail: "ada@example.com",
        guestPhone: "+34600000000",
        checkIn: "2026-12-01",
        checkOut: "2026-12-03",
        source: "ADMIN",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(received?.source).toBe("WEBSITE");
    expect(response.json().data.reference).toBe(booking.reference);

    await app.close();
  });

  it("maps availability errors to 409", async () => {
    const app = makeApp({
      createBooking: {
        async execute() {
          return err(new RoomNotAvailableError(TEST_ROOM_ID));
        },
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/public/bookings",
      payload: {
        roomId: TEST_ROOM_ID,
        guestName: "Ada Lovelace",
        guestEmail: "ada@example.com",
        guestPhone: "+34600000000",
        checkIn: "2026-12-01",
        checkOut: "2026-12-03",
      },
    });

    expect(response.statusCode).toBe(409);
    expect(response.json().error.code).toBe("ROOM_NOT_AVAILABLE");

    await app.close();
  });

  it("lists bookings for authenticated staff", async () => {
    const app = makeApp({
      listBookings: {
        async execute() {
          return {
            data: [booking],
            meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
          };
        },
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/admin/bookings",
      headers: authHeader,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toHaveLength(1);
    expect(response.json().meta.total).toBe(1);

    await app.close();
  });

  it("rejects unauthenticated admin requests", async () => {
    const app = makeApp();

    const response = await app.inject({ method: "GET", url: "/api/v1/admin/bookings" });

    expect(response.statusCode).toBe(401);

    await app.close();
  });

  it("returns a booking by id", async () => {
    const app = makeApp({
      getBooking: {
        async execute() {
          return ok(booking);
        },
      },
    });

    const response = await app.inject({
      method: "GET",
      url: `/api/v1/admin/bookings/${booking.id}`,
      headers: authHeader,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data.id).toBe(booking.id);

    await app.close();
  });

  it("updates a booking status", async () => {
    const confirmed = makeBooking({ roomId: TEST_ROOM_ID });
    confirmed.confirm(fixedNow);

    const app = makeApp({
      updateBookingStatus: {
        async execute() {
          return ok(confirmed);
        },
      },
    });

    const response = await app.inject({
      method: "PATCH",
      url: `/api/v1/admin/bookings/${booking.id}/status`,
      headers: authHeader,
      payload: { status: "CONFIRMED" },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data.status).toBe("CONFIRMED");

    await app.close();
  });

  it("prevents receptionists from cancelling bookings", async () => {
    const app = makeApp({}, { tokens: receptionistTokens });

    const response = await app.inject({
      method: "PATCH",
      url: `/api/v1/admin/bookings/${booking.id}/status`,
      headers: authHeader,
      payload: { status: "CANCELLED" },
    });

    expect(response.statusCode).toBe(403);
    expect(response.json().error.code).toBe("FORBIDDEN");

    await app.close();
  });
});
