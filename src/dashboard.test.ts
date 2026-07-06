import { describe, it, expect } from "vitest";
import { buildStatusTable, buildSummaryLine, sortRows, spliceMarkers, StatusRow } from "./dashboard";

const rows: StatusRow[] = [
  { jdid: "26.10", title: "B", at: null, items: null, current: 3, reason: "never" },
  { jdid: "08.30", title: "A", at: "2026-01-01", items: 5, current: 6, reason: "count-drift" },
];

describe("dashboard", () => {
  it("sorts by reason bucket then date then jdid", () => {
    const s = sortRows([...rows].reverse());
    expect(s[0].reason).toBe("never");
    expect(s[1].reason).toBe("count-drift");
  });
  it("renders a table with em-dash nulls and backticked jdids", () => {
    const t = buildStatusTable(rows);
    expect(t).toContain("| JDID | Title | survey.at | survey.items | current | reason |");
    expect(t).toContain("| `26.10` | B | — | — | 3 | never |");
    expect(t).toContain("| `08.30` | A | 2026-01-01 | 5 | 6 | count-drift |");
  });
  it("summarizes counts by reason", () => {
    expect(buildSummaryLine(rows)).toBe("**2 JDIDs need a survey** — never: 1, count-drift: 1");
  });
  it("splices between markers", () => {
    const body = "top\n<!--b-->\nOLD\n<!--e-->\nbottom\n";
    const r = spliceMarkers(body, "<!--b-->", "<!--e-->", "NEW");
    expect(r.ok).toBe(true);
    expect(r.body).toBe("top\n<!--b-->\nNEW\n<!--e-->\nbottom\n");
  });
  it("ignores inline prose mention and targets the standalone-line block", () => {
    // The marker strings appear inside a sentence; only the standalone lines are spliced.
    const body = "Refresh: run between the `<!--b-->` / `<!--e-->` markers.\n\n<!--b-->\nOLD\n<!--e-->\n";
    const r = spliceMarkers(body, "<!--b-->", "<!--e-->", "NEW");
    expect(r.ok).toBe(true);
    // Prose sentence must be untouched
    expect(r.body).toContain("run between the `<!--b-->` / `<!--e-->` markers.");
    // Block content replaced
    expect(r.body).toContain("\n<!--b-->\nNEW\n<!--e-->\n");
    expect(r.body).not.toContain("\nOLD\n");
  });
  it("reports failure when markers are missing", () => {
    expect(spliceMarkers("no markers", "<!--b-->", "<!--e-->", "X").ok).toBe(false);
  });
});
