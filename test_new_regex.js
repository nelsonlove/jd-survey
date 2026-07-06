const SECTION_HEADING = "## Contents (Filesystem)";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const SECTION_RE = new RegExp(
  `^${escapeRe(SECTION_HEADING)}[\\s\\S]*?(?=^## |\\n## |$)`,
  "m",
);

const callout = "> [!info] Filesystem snapshot\n> 2 items · surveyed 2026-07-05 · depth 2";
const section = `${SECTION_HEADING}\n\n${callout}\n\n<!-- TODO: prose summary -->\n`;
const body = `# Title\n\n${section}\nMore.\n`;

console.log("Testing new pattern: ^HEADING[\\s\\S]*?(?=^## |\\n## |$)");
console.log("\nBody:");
console.log(JSON.stringify(body));

const match = SECTION_RE.exec(body);
if (match) {
  console.log("\nMatch found!");
  console.log("Match index:", match.index);
  console.log("Match length:", match[0].length);
  console.log("Matched:", JSON.stringify(match[0]));
  console.log("After match:", JSON.stringify(body.slice(match.index + match[0].length)));
} else {
  console.log("\nNo match found in original body!");
  
  const sentinel = "\n## __ENDMARKER__";
  const bodyWithSentinel = body + sentinel;
  const match2 = SECTION_RE.exec(bodyWithSentinel);
  
  if (match2) {
    console.log("Match found with sentinel!");
    console.log("Match length:", match2[0].length);
    console.log("Matched:", JSON.stringify(match2[0]));
  } else {
    console.log("No match even with sentinel!");
  }
}
