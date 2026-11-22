import { describe, expect, it } from "vitest";
import { assertTransition, canTransition } from "./BookingStatus";
import { InvalidStatusTransitionError } from "./errors";

describe("BookingStatus", () => {
  it("allows the happy path", () => {
    expect(canTransition("PENDING", "CONFIRMED")).toBe(true);
    expect(canTransition("CONFIRMED", "CHECKED_IN")).toBe(true);
    expect(canTransition("CHECKED_IN", "CHECKED_OUT")).toBe(true);
  });

  it("allows cancellation from pending and confirmed", () => {
    expect(canTransition("PENDING", "CANCELLED")).toBe(true);
    expect(canTransition("CONFIRMED", "CANCELLED")).toBe(true);
  });

  it("does not allow transitions from terminal states", () => {
    expect(canTransition("CHECKED_OUT", "CONFIRMED")).toBe(false);
    expect(canTransition("CANCELLED", "CONFIRMED")).toBe(false);
    expect(canTransition("NO_SHOW", "CHECKED_IN")).toBe(false);
  });

  it("throws a domain error for invalid transitions", () => {
    expect(() => assertTransition("PENDING", "CHECKED_IN")).toThrow(InvalidStatusTransitionError);
  });
});
