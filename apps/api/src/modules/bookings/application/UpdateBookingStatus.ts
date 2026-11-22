import { err, ok, type Result } from "../../../lib/result";
import type { Booking } from "../domain/Booking";
import type { BookingStatus } from "../domain/BookingStatus";
import { BookingError, BookingNotFoundError, InvalidStatusTransitionError } from "../domain/errors";
import type { BookingNotifier, BookingRepository, Clock } from "../domain/ports";

export class UpdateBookingStatus {
  constructor(
    private readonly bookings: BookingRepository,
    private readonly clock: Clock,
    private readonly notifier: BookingNotifier,
  ) {}

  async execute(id: string, status: BookingStatus): Promise<Result<Booking, BookingError>> {
    const booking = await this.bookings.findById(id);

    if (!booking) {
      return err(new BookingNotFoundError(id));
    }

    try {
      const now = this.clock.now();

      switch (status) {
        case "CONFIRMED":
          booking.confirm(now);
          break;
        case "CHECKED_IN":
          booking.checkIn(now);
          break;
        case "CHECKED_OUT":
          booking.checkOut(now);
          break;
        case "CANCELLED":
          booking.cancel(now);
          break;
        case "NO_SHOW":
          booking.markNoShow(now);
          break;
        default:
          return err(new InvalidStatusTransitionError(booking.status, status));
      }
    } catch (error) {
      if (error instanceof BookingError) {
        return err(error);
      }

      throw error;
    }

    await this.bookings.update(booking);

    if (status === "CONFIRMED") {
      await this.notifier.bookingConfirmed(booking);
    }

    return ok(booking);
  }
}
