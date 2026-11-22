import type { BookingStatus } from "./status";

export interface AdminBooking {
  id: string;
  reference: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  roomName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  totalCents: number;
  specialRequests: string | null;
  source: "WEBSITE" | "PHONE" | "WALK_IN" | "ADMIN";
  createdAt: string;
}

export interface BookingFilters {
  status?: BookingStatus | "ALL";
  search?: string;
}
