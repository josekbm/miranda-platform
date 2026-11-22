import type { PrismaClient } from "../../generated/prisma/client";
import type { Result } from "../../lib/result";
import { PrismaUnitOfWork } from "../../shared/infrastructure/PrismaUnitOfWork";
import { SystemClock } from "../../shared/infrastructure/SystemClock";
import { UuidGenerator } from "../../shared/infrastructure/UuidGenerator";
import { CreateBooking, type CreateBookingInput } from "./application/CreateBooking";
import { GetBooking } from "./application/GetBooking";
import { ListBookings } from "./application/ListBookings";
import { UpdateBookingStatus } from "./application/UpdateBookingStatus";
import type { Booking } from "./domain/Booking";
import type { BookingStatus } from "./domain/BookingStatus";
import type { BookingError } from "./domain/errors";
import type { BookingQuery, Paginated } from "./domain/ports";
import { NoopBookingNotifier } from "./infrastructure/NoopBookingNotifier";
import { PrismaBookableRoomRepository } from "./infrastructure/PrismaBookableRoomRepository";
import { PrismaBookingRepository } from "./infrastructure/PrismaBookingRepository";
import { RandomBookingReferenceGenerator } from "./infrastructure/RandomBookingReferenceGenerator";

export interface CreateBookingUseCase {
  execute(input: CreateBookingInput): Promise<Result<Booking, BookingError>>;
}

export interface ListBookingsUseCase {
  execute(query: BookingQuery): Promise<Paginated<Booking>>;
}

export interface GetBookingUseCase {
  execute(id: string): Promise<Result<Booking, BookingError>>;
}

export interface UpdateBookingStatusUseCase {
  execute(id: string, status: BookingStatus): Promise<Result<Booking, BookingError>>;
}

export interface BookingsContainer {
  createBooking: CreateBookingUseCase;
  listBookings: ListBookingsUseCase;
  getBooking: GetBookingUseCase;
  updateBookingStatus: UpdateBookingStatusUseCase;
}

export function buildBookingsContainer(prisma: PrismaClient): BookingsContainer {
  const bookings = new PrismaBookingRepository(prisma);
  const rooms = new PrismaBookableRoomRepository(prisma);
  const uow = new PrismaUnitOfWork(prisma);
  const clock = new SystemClock();
  const ids = new UuidGenerator();
  const references = new RandomBookingReferenceGenerator();
  const notifier = new NoopBookingNotifier();

  return {
    createBooking: new CreateBooking(bookings, rooms, uow, clock, ids, references, notifier),
    listBookings: new ListBookings(bookings),
    getBooking: new GetBooking(bookings),
    updateBookingStatus: new UpdateBookingStatus(bookings, clock, notifier),
  };
}
