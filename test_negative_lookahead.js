const SECTION_HEADING = "## Contents (Filesystem)";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Use negative lookahead to NOT match when we see the next section
const SECTION_RE = new RegExp(
  `^${escapeRe(SECTION_HEADING)}(?:(?!^## |\\n## )[\s\S])*`,
  "m",
);

const callout = "> [!info] Filesystem snapshot\n> 2 items · surveyed 2026-07-05 · depth 2";
const section = `${SECTION_HEADING}\n\n${callout}\n\n<!-- TODO: prose summary -->\n`;
const body = `# Title\n\n${section}\nMore.\n`;
const sentinel = "\n## __ENDMARKER__";
const bodyWithSentinel = body + sentinel;

console.log("Testing pattern: ^HEADING(?:(?!^## |\\n## )[\\s\\S])*");
console.log("\nBody with sentinel:");
console.log(JSON.stringify(bodyWithSentinel));

const match = SECTION_RE.exec(bodyWithSentinel);
if (match) {
  console.log("\nMatch found!");
  console.log("Match index:", match.index);
  console.log("Match length:", match[0].length);
  console.log("Matched:", JSON.stringify(match[0]));
  console.log("After match:", JSON.stringify(bodyWithSentinel.slice(match.index + match[0].length, match.index + match[0].length + 20)));
} else {
  console.log("\nNo match found!");
}
