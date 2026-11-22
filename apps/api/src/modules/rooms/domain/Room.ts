import { RoomValidationError } from "./errors";

export const ROOM_TYPES = ["SINGLE", "DOUBLE", "DOUBLE_SUPERIOR", "SUITE"] as const;
export type RoomType = (typeof ROOM_TYPES)[number];

export const ROOM_LOCALES = ["es", "en"] as const;
export type RoomLocale = (typeof ROOM_LOCALES)[number];

export interface RoomTranslationProps {
  locale: RoomLocale;
  name: string;
  description: string;
  cancellationPolicy: string;
}

export interface RoomImageProps {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  sortOrder: number;
}

export interface AmenityTranslationProps {
  locale: RoomLocale;
  name: string;
}

export interface AmenityProps {
  key: string;
  icon: string | null;
  translations: readonly AmenityTranslationProps[];
}

export interface RoomProps {
  id: string;
  reference: string;
  slug: string;
  roomNumber: string;
  type: RoomType;
  priceCents: number;
  discountPct: number;
  capacity: number;
  sizeSqm: number | null;
  isActive: boolean;
  translations: readonly RoomTranslationProps[];
  images: readonly RoomImageProps[];
  amenities: readonly AmenityProps[];
  createdAt: Date;
  updatedAt: Date;
}

function requireNonEmpty(value: string, field: string): string {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new RoomValidationError(`${field} is required.`);
  }

  return trimmed;
}

function requireValidType(value: string): RoomType {
  if (!(ROOM_TYPES as readonly string[]).includes(value)) {
    throw new RoomValidationError(`Room type ${value} is not valid.`);
  }

  return value as RoomType;
}

function requireValidCents(value: number): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new RoomValidationError("Price must be a non-negative integer in cents.");
  }

  return value;
}

function requireValidDiscount(value: number): number {
  if (!Number.isInteger(value) || value < 0 || value > 100) {
    throw new RoomValidationError("Discount must be an integer between 0 and 100.");
  }

  return value;
}

function requireValidCapacity(value: number): number {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RoomValidationError("Capacity must be a positive integer.");
  }

  return value;
}

function validateTranslations(translations: readonly RoomTranslationProps[]): void {
  if (translations.length === 0) {
    throw new RoomValidationError("A room needs at least one translation.");
  }

  const locales = new Set<RoomLocale>();

  for (const translation of translations) {
    if (locales.has(translation.locale)) {
      throw new RoomValidationError(`Duplicate translation for locale ${translation.locale}.`);
    }

    locales.add(translation.locale);
    requireNonEmpty(translation.name, "Room translation name");
    requireNonEmpty(translation.description, "Room translation description");
    requireNonEmpty(translation.cancellationPolicy, "Cancellation policy");
  }
}

function validateImages(images: readonly RoomImageProps[]): void {
  for (const image of images) {
    requireNonEmpty(image.url, "Room image URL");
  }
}

function validateAmenities(amenities: readonly AmenityProps[]): void {
  for (const amenity of amenities) {
    requireNonEmpty(amenity.key, "Amenity key");

    for (const translation of amenity.translations) {
      requireNonEmpty(translation.name, "Amenity translation name");
    }
  }
}

export class Room {
  private constructor(private readonly props: RoomProps) {}

  static reconstitute(props: RoomProps): Room {
    validateTranslations(props.translations);
    validateImages(props.images);
    validateAmenities(props.amenities);

    return new Room({
      ...props,
      id: requireNonEmpty(props.id, "Room id"),
      reference: requireNonEmpty(props.reference, "Room reference"),
      slug: requireNonEmpty(props.slug, "Room slug"),
      roomNumber: requireNonEmpty(props.roomNumber, "Room number"),
      type: requireValidType(props.type),
      priceCents: requireValidCents(props.priceCents),
      discountPct: requireValidDiscount(props.discountPct),
      capacity: requireValidCapacity(props.capacity),
      sizeSqm:
        props.sizeSqm === null
          ? null
          : (() => {
              if (!Number.isInteger(props.sizeSqm) || props.sizeSqm <= 0) {
                throw new RoomValidationError("Size must be a positive integer or null.");
              }

              return props.sizeSqm;
            })(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get reference(): string {
    return this.props.reference;
  }

  get slug(): string {
    return this.props.slug;
  }

  get roomNumber(): string {
    return this.props.roomNumber;
  }

  get type(): RoomType {
    return this.props.type;
  }

  get priceCents(): number {
    return this.props.priceCents;
  }

  get discountPct(): number {
    return this.props.discountPct;
  }

  get capacity(): number {
    return this.props.capacity;
  }

  get sizeSqm(): number | null {
    return this.props.sizeSqm;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get translations(): readonly RoomTranslationProps[] {
    return this.props.translations;
  }

  get images(): readonly RoomImageProps[] {
    return this.props.images;
  }

  get amenities(): readonly AmenityProps[] {
    return this.props.amenities;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  translation(locale: RoomLocale): RoomTranslationProps | null {
    return (
      this.props.translations.find((translation) => translation.locale === locale) ??
      this.props.translations.find((translation) => translation.locale === "es") ??
      this.props.translations[0] ??
      null
    );
  }

  amenityName(key: string, locale: RoomLocale): string | null {
    const amenity = this.props.amenities.find((item) => item.key === key);

    if (!amenity) {
      return null;
    }

    return (
      amenity.translations.find((translation) => translation.locale === locale)?.name ??
      amenity.translations.find((translation) => translation.locale === "es")?.name ??
      amenity.key
    );
  }

  nightlyRateCents(): number {
    return Math.round(this.props.priceCents * (1 - this.props.discountPct / 100));
  }

  isBookable(): boolean {
    return this.props.isActive && this.props.capacity > 0;
  }

  toPrimitives(): RoomProps {
    return { ...this.props };
  }
}
