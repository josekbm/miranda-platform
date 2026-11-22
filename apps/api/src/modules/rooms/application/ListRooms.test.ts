import { describe, expect, it } from "vitest";
import { fixedNow, makeRoom } from "../test/factories";
import { InMemoryRoomRepository } from "../test/fakes";
import { ListRooms } from "./ListRooms";

describe("ListRooms", () => {
  it("lists rooms with pagination", async () => {
    const rooms = new InMemoryRoomRepository([
      makeRoom({ id: "00000000-0000-4000-8000-000000000010", roomNumber: "201" }),
      makeRoom({
        id: "00000000-0000-4000-8000-000000000011",
        roomNumber: "202",
        createdAt: fixedNow,
        updatedAt: fixedNow,
      }),
    ]);
    const useCase = new ListRooms(rooms);

    const result = await useCase.execute({ page: 1, pageSize: 1 });

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(2);
    expect(result.meta.totalPages).toBe(2);
  });

  it("filters active rooms for the public site", async () => {
    const rooms = new InMemoryRoomRepository([
      makeRoom({ id: "00000000-0000-4000-8000-000000000010", isActive: true }),
      makeRoom({ id: "00000000-0000-4000-8000-000000000011", isActive: false }),
    ]);
    const useCase = new ListRooms(rooms);

    const result = await useCase.execute({ page: 1, pageSize: 20, active: true });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.isActive).toBe(true);
  });

  it("searches by room number and translated name", async () => {
    const rooms = new InMemoryRoomRepository([makeRoom()]);
    const useCase = new ListRooms(rooms);

    const byNumber = await useCase.execute({ page: 1, pageSize: 20, search: "201" });
    const byName = await useCase.execute({ page: 1, pageSize: 20, search: "sea" });

    expect(byNumber.data).toHaveLength(1);
    expect(byName.data).toHaveLength(1);
  });
});
