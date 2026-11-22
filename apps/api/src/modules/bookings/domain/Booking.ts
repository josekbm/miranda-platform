import { assertTransition, type BookingStatus } from "./BookingStatus";
import { DateRange } from "./DateRange";
import { BookingValidationError } from "./errors";
import type { BookingSource } from "./ports";

export interface BookingProps {
  id: string;
  reference: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  range: DateRange;
  status: BookingStatus;
  totalCents: number;
  specialRequests: string | null;
  source: BookingSource;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingProps {
  id: string;
  reference: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  range: DateRange;
  totalCents: number;
  specialRequests: string | null;
  source: BookingSource;
  now: Date;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireNonEmpty(value: string, field: string): string {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new BookingValidationError(`${field} is required.`);
  }

  return trimmed;
}

function requireValidEmail(value: string): string {
  const email = requireNonEmpty(value, "Guest email").toLowerCase();

  if (!EMAIL_PATTERN.test(email)) {
    throw new BookingValidationError("Guest email is not valid.");
  }

  return email;
}

function requireValidCents(value: number): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new BookingValidationError("Total amount must be a non-negative integer.");
  }

  return value;
}

export class Booking {
  private props: BookingProps;

  private constructor(props: BookingProps) {
    this.props = props;
  }

  static create(input: CreateBookingProps): Booking {
    const guestName = requireNonEmpty(input.guestName, "Guest name");
    const guestEmail = requireValidEmail(input.guestEmail);
    const guestPhone = requireNonEmpty(input.guestPhone, "Guest phone");
    const reference = requireNonEmpty(input.reference, "Booking reference");
    const id = requireNonEmpty(input.id, "Booking id");
    const totalCents = requireValidCents(input.totalCents);

    return new Booking({
      id,
      reference,
      roomId: requireNonEmpty(input.roomId, "Room id"),
      guestName,
      guestEmail,
      guestPhone,
      range: input.range,
      status: "PENDING",
      totalCents,
      specialRequests: input.specialRequests?.trim() || null,
      source: input.source,
      createdAt: input.now,
      updatedAt: input.now,
    });
  }

  static reconstitute(props: BookingProps): Booking {
    return new Booking({
      ...props,
      guestName: requireNonEmpty(props.guestName, "Guest name"),
      guestEmail: requireValidEmail(props.guestEmail),
      guestPhone: requireNonEmpty(props.guestPhone, "Guest phone"),
      reference: requireNonEmpty(props.reference, "Booking reference"),
      id: requireNonEmpty(props.id, "Booking id"),
      roomId: requireNonEmpty(props.roomId, "Room id"),
      totalCents: requireValidCents(props.totalCents),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get reference(): string {
    return this.props.reference;
  }

  get roomId(): string {
    return this.props.roomId;
  }

  get guestName(): string {
    return this.props.guestName;
  }

  get guestEmail(): string {
    return this.props.guestEmail;
  }

  get guestPhone(): string {
    return this.props.guestPhone;
  }

  get range(): DateRange {
    return this.props.range;
  }

  get status(): BookingStatus {
    return this.props.status;
  }

  get totalCents(): number {
    return this.props.totalCents;
  }

  get specialRequests(): string | null {
    return this.props.specialRequests;
  }

  get source(): BookingSource {
    return this.props.source;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  confirm(now: Date): void {
    this.transition("CONFIRMED", now);
  }

  checkIn(now: Date): void {
    this.transition("CHECKED_IN", now);
  }

  checkOut(now: Date): void {
    this.transition("CHECKED_OUT", now);
  }

  cancel(now: Date): void {
    this.transition("CANCELLED", now);
  }

  markNoShow(now: Date): void {
    this.transition("NO_SHOW", now);
  }

  private transition(to: BookingStatus, now: Date): void {
    assertTransition(this.props.status, to);
    this.props.status = to;
    this.props.updatedAt = now;
  }

  toPrimitives(): BookingProps {
    return {
      ...this.props,
      range: DateRange.fromPrimitives(
        this.props.range.toPrimitives().checkIn,
        this.props.range.toPrimitives().checkOut,
      ),
    };
  }
}
