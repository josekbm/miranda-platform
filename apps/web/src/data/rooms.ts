import type { Locale } from "../i18n/ui";

export type RoomType = "SINGLE" | "DOUBLE" | "DOUBLE_SUPERIOR" | "SUITE";

export interface Amenity {
  key: string;
  icon: string;
  labelEs: string;
  labelEn: string;
}

export interface RoomData {
  id: string;
  slug: string;
  reference: string;
  roomNumber: string;
  type: RoomType;
  priceCents: number;
  discountPct: number;
  capacity: number;
  sizeSqm: number;
  amenityKeys: string[];
  images: { url: string; altEs: string; altEn: string }[];
  translations: {
    es: { name: string; description: string; cancellation: string };
    en: { name: string; description: string; cancellation: string };
  };
}

export const amenities: Amenity[] = [
  { key: "wifi", icon: "wifi", labelEs: "Wi-Fi", labelEn: "Wi-Fi" },
  { key: "tv", icon: "tv", labelEs: "Televisión", labelEn: "TV" },
  {
    key: "air-conditioning",
    icon: "air-vent",
    labelEs: "Aire acondicionado",
    labelEn: "Air conditioning",
  },
  { key: "minibar", icon: "wine", labelEs: "Minibar", labelEn: "Minibar" },
  { key: "safe", icon: "shield", labelEs: "Caja fuerte", labelEn: "Safe" },
  { key: "bathtub", icon: "bath", labelEs: "Bañera", labelEn: "Bathtub" },
  { key: "kitchen", icon: "chef-hat", labelEs: "Cocina", labelEn: "Kitchen" },
  { key: "parking", icon: "car", labelEs: "Parking", labelEn: "Parking" },
];

export const rooms: RoomData[] = [
  {
    id: "c0000000-0000-4000-8000-000000000001",
    slug: "single-bed-101",
    reference: "R-2026-0001",
    roomNumber: "101",
    type: "SINGLE",
    priceCents: 8_000,
    discountPct: 0,
    capacity: 1,
    sizeSqm: 18,
    amenityKeys: ["wifi", "tv", "air-conditioning"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1505693314120-0d443867891c",
        altEs: "Habitación individual con cama y luz natural",
        altEn: "Single room with bed and natural light",
      },
      {
        url: "https://images.unsplash.com/photo-1604709177225-055f99402ea3",
        altEs: "Detalle de la habitación individual",
        altEn: "Single room detail",
      },
      {
        url: "https://images.unsplash.com/photo-1486946255434-2466348c2166",
        altEs: "Baño de la habitación individual",
        altEn: "Single room bathroom",
      },
    ],
    translations: {
      es: {
        name: "Habitación Single 101",
        description:
          "Una habitación luminosa con cama individual, escritorio y vistas a la ciudad. Perfecta para una escapada corta o un viaje de trabajo.",
        cancellation: "Cancelación gratuita hasta 24 horas antes de la llegada.",
      },
      en: {
        name: "Single Room 101",
        description:
          "A bright room with a single bed, desk and city views. Perfect for a short escape or a work trip.",
        cancellation: "Free cancellation up to 24 hours before arrival.",
      },
    },
  },
  {
    id: "c0000000-0000-4000-8000-000000000002",
    slug: "double-bed-102",
    reference: "R-2026-0002",
    roomNumber: "102",
    type: "DOUBLE",
    priceCents: 12_000,
    discountPct: 10,
    capacity: 2,
    sizeSqm: 25,
    amenityKeys: ["wifi", "tv", "air-conditioning", "safe"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1540518614846-7eded433c457",
        altEs: "Habitación doble con cama de matrimonio",
        altEn: "Double room with a double bed",
      },
      {
        url: "https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32",
        altEs: "Balcón de la habitación doble",
        altEn: "Double room balcony",
      },
      {
        url: "https://images.unsplash.com/photo-1618220179428-22790b461013",
        altEs: "Zona de descanso de la habitación doble",
        altEn: "Double room seating area",
      },
    ],
    translations: {
      es: {
        name: "Habitación Doble 102",
        description:
          "Una habitación amplia con cama de matrimonio, balcón y una pequeña zona de estar. Ideal para parejas que quieren quedarse un rato más.",
        cancellation: "Cancelación gratuita hasta 48 horas antes de la llegada.",
      },
      en: {
        name: "Double Room 102",
        description:
          "A spacious room with a double bed, balcony and a small seating area. Ideal for couples who want to stay a little longer.",
        cancellation: "Free cancellation up to 48 hours before arrival.",
      },
    },
  },
  {
    id: "c0000000-0000-4000-8000-000000000003",
    slug: "double-superior-201",
    reference: "R-2026-0003",
    roomNumber: "201",
    type: "DOUBLE_SUPERIOR",
    priceCents: 18_000,
    discountPct: 15,
    capacity: 2,
    sizeSqm: 32,
    amenityKeys: ["wifi", "tv", "air-conditioning", "minibar", "safe"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8",
        altEs: "Habitación doble superior con salón",
        altEn: "Double superior room with lounge",
      },
      {
        url: "https://images.unsplash.com/photo-1629079447777-1e605162dc8d",
        altEs: "Detalle del salón de la doble superior",
        altEn: "Double superior lounge detail",
      },
      {
        url: "https://images.unsplash.com/photo-1618220179428-22790b461013",
        altEs: "Zona de descanso de la doble superior",
        altEn: "Double superior seating area",
      },
    ],
    translations: {
      es: {
        name: "Doble Superior 201",
        description:
          "Más espacio, un salón pequeño, minibar y vistas al jardín. La opción intermedia perfecta para una estancia de varios días.",
        cancellation: "Cancelación gratuita hasta 72 horas antes de la llegada.",
      },
      en: {
        name: "Double Superior 201",
        description:
          "More space, a small lounge, minibar and garden views. The perfect middle option for a multi-day stay.",
        cancellation: "Free cancellation up to 72 hours before arrival.",
      },
    },
  },
  {
    id: "c0000000-0000-4000-8000-000000000004",
    slug: "suite-301",
    reference: "R-2026-0004",
    roomNumber: "301",
    type: "SUITE",
    priceCents: 25_000,
    discountPct: 20,
    capacity: 3,
    sizeSqm: 45,
    amenityKeys: [
      "wifi",
      "tv",
      "air-conditioning",
      "minibar",
      "safe",
      "bathtub",
      "kitchen",
      "parking",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        altEs: "Suite con cama grande y terraza",
        altEn: "Suite with large bed and terrace",
      },
      {
        url: "https://images.unsplash.com/photo-1609946860441-a51ffcf22208",
        altEs: "Terraza privada de la suite",
        altEn: "Suite private terrace",
      },
      {
        url: "https://images.unsplash.com/photo-1564078516393-cf04bd966897",
        altEs: "Baño de la suite con bañera",
        altEn: "Suite bathroom with bathtub",
      },
    ],
    translations: {
      es: {
        name: "Suite 301",
        description:
          "La habitación más especial: terraza privada, cocina, bañera y vistas al mar. Para quedarse, celebrar o no hacer nada durante días.",
        cancellation: "Cancelación gratuita hasta una semana antes de la llegada.",
      },
      en: {
        name: "Suite 301",
        description:
          "The most special room: private terrace, kitchen, bathtub and sea views. For staying, celebrating or doing nothing for days.",
        cancellation: "Free cancellation up to one week before arrival.",
      },
    },
  },
];

