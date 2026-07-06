import { describe, it, expect } from "vitest";
import { readSurveyState, stalenessReason, ageReasonLabel } from "./staleness";
import { deriveKeys } from "./config";

const keys = deriveKeys("survey");

describe("readSurveyState", () => {
  it("reads the nested object; ignores legacy flat/bare keys", () => {
    const s = readSurveyState({ survey: { at: "2026-01-01", items: 10, stubs: 2, depth: 2, by: "jd-survey" } }, keys);
    expect(s.at?.getFullYear()).toBe(2026);
    expect(s.items).toBe(10);
    expect(s.stubs).toBe(2);
    const legacy = readSurveyState({ surveyed: "2026-01-01", "survey-items": 10 }, keys);
    expect(legacy.at).toBeNull();
    expect(legacy.items).toBeNull();
  });
});

describe("stalenessReason", () => {
  const today = new Date(2026, 6, 5);
  it("never when no date", () => {
    expect(stalenessReason({ at: null, items: null, stubs: null, depth: null, by: null }, { items: 3, stubs: 0 }, 180, today)).toBe("never");
  });
  it("count-drift beats stub-drift", () => {
    const s = { at: new Date(2026, 6, 1), items: 3, stubs: 0, depth: 2, by: "x" };
    expect(stalenessReason(s, { items: 4, stubs: 1 }, 180, today)).toBe("count-drift");
  });
  it("stub-drift when counts match but stubs differ", () => {
    const s = { at: new Date(2026, 6, 1), items: 3, stubs: 0, depth: 2, by: "x" };
    expect(stalenessReason(s, { items: 3, stubs: 1 }, 180, today)).toBe("stub-drift");
  });
  it("stale-<N>d strictly past threshold", () => {
    const s = { at: new Date(2025, 0, 1), items: 3, stubs: 0, depth: 2, by: "x" };
    expect(stalenessReason(s, { items: 3, stubs: 0 }, 180, today)).toBe("stale-180d");
  });
  it("fresh -> null", () => {
    const s = { at: new Date(2026, 6, 1), items: 3, stubs: 0, depth: 2, by: "x" };
    expect(stalenessReason(s, { items: 3, stubs: 0 }, 180, today)).toBeNull();
  });
  it("label reflects a custom threshold", () => {
    expect(ageReasonLabel(90)).toBe("stale-90d");
  });
});
