import { describe, expect, it } from "vitest";
import { buildApp } from "../../../../app";
import { err, ok } from "../../../../lib/result";
import { createFakeContainer } from "../../../../test/container";
import type { RoomsContainer } from "../../container";
import { RoomNotFoundError } from "../../domain/errors";
import type { RoomQuery } from "../../domain/ports";
import { makeRoom } from "../../test/factories";

const room = makeRoom();

function makeApp(rooms: Partial<RoomsContainer> = {}) {
  return buildApp({
    logger: false,
    container: createFakeContainer({ rooms }),
  });
}

describe("room routes", () => {
  it("lists public rooms in the requested locale", async () => {
    let received: RoomQuery | undefined;
    const app = makeApp({
      listRooms: {
        async execute(query) {
          received = query;
          return {
            data: [room],
            meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
          };
        },
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/public/rooms?locale=en",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toHaveLength(1);
    expect(received?.active).toBe(true);

    await app.close();
  });

  it("returns a public room by slug", async () => {
    const app = makeApp({
      getRoomBySlug: {
        async execute() {
          return ok(room);
        },
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/public/rooms/suite-mar?locale=en",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data.slug).toBe("suite-mar");
    expect(response.json().data.amenities[0].name).toBe("Wi-Fi");

    await app.close();
  });

  it("returns 404 for unknown public rooms", async () => {
    const app = makeApp({
      getRoomBySlug: {
        async execute() {
          return err(new RoomNotFoundError("missing"));
        },
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/public/rooms/missing",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe("ROOM_NOT_FOUND");

    await app.close();
  });

  it("lists rooms for authenticated staff", async () => {
    const app = makeApp({
      listRooms: {
        async execute() {
          return {
            data: [room],
            meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
          };
        },
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/admin/rooms",
      headers: { authorization: "Bearer valid" },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data[0].id).toBe(room.id);

    await app.close();
  });

  it("rejects unauthenticated admin room requests", async () => {
    const app = makeApp();

    const response = await app.inject({ method: "GET", url: "/api/v1/admin/rooms" });

    expect(response.statusCode).toBe(401);

    await app.close();
  });

  it("returns a room by id for authenticated staff", async () => {
    const app = makeApp({
      getRoomById: {
        async execute() {
          return ok(room);
        },
      },
    });

    const response = await app.inject({
      method: "GET",
      url: `/api/v1/admin/rooms/${room.id}`,
      headers: { authorization: "Bearer valid" },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data.id).toBe(room.id);

    await app.close();
  });
});
