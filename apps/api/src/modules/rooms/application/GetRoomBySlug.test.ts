import { describe, expect, it } from "vitest";
import { makeRoom } from "../test/factories";
import { InMemoryRoomRepository } from "../test/fakes";
import { GetRoomBySlug } from "./GetRoomBySlug";

describe("GetRoomBySlug", () => {
  it("returns an active room by slug", async () => {
    const room = makeRoom();
    const useCase = new GetRoomBySlug(new InMemoryRoomRepository([room]));

    const result = await useCase.execute(room.slug);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.id).toBe(room.id);
  });

  it("hides inactive rooms from the public site", async () => {
    const room = makeRoom({ isActive: false });
    const useCase = new GetRoomBySlug(new InMemoryRoomRepository([room]));

    const result = await useCase.execute(room.slug);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("ROOM_NOT_FOUND");
  });

  it("returns ROOM_NOT_FOUND for unknown slugs", async () => {
    const useCase = new GetRoomBySlug(new InMemoryRoomRepository());

    const result = await useCase.execute("missing");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("ROOM_NOT_FOUND");
  });
});
