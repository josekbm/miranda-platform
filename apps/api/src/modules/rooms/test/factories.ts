import { Room, type RoomProps } from "../domain/Room";

export const fixedNow = new Date("2026-11-21T10:00:00.000Z");
export const TEST_ROOM_ID = "00000000-0000-4000-8000-000000000010";

export function makeRoom(overrides: Partial<RoomProps> = {}): Room {
  return Room.reconstitute({
    id: TEST_ROOM_ID,
    reference: "R-2026-0001",
    slug: "suite-mar",
    roomNumber: "201",
    type: "SUITE",
    priceCents: 20_000,
    discountPct: 10,
    capacity: 2,
    sizeSqm: 40,
    isActive: true,
    translations: [
      {
        locale: "es",
        name: "Suite Mar",
        description: "Suite con vistas al mar.",
        cancellationPolicy: "Cancelación gratuita hasta 72 horas antes.",
      },
      {
        locale: "en",
        name: "Sea Suite",
        description: "Suite with sea views.",
        cancellationPolicy: "Free cancellation up to 72 hours before arrival.",
      },
    ],
    images: [
      {
        id: "00000000-0000-4000-8000-000000000020",
        url: "https://example.com/room.jpg",
        alt: "Suite",
        width: 1200,
        height: 800,
        sortOrder: 0,
      },
    ],
    amenities: [
      {
        key: "wifi",
        icon: "wifi",
        translations: [
          { locale: "es", name: "Wi-Fi" },
          { locale: "en", name: "Wi-Fi" },
        ],
      },
    ],
    createdAt: fixedNow,
    updatedAt: fixedNow,
    ...overrides,
  });
}
