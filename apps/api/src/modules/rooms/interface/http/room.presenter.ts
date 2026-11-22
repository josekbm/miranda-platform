import type { Room as RoomDto } from "@miranda/contract";
import type { Room, RoomLocale } from "../../domain/Room";

export function toRoomDto(room: Room, locale: RoomLocale): RoomDto {
  return {
    id: room.id,
    reference: room.reference,
    slug: room.slug,
    roomNumber: room.roomNumber,
    type: room.type,
    priceCents: room.priceCents,
    discountPct: room.discountPct,
    capacity: room.capacity,
    sizeSqm: room.sizeSqm,
    isActive: room.isActive,
    translations: room.translations.map((translation) => ({
      locale: translation.locale,
      name: translation.name,
      description: translation.description,
      cancellationPolicy: translation.cancellationPolicy,
    })),
    images: room.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      width: image.width,
      height: image.height,
      sortOrder: image.sortOrder,
    })),
    amenities: room.amenities.map((amenity) => ({
      key: amenity.key,
      name: room.amenityName(amenity.key, locale) ?? amenity.key,
      icon: amenity.icon,
    })),
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
  };
}
