import { describe, it, expect } from "vitest";
import { candidatesFromPaths } from "./notes";

describe("candidatesFromPaths", () => {
  it("keeps JDID notes under area/category, skips JDex and non-JD notes", () => {
    const paths = [
      "00-09 System/08 Obsidian/08.34 Stale surveys.md",
      "00-09 System/08 Obsidian/08.17 jd-survey/08.17 jd-survey.md",
      "00-09 System/08 Obsidian/08.00 JDex for 08.md",
      "00-09 System/08 Obsidian/random note.md",
      "Templates/thing.md",
    ];
    const c = candidatesFromPaths(paths);
    const ids = c.map((x) => x.jdid).sort();
    expect(ids).toEqual(["08.17", "08.34"]);
    expect(c.find((x) => x.jdid === "08.34")!.title).toBe("Stale surveys");
  });
});
