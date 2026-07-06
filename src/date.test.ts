import { describe, it, expect } from "vitest";
import { formatDate, parseDate, daysBetween } from "./date";

describe("date helpers", () => {
  it("formats YYYY-MM-DD", () => {
    expect(formatDate(new Date(2026, 6, 5), "YYYY-MM-DD")).toBe("2026-07-05");
  });
  it("parses date strings and Date objects", () => {
    expect(parseDate("2026-07-05")!.getFullYear()).toBe(2026);
    expect(parseDate("2026-07-05T12:00:00")!.getMonth()).toBe(6);
    const d = new Date(2026, 0, 1);
    expect(parseDate(d)).toBe(d);
    expect(parseDate(42)).toBeNull();
    expect(parseDate("nope")).toBeNull();
  });
  it("computes whole-day differences", () => {
    expect(daysBetween(new Date(2026, 0, 1), new Date(2026, 0, 181))).toBe(180);
  });
});
