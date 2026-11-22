import type { BookingStatus } from "./BookingStatus";

export type BookingErrorCode =
  | "INVALID_DATE_RANGE"
  | "INVALID_STATUS_TRANSITION"
  | "BOOKING_VALIDATION"
  | "ROOM_NOT_FOUND"
  | "ROOM_NOT_AVAILABLE"
  | "BOOKING_NOT_FOUND";

export class BookingError extends Error {
  constructor(
    public readonly code: BookingErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "BookingError";
  }
}

export class InvalidDateRangeError extends BookingError {
  constructor() {
    super("INVALID_DATE_RANGE", "Check-out must be after check-in.");
    this.name = "InvalidDateRangeError";
  }
}

export class InvalidStatusTransitionError extends BookingError {
  constructor(from: BookingStatus, to: BookingStatus) {
    super("INVALID_STATUS_TRANSITION", `Cannot transition from ${from} to ${to}.`);
    this.name = "InvalidStatusTransitionError";
  }
}

export class BookingValidationError extends BookingError {
  constructor(message: string) {
    super("BOOKING_VALIDATION", message);
    this.name = "BookingValidationError";
  }
}

export class RoomNotFoundError extends BookingError {
  constructor(roomId: string) {
    super("ROOM_NOT_FOUND", `Room ${roomId} was not found.`);
    this.name = "RoomNotFoundError";
  }
}

export class RoomNotAvailableError extends BookingError {
  constructor(roomId: string) {
    super("ROOM_NOT_AVAILABLE", `Room ${roomId} is not available for the selected dates.`);
    this.name = "RoomNotAvailableError";
  }
}

export class BookingNotFoundError extends BookingError {
  constructor(id: string) {
    super("BOOKING_NOT_FOUND", `Booking ${id} was not found.`);
    this.name = "BookingNotFoundError";
  }
}
