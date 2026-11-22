import { describe, expect, it } from "vitest";
import { makeRoom } from "../test/factories";
import { RoomValidationError } from "./errors";

describe("Room", () => {
  it("calculates the nightly rate with discount", () => {
    const room = makeRoom({ priceCents: 20_000, discountPct: 10 });

    expect(room.nightlyRateCents()).toBe(18_000);
  });

  it("resolves translations with Spanish fallback", () => {
    const room = makeRoom({
      translations: [
        {
          locale: "es",
          name: "Suite Mar",
          description: "Vistas al mar.",
          cancellationPolicy: "Cancelación gratuita.",
        },
      ],
    });

    expect(room.translation("en")?.name).toBe("Suite Mar");
  });

  it("resolves amenity names with fallback to the key", () => {
    const room = makeRoom();

    expect(room.amenityName("wifi", "en")).toBe("Wi-Fi");
    expect(room.amenityName("pool", "es")).toBeNull();
  });

  it("knows whether it is bookable", () => {
    expect(makeRoom().isBookable()).toBe(true);
    expect(makeRoom({ isActive: false }).isBookable()).toBe(false);
  });

  it("rejects invalid rooms", () => {
    expect(() => makeRoom({ priceCents: -1 })).toThrow(RoomValidationError);
    expect(() => makeRoom({ discountPct: 120 })).toThrow(RoomValidationError);
    expect(() => makeRoom({ capacity: 0 })).toThrow(RoomValidationError);
    expect(() => makeRoom({ type: "PENTHOUSE" as never })).toThrow(RoomValidationError);
    expect(() => makeRoom({ translations: [] })).toThrow(RoomValidationError);
    expect(() => makeRoom({ roomNumber: "  " })).toThrow(RoomValidationError);
  });
});
