const SECTION_HEADING = "## Contents (Filesystem)";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const SECTION_RE = new RegExp(
  `^${escapeRe(SECTION_HEADING)}\\n\\n(?:(?!\\n\\n(?=##|[^#]|$))[\\s\\S])*`,
  "m",
);

const callout = "> [!info] Filesystem snapshot\n> 2 items · surveyed 2026-07-05 · depth 2";
const section = `${SECTION_HEADING}\n\n${callout}\n\n<!-- TODO: prose summary -->\n`;
const body = `# Title\n\n${section}\nMore.\n`;

console.log("Testing pattern with \\n\\n after heading");
console.log("Body:", JSON.stringify(body));

const match = SECTION_RE.exec(body);
if (match) {
  console.log("\nMatch found!");
  console.log("Match length:", match[0].length);
  console.log("Matched:", JSON.stringify(match[0]));
  console.log("After match:", JSON.stringify(body.slice(match.index + match[0].length)));
} else {
  console.log("\nNo match found!");
}
