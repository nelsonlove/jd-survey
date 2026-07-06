const SECTION_HEADING = "## Contents (Filesystem)";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Match from heading through final content, stopping at blank before next section/content
const regex = new RegExp(
  `^${escapeRe(SECTION_HEADING)}[\\s\\S]*?\\n(?=##|[^#\\n]|\\n##|$)`,
  "m",
);

const callout = "> [!info] Filesystem snapshot\n> 2 items · surveyed 2026-07-05 · depth 2";
const section = `${SECTION_HEADING}\n\n${callout}\n\n<!-- TODO: prose summary -->\n`;
const body = `# Title\n\n${section}\nMore.\n`;
const sentinel = "\n## __ENDMARKER__";
const bodyWithSentinel = body + sentinel;

console.log("Testing pattern: ^${HEADING}[\\s\\S]*?\\n(?=##|[^#\\n]|\\n##|$)");
console.log("\nFull body with sentinel:");
console.log(JSON.stringify(bodyWithSentinel));

const match = regex.exec(bodyWithSentinel);
if (match) {
  console.log("\nMatch found!");
  console.log("Match index:", match.index);
  console.log("Match length:", match[0].length);
  console.log("Matched text (repr):", JSON.stringify(match[0]));
  console.log("Text after match:", JSON.stringify(bodyWithSentinel.slice(match.index + match[0].length, match.index + match[0].length + 30)));
} else {
  console.log("\nNo match found!");
}
