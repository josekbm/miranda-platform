import type { PageMeta, Paginated } from "../../../shared/pagination";
import type { Booking } from "./Booking";
import type { BookingStatus } from "./BookingStatus";
import type { DateRange } from "./DateRange";

export type { PageMeta, Paginated };

export const BOOKING_SOURCES = ["WEBSITE", "PHONE", "WALK_IN", "ADMIN"] as const;

export type BookingSource = (typeof BOOKING_SOURCES)[number];

export interface BookableRoom {
  id: string;
  roomNumber: string;
  type: string;
  priceCents: number;
  discountPct: number;
  capacity: number;
  isActive: boolean;
}

export interface BookingQuery {
  page: number;
  pageSize: number;
  status?: BookingStatus | undefined;
  search?: string | undefined;
  from?: string | undefined;
  to?: string | undefined;
  sort?: "checkIn" | "createdAt" | "guestName" | undefined;
  order?: "asc" | "desc" | undefined;
}

export interface BookingRepository {
  findById(id: string): Promise<Booking | null>;
  findOverlapping(roomId: string, range: DateRange, excludeId?: string): Promise<Booking[]>;
  list(query: BookingQuery): Promise<Paginated<Booking>>;
  save(booking: Booking): Promise<void>;
  update(booking: Booking): Promise<void>;
}

export interface BookableRoomRepository {
  findById(id: string): Promise<BookableRoom | null>;
}

export interface BookingNotifier {
  bookingRequested(booking: Booking): Promise<void>;
  bookingConfirmed(booking: Booking): Promise<void>;
}

export interface BookingReferenceGenerator {
  next(): Promise<string>;
}

export type { Clock, IdGenerator, UnitOfWork } from "../../../shared/ports";
