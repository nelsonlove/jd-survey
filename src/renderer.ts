export const SECTION_HEADING = "## Contents (Filesystem)";
export const PROSE_PLACEHOLDER = "<!-- TODO: prose summary -->";

export function renderCallout(items: number, dateStr: string, depth: number, stubs: number): string {
  const itemLabel = items === 1 ? "item" : "items";
  const parts = [`${items} ${itemLabel}`, `surveyed ${dateStr}`, `depth ${depth}`];
  if (stubs) parts.push(`${stubs} iCloud ${stubs === 1 ? "stub" : "stubs"}`);
  return `> [!info] Filesystem snapshot\n> ${parts.join(" · ")}`;
}

export function renderSkeleton(callout: string): string {
  return `${SECTION_HEADING}\n\n${callout}\n\n${PROSE_PLACEHOLDER}\n`;
}

export function renderWithProse(callout: string, prose: string): string {
  return `${SECTION_HEADING}\n\n${callout}\n\n${prose.trimEnd()}\n`;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Manual section matching using the known structure:
// ## Heading\n\n...content...\n\n...prose...\n plus optional blank line
// Matches the section including the trailing blank line if present (for proper idempotent replacement).
const SECTION_RE_MANUAL = new RegExp(
  `^${escapeRe(SECTION_HEADING)}\\n\\n[\\s\\S]*?\\n\\n[\\s\\S]+?\\n(?:\\n)?`,
  "m",
);

export function upsertSection(body: string, newSection: string): string {
  const normalized = newSection.trimEnd() + "\n\n";

  // Try to match section using the known structure
  const match = SECTION_RE_MANUAL.exec(body);
  if (match) {
    const sectionStart = match.index;
    const sectionEnd = match.index + match[0].length;
    return body.slice(0, sectionStart) + normalized + body.slice(sectionEnd);
  }

  // No section found. Insert after H1 or prepend.
  const h1 = /^# .+\n/m.exec(body);
  if (h1) {
    const idx = h1.index + h1[0].length;
    const remainder = body.slice(idx).replace(/^\n+/, "");
    return body.slice(0, idx) + "\n" + normalized + remainder;
  }
  return normalized + body.replace(/^\n+/, "");
}

export function matchSection(body: string): string | null {
  const match = SECTION_RE_MANUAL.exec(body);
  return match ? match[0] : null;
}
