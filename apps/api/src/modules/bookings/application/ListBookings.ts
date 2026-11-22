import type { Booking } from "../domain/Booking";
import type { BookingQuery, BookingRepository, Paginated } from "../domain/ports";

export class ListBookings {
  constructor(private readonly bookings: BookingRepository) {}

  async execute(query: BookingQuery): Promise<Paginated<Booking>> {
    const page = Math.max(1, Math.trunc(query.page));
    const pageSize = Math.min(100, Math.max(1, Math.trunc(query.pageSize)));

    return this.bookings.list({ ...query, page, pageSize });
  }
}
