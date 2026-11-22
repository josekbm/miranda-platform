import { describe, expect, it } from "vitest";
import { DateRange } from "./DateRange";
import { InvalidDateRangeError } from "./errors";

describe("DateRange", () => {
  it("calculates nights between dates", () => {
    const range = DateRange.from("2026-12-01", "2026-12-04");
    expect(range.nights).toBe(3);
  });

  it("detects overlapping ranges using half-open intervals", () => {
    const first = DateRange.from("2026-12-01", "2026-12-04");
    const second = DateRange.from("2026-12-03", "2026-12-06");
    const adjacent = DateRange.from("2026-12-04", "2026-12-06");

    expect(first.overlaps(second)).toBe(true);
    expect(first.overlaps(adjacent)).toBe(false);
  });

  it("knows whether a date is inside the range", () => {
    const range = DateRange.from("2026-12-01", "2026-12-04");

    expect(range.contains(new Date("2026-12-02T00:00:00.000Z"))).toBe(true);
    expect(range.contains(new Date("2026-12-04T00:00:00.000Z"))).toBe(false);
  });

  it("rejects invalid ranges", () => {
    expect(() => DateRange.from("2026-12-04", "2026-12-04")).toThrow(InvalidDateRangeError);
    expect(() => DateRange.from("2026-12-05", "2026-12-04")).toThrow(InvalidDateRangeError);
    expect(() => DateRange.from("2026-02-31", "2026-03-02")).toThrow(InvalidDateRangeError);
    expect(() => DateRange.from("not-a-date", "2026-12-04")).toThrow(InvalidDateRangeError);
  });

  it("serializes to date-only strings", () => {
    const range = DateRange.from("2026-12-01", "2026-12-04");
    expect(range.toPrimitives()).toEqual({
      checkIn: "2026-12-01",
      checkOut: "2026-12-04",
    });
  });
});