export function getRoomBySlug(slug: string): RoomData | undefined {
  return rooms.find((room) => room.slug === slug);
}

export function getRelatedRooms(room: RoomData, limit = 3): RoomData[] {
  return rooms.filter((item) => item.id !== room.id).slice(0, limit);
}

export function roomName(room: RoomData, locale: Locale): string {
  return room.translations[locale].name;
}

export function roomDescription(room: RoomData, locale: Locale): string {
  return room.translations[locale].description;
}

export function roomCancellation(room: RoomData, locale: Locale): string {
  return room.translations[locale].cancellation;
}

export function roomTypeLabel(type: RoomType, locale: Locale): string {
  const labels: Record<RoomType, { es: string; en: string }> = {
    SINGLE: { es: "Individual", en: "Single" },
    DOUBLE: { es: "Doble", en: "Double" },
    DOUBLE_SUPERIOR: { es: "Doble Superior", en: "Double Superior" },
    SUITE: { es: "Suite", en: "Suite" },
  };

  return labels[type][locale];
}

export function nightlyRateCents(room: Pick<RoomData, "priceCents" | "discountPct">): number {
  return Math.round(room.priceCents * (1 - room.discountPct / 100));
}

export function formatPrice(cents: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function amenityByKey(key: string): Amenity | undefined {
  return amenities.find((amenity) => amenity.key === key);
}

export function amenityLabel(key: string, locale: Locale): string {
  const amenity = amenityByKey(key);

  if (!amenity) {
    return key;
  }

  return locale === "es" ? amenity.labelEs : amenity.labelEn;
}

export function roomAmenities(room: RoomData): Amenity[] {
  return room.amenityKeys
    .map((key) => amenityByKey(key))
    .filter((amenity): amenity is Amenity => amenity !== undefined);
}
