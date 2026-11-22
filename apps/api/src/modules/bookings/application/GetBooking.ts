import { err, ok, type Result } from "../../../lib/result";
import type { Booking } from "../domain/Booking";
import { type BookingError, BookingNotFoundError } from "../domain/errors";
import type { BookingRepository } from "../domain/ports";

export class GetBooking {
  constructor(private readonly bookings: BookingRepository) {}

  async execute(id: string): Promise<Result<Booking, BookingError>> {
    const booking = await this.bookings.findById(id);

    if (!booking) {
      return err(new BookingNotFoundError(id));
    }

    return ok(booking);
  }
}
