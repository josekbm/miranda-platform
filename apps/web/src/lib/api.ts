import type { Room as ApiRoom } from "@miranda/contract";
import { rooms as fallbackRooms, type RoomData } from "../data/rooms";
import type { Locale } from "../i18n/ui";

const apiBase = import.meta.env.PUBLIC_API_INTERNAL_URL ?? "http://localhost:3000";

function translation(room: ApiRoom, locale: Locale) {
  return (
    room.translations.find((item) => item.locale === locale) ??
    room.translations.find((item) => item.locale === "es") ??
    room.translations[0]
  );
}

function toRoomData(room: ApiRoom): RoomData {
  const es = translation(room, "es");
  const en = translation(room, "en");

  if (!es || !en) {
    throw new Error(`Room ${room.slug} has no translations`);
  }

  return {
    id: room.id,
    slug: room.slug,
    reference: room.reference,
    roomNumber: room.roomNumber,
    type: room.type,
    priceCents: room.priceCents,
    discountPct: room.discountPct,
    capacity: room.capacity,
    sizeSqm: room.sizeSqm ?? 0,
    amenityKeys: room.amenities.map((amenity) => amenity.key),
    images: room.images.map((image) => ({
      url: image.url,
      altEs: image.alt ?? es.name,
      altEn: image.alt ?? en.name,
    })),
    translations: {
      es: {
        name: es.name,
        description: es.description,
        cancellation: es.cancellationPolicy,
      },
      en: {
        name: en.name,
        description: en.description,
        cancellation: en.cancellationPolicy,
      },
    },
  };
}

export async function fetchPublicRooms(locale: Locale): Promise<RoomData[]> {
  try {
    const response = await fetch(`${apiBase}/api/v1/public/rooms?locale=${locale}&pageSize=100`, {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }

    const body = (await response.json()) as { data: ApiRoom[] };
    return body.data.map(toRoomData);
  } catch {
    return fallbackRooms;
  }
}

export async function fetchPublicRoom(locale: Locale, slug: string): Promise<RoomData | null> {
  try {
    const response = await fetch(
      `${apiBase}/api/v1/public/rooms/${encodeURIComponent(slug)}?locale=${locale}`,
      {
        headers: { accept: "application/json" },
      },
    );

    if (!response.ok) {
      return null;
    }

    const body = (await response.json()) as { data: ApiRoom };
    return toRoomData(body.data);
  } catch {
    return fallbackRooms.find((room) => room.slug === slug) ?? null;
  }
}
