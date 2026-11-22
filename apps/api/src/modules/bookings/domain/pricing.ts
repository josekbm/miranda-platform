import type { DateRange } from "./DateRange";
import type { BookableRoom } from "./ports";

export function nightlyRateCents(room: Pick<BookableRoom, "priceCents" | "discountPct">): number {
  const discount = Math.min(Math.max(room.discountPct, 0), 100);
  return Math.round(room.priceCents * (1 - discount / 100));
}

export function calculateTotalCents(
  room: Pick<BookableRoom, "priceCents" | "discountPct">,
  range: DateRange,
): number {
  return nightlyRateCents(room) * range.nights;
}
