import path from "path";

export const AREA_RE = /^\d0-\d9 /;
export const CAT_RE = /^\d{2} /;
export const JDID_NOTE_RE = /^(\d{2})\.(\d{2,3})( .+)\.md$/;

export interface Candidate { relPath: string; jdid: string; title: string; }

export function candidatesFromPaths(relPaths: string[]): Candidate[] {
  const out: Candidate[] = [];
  for (const relPath of relPaths) {
    const parts = relPath.split("/");
    if (parts.length < 3) continue;              // need area/category/note at minimum
    if (!AREA_RE.test(parts[0])) continue;
    if (!CAT_RE.test(parts[1])) continue;
    const base = path.posix.basename(relPath);
    const m = JDID_NOTE_RE.exec(base);
    if (!m) continue;
    const jdid = `${m[1]}.${m[2]}`;
    const title = m[3].trim();
    if (m[2] === "00" && title.includes("JDex")) continue;
    // Accept a direct category child OR a folder note (parent name === stem)
    const dir = path.posix.dirname(relPath);
    const stem = path.posix.basename(relPath, ".md");
    const isFolderNote = path.posix.basename(dir) === stem;
    const isDirectCatChild = CAT_RE.test(parts[1]) && parts.length === 3;
    if (!isFolderNote && !isDirectCatChild) continue;
    out.push({ relPath, jdid, title });
  }
  return out;
}
