import { z } from "zod";

export const bookingStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
  "NO_SHOW",
]);
export type BookingStatus = z.infer<typeof bookingStatusSchema>;

export const bookingSourceSchema = z.enum(["WEBSITE", "PHONE", "WALK_IN", "ADMIN"]);
export type BookingSource = z.infer<typeof bookingSourceSchema>;

export const dateOnlySchema = z.iso.date();
export type DateOnly = z.infer<typeof dateOnlySchema>;

export const createBookingInputSchema = z.object({
  roomId: z.string().uuid(),
  guestName: z.string().min(2).max(120),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(5).max(30),
  checkIn: dateOnlySchema,
  checkOut: dateOnlySchema,
  guests: z.number().int().min(1).max(10).optional(),
  specialRequests: z.string().max(1000).optional(),
  source: bookingSourceSchema.optional(),
});
export type CreateBookingInput = z.infer<typeof createBookingInputSchema>;

export const bookingSchema = z.object({
  id: z.string().uuid(),
  reference: z.string().min(1),
  roomId: z.string().uuid(),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(1),
  checkIn: dateOnlySchema,
  checkOut: dateOnlySchema,
  status: bookingStatusSchema,
  totalCents: z.number().int().nonnegative(),
  specialRequests: z.string().nullable(),
  source: bookingSourceSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type Booking = z.infer<typeof bookingSchema>;

export const bookingListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: bookingStatusSchema.optional(),
  search: z.string().trim().max(120).optional(),
  from: dateOnlySchema.optional(),
  to: dateOnlySchema.optional(),
  sort: z.enum(["checkIn", "createdAt", "guestName"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});
export type BookingListQuery = z.infer<typeof bookingListQuerySchema>;

export const pageMetaSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
export type PageMeta = z.infer<typeof pageMetaSchema>;

export const paginatedBookingsSchema = z.object({
  data: z.array(bookingSchema),
  meta: pageMetaSchema,
});
export type PaginatedBookings = z.infer<typeof paginatedBookingsSchema>;

export const bookingResponseSchema = z.object({
  data: bookingSchema,
});
export type BookingResponse = z.infer<typeof bookingResponseSchema>;

export const updateBookingStatusInputSchema = z.object({
  status: bookingStatusSchema,
});
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusInputSchema>;
