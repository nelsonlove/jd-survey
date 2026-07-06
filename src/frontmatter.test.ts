import { describe, it, expect } from "vitest";
import { applySurveyToFrontmatter, migrateFrontmatter } from "./frontmatter";
import { deriveKeys } from "./config";

const keys = deriveKeys("survey");

describe("applySurveyToFrontmatter", () => {
  it("writes the nested object in field order and strips legacy + has-filesystem", () => {
    const fm: any = {
      title: "X", modified: "2026-01-01", "has-filesystem": true,
      surveyed: "2025-01-01", "survey-items": 3, "survey-target": "documents",
    };
    applySurveyToFrontmatter(fm, { at: "2026-07-05", items: 24, depth: 2, by: "jd-survey-llm", stubs: 0 }, keys);
    expect(Object.keys(fm.survey)).toEqual(["at", "items", "depth", "by", "stubs"]);
    expect(fm.survey.by).toBe("jd-survey-llm");
    expect(fm.surveyed).toBeUndefined();
    expect(fm["survey-items"]).toBeUndefined();
    expect(fm["has-filesystem"]).toBeUndefined();
    expect(fm["survey-target"]).toBe("documents"); // preserved
    expect(fm.modified).toBe("2026-01-01");          // untouched
  });
});

describe("migrateFrontmatter", () => {
  it("rewrites has-filesystem:false to survey-target:none", () => {
    const fm: any = { "has-filesystem": false };
    expect(migrateFrontmatter(fm, keys)).toBe(true);
    expect(fm["survey-target"]).toBe("none");
    expect(fm["has-filesystem"]).toBeUndefined();
  });
  it("drops a stray has-filesystem:true", () => {
    const fm: any = { "has-filesystem": true };
    expect(migrateFrontmatter(fm, keys)).toBe(true);
    expect(fm["has-filesystem"]).toBeUndefined();
    expect(fm["survey-target"]).toBeUndefined();
  });
  it("no-ops when nothing to migrate", () => {
    expect(migrateFrontmatter({ title: "x" } as any, keys)).toBe(false);
  });
});
