import { z } from "zod";
import { pageMetaSchema } from "./bookings";

export const roomTypeSchema = z.enum(["SINGLE", "DOUBLE", "DOUBLE_SUPERIOR", "SUITE"]);
export type RoomType = z.infer<typeof roomTypeSchema>;

export const roomLocaleSchema = z.enum(["es", "en"]);
export type RoomLocale = z.infer<typeof roomLocaleSchema>;

export const roomTranslationSchema = z.object({
  locale: roomLocaleSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  cancellationPolicy: z.string().min(1),
});
export type RoomTranslation = z.infer<typeof roomTranslationSchema>;

export const roomImageSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  alt: z.string().nullable(),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  sortOrder: z.number().int().nonnegative(),
});
export type RoomImage = z.infer<typeof roomImageSchema>;

export const amenitySchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().nullable(),
});
export type Amenity = z.infer<typeof amenitySchema>;

export const roomSchema = z.object({
  id: z.string().uuid(),
  reference: z.string().min(1),
  slug: z.string().min(1),
  roomNumber: z.string().min(1),
  type: roomTypeSchema,
  priceCents: z.number().int().nonnegative(),
  discountPct: z.number().int().min(0).max(100),
  capacity: z.number().int().positive(),
  sizeSqm: z.number().int().positive().nullable(),
  isActive: z.boolean(),
  translations: z.array(roomTranslationSchema),
  images: z.array(roomImageSchema),
  amenities: z.array(amenitySchema),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type Room = z.infer<typeof roomSchema>;

export const roomListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  type: roomTypeSchema.optional(),
  search: z.string().trim().max(120).optional(),
  active: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === "true")),
  locale: roomLocaleSchema.default("es"),
});
export type RoomListQuery = z.infer<typeof roomListQuerySchema>;

export const roomLocaleQuerySchema = z.object({
  locale: roomLocaleSchema.default("es"),
});
export type RoomLocaleQuery = z.infer<typeof roomLocaleQuerySchema>;

export const paginatedRoomsSchema = z.object({
  data: z.array(roomSchema),
  meta: pageMetaSchema,
});
export type PaginatedRooms = z.infer<typeof paginatedRoomsSchema>;

export const roomResponseSchema = z.object({
  data: roomSchema,
});
export type RoomResponse = z.infer<typeof roomResponseSchema>;
