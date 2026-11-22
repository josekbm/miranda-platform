import { InvalidDateRangeError } from "./errors";

const MS_PER_DAY = 86_400_000;
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function normalizeDate(value: string | Date): Date {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new InvalidDateRangeError();
    }

    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  if (!DATE_ONLY_PATTERN.test(value)) {
    throw new InvalidDateRangeError();
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || formatDateOnly(date) !== value) {
    throw new InvalidDateRangeError();
  }

  return date;
}

export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export class DateRange {
  private constructor(
    readonly checkIn: Date,
    readonly checkOut: Date,
  ) {}

  static from(checkIn: string | Date, checkOut: string | Date): DateRange {
    const start = normalizeDate(checkIn);
    const end = normalizeDate(checkOut);

    if (end.getTime() <= start.getTime()) {
      throw new InvalidDateRangeError();
    }

    return new DateRange(start, end);
  }

  static fromPrimitives(checkIn: string, checkOut: string): DateRange {
    return DateRange.from(checkIn, checkOut);
  }

  get nights(): number {
    return Math.round((this.checkOut.getTime() - this.checkIn.getTime()) / MS_PER_DAY);
  }

  overlaps(other: DateRange): boolean {
    return this.checkIn < other.checkOut && this.checkOut > other.checkIn;
  }

  contains(date: Date): boolean {
    const normalized = normalizeDate(date);
    return normalized >= this.checkIn && normalized < this.checkOut;
  }

  toPrimitives(): { checkIn: string; checkOut: string } {
    return {
      checkIn: formatDateOnly(this.checkIn),
      checkOut: formatDateOnly(this.checkOut),
    };
  }
}
