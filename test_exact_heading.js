const SECTION_HEADING = "## Contents (Filesystem)";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const SECTION_RE = new RegExp(
  `^${escapeRe(SECTION_HEADING)}(?:(?!^## |\\n## )[\\s\\S])*`,
  "m",
);

console.log("Regex source:", SECTION_RE.source);
console.log("Regex flags:", SECTION_RE.flags);

const callout = "> [!info] Filesystem snapshot\n> 2 items · surveyed 2026-07-05 · depth 2";
const section = `${SECTION_HEADING}\n\n${callout}\n\n<!-- TODO: prose summary -->\n`;
const body = `# Title\n\n${section}\nMore.\n`;
const sentinel = "\n## __ENDMARKER__";
const bodyWithSentinel = body + sentinel;

console.log("\nBody with sentinel:");
console.log(JSON.stringify(bodyWithSentinel));

const match = SECTION_RE.exec(bodyWithSentinel);
if (match) {
  console.log("\nMatch found at index:", match.index);
  console.log("Match length:", match[0].length);
  console.log("Match substring (first 100 chars):", JSON.stringify(match[0].substring(0, 100)));
  const afterMatch = bodyWithSentinel.slice(match.index + match[0].length, match.index + match[0].length + 30);
  console.log("After match:", JSON.stringify(afterMatch));
} else {
  console.log("\nNo match!");
}
