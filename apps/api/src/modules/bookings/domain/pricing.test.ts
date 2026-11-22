import { describe, expect, it } from "vitest";
import { DateRange } from "./DateRange";
import { calculateTotalCents, nightlyRateCents } from "./pricing";

describe("pricing", () => {
  it("applies the discount to the nightly rate", () => {
    expect(nightlyRateCents({ priceCents: 10_000, discountPct: 10 })).toBe(9_000);
    expect(nightlyRateCents({ priceCents: 10_000, discountPct: 0 })).toBe(10_000);
    expect(nightlyRateCents({ priceCents: 10_000, discountPct: 100 })).toBe(0);
  });

  it("clamps invalid discounts", () => {
    expect(nightlyRateCents({ priceCents: 10_000, discountPct: -10 })).toBe(10_000);
    expect(nightlyRateCents({ priceCents: 10_000, discountPct: 150 })).toBe(0);
  });

  it("multiplies the nightly rate by the number of nights", () => {
    const range = DateRange.from("2026-12-01", "2026-12-04");

    expect(calculateTotalCents({ priceCents: 10_000, discountPct: 10 }, range)).toBe(27_000);
  });
});
