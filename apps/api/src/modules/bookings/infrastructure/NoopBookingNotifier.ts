import type { Booking } from "../domain/Booking";
import type { BookingNotifier } from "../domain/ports";

export class NoopBookingNotifier implements BookingNotifier {
  async bookingRequested(_booking: Booking): Promise<void> {
    // TODO: enviar email de reserva recibida.
  }

  async bookingConfirmed(_booking: Booking): Promise<void> {
    // TODO: enviar email de reserva confirmada.
  }
}
