import { randomBytes } from "node:crypto";
import type { BookingReferenceGenerator } from "../domain/ports";

export class RandomBookingReferenceGenerator implements BookingReferenceGenerator {
  async next(): Promise<string> {
    const year = new Date().getUTCFullYear();
    const suffix = randomBytes(3).toString("hex").toUpperCase();
    return `B-${year}-${suffix}`;
  }
}
