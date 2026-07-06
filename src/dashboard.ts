export interface StatusRow {
  jdid: string; title: string; at: string | null; items: number | null; current: number; reason: string;
}

function bucket(reason: string): number {
  if (reason === "never") return 0;
  if (reason === "count-drift") return 1;
  if (reason === "stub-drift") return 2;
  return 3; // stale-*
}

export function sortRows(rows: StatusRow[]): StatusRow[] {
  return [...rows].sort((a, b) => {
    const bd = bucket(a.reason) - bucket(b.reason);
    if (bd !== 0) return bd;
    const ad = a.at ?? "", bx = b.at ?? "";
    if (ad !== bx) return ad < bx ? -1 : 1;
    return a.jdid < b.jdid ? -1 : a.jdid > b.jdid ? 1 : 0;
  });
}

export function buildStatusTable(rows: StatusRow[]): string {
  const header =
    "| JDID | Title | survey.at | survey.items | current | reason |\n|---|---|---|---|---|---|";
  const lines = sortRows(rows).map((r) => {
    const at = r.at ?? "—";
    const items = r.items === null ? "—" : String(r.items);
    return `| \`${r.jdid}\` | ${r.title} | ${at} | ${items} | ${r.current} | ${r.reason} |`;
  });
  return [header, ...lines].join("\n");
}

export function buildSummaryLine(rows: StatusRow[]): string {
  const counts = new Map<string, number>();
  for (const r of sortRows(rows)) counts.set(r.reason, (counts.get(r.reason) ?? 0) + 1);
  const parts = [...counts.entries()].map(([k, v]) => `${k}: ${v}`).join(", ");
  return `**${rows.length} JDIDs need a survey** — ${parts}`;
}

export function spliceMarkers(
  body: string, begin: string, end: string, content: string,
): { ok: boolean; body: string } {
  const bi = body.indexOf(begin);
  const ei = body.indexOf(end);
  if (bi === -1 || ei === -1 || ei < bi) return { ok: false, body };
  const before = body.slice(0, bi + begin.length);
  const after = body.slice(ei);
  return { ok: true, body: `${before}\n${content}\n${after}` };
}
