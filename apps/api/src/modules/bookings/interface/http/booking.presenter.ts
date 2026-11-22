import type { Booking as BookingDto } from "@miranda/contract";
import type { Booking } from "../../domain/Booking";

export function toBookingDto(booking: Booking): BookingDto {
  const range = booking.range.toPrimitives();

  return {
    id: booking.id,
    reference: booking.reference,
    roomId: booking.roomId,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    checkIn: range.checkIn,
    checkOut: range.checkOut,
    status: booking.status,
    totalCents: booking.totalCents,
    specialRequests: booking.specialRequests,
    source: booking.source,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
  };
}
