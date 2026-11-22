import { err, ok, type Result } from "../../../lib/result";
import { Booking } from "../domain/Booking";
import { DateRange } from "../domain/DateRange";
import {
  BookingError,
  BookingValidationError,
  RoomNotAvailableError,
  RoomNotFoundError,
} from "../domain/errors";
import type {
  BookableRoomRepository,
  BookingNotifier,
  BookingReferenceGenerator,
  BookingRepository,
  BookingSource,
  Clock,
  IdGenerator,
  UnitOfWork,
} from "../domain/ports";
import { calculateTotalCents } from "../domain/pricing";

export interface CreateBookingInput {
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests?: number | undefined;
  specialRequests?: string | undefined;
  source?: BookingSource | undefined;
}

export class CreateBooking {
  constructor(
    private readonly bookings: BookingRepository,
    private readonly rooms: BookableRoomRepository,
    private readonly uow: UnitOfWork,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly references: BookingReferenceGenerator,
    private readonly notifier: BookingNotifier,
  ) {}

  async execute(input: CreateBookingInput): Promise<Result<Booking, BookingError>> {
    try {
      const room = await this.rooms.findById(input.roomId);

      if (!room?.isActive) {
        return err(new RoomNotFoundError(input.roomId));
      }

      if (input.guests !== undefined && input.guests > room.capacity) {
        return err(
          new BookingValidationError(
            `Room ${room.roomNumber} has capacity for ${room.capacity} guests.`,
          ),
        );
      }

      const range = DateRange.from(input.checkIn, input.checkOut);
      const totalCents = calculateTotalCents(room, range);
      const booking = Booking.create({
        id: this.ids.uuid(),
        reference: await this.references.next(),
        roomId: room.id,
        guestName: input.guestName,
        guestEmail: input.guestEmail,
        guestPhone: input.guestPhone,
        range,
        totalCents,
        specialRequests: input.specialRequests?.trim() || null,
        source: input.source ?? "WEBSITE",
        now: this.clock.now(),
      });

      const result = await this.uow.transaction(async () => {
        const overlapping = await this.bookings.findOverlapping(room.id, range);

        if (overlapping.length > 0) {
          return err(new RoomNotAvailableError(room.id));
        }

        await this.bookings.save(booking);
        return ok(booking);
      });

      if (result.ok) {
        await this.notifier.bookingRequested(result.value);
      }

      return result;
    } catch (error) {
      if (error instanceof BookingError) {
        return err(error);
      }

      throw error;
    }
  }
}
