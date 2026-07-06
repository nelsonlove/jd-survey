const SECTION_HEADING = "## Contents (Filesystem)";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const callout = "> [!info] Filesystem snapshot\n> 2 items · surveyed 2026-07-05 · depth 2";
const section = `${SECTION_HEADING}\n\n${callout}\n\n<!-- TODO: prose summary -->\n`;
const body = `# Title\n\n${section}\nMore.\n`;
const sentinel = "\n## __ENDMARKER__";
const bodyWithSentinel = body + sentinel;

// Create the regex
const regex = new RegExp(
  `^${escapeRe(SECTION_HEADING)}[\\s\\S]*?\\n(?=##|[^#\\n]|\\n##|$)`,
  "m",
);

console.log("Full body:");
console.log(JSON.stringify(bodyWithSentinel));

console.log("\nTesting position-by-position where lookahead would match:");
console.log("\nAfter 'heading\\n', position", 9 + SECTION_HEADING.length + 1, ":");
const pos1 = 9 + SECTION_HEADING.length + 1;
const after1 = bodyWithSentinel.substring(pos1);
console.log("Next chars:", JSON.stringify(after1.substring(0, 10)));
const la1 = /##|[^#\n]|\n##|$/.exec(after1);
console.log("Lookahead result:", la1 ? JSON.stringify(la1[0]) || "(empty)" : "NO MATCH");

console.log("\n\nRunning full regex:");
const match = regex.exec(bodyWithSentinel);
if (match) {
  console.log("Match found at index:", match.index);
  console.log("Match length:", match[0].length);
  console.log("Matched:", JSON.stringify(match[0]));
} else {
  console.log("No match");
}
