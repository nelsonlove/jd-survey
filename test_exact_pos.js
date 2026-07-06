const SECTION_HEADING = "## Contents (Filesystem)";

const callout = "> [!info] Filesystem snapshot\n> 2 items · surveyed 2026-07-05 · depth 2";
const section = `${SECTION_HEADING}\n\n${callout}\n\n<!-- TODO: prose summary -->\n`;
const body = `# Title\n\n${section}\nMore.\n`;

console.log("Body:");
console.log(JSON.stringify(body));

console.log("\nCharacter breakdown:");
for (let i = 0; i < Math.min(40, body.length); i++) {
  const c = body[i];
  console.log(`[${i}] = ${JSON.stringify(c)}`);
}

// Find where the heading ends
const headingMatch = /^## Contents \(Filesystem\)\n/m.exec(body);
console.log("\nHeading match index:", headingMatch.index);
console.log("Heading match ends at:", headingMatch.index + headingMatch[0].length);

const lookaheadPos = headingMatch.index + headingMatch[0].length;
console.log("\nLookahead position:", lookaheadPos);
console.log("Characters at lookahead position:");

const remaining = body.substring(lookaheadPos);
for (let i = 0; i < Math.min(20, remaining.length); i++) {
  const c = remaining[i];
  console.log(`[${i}] = ${JSON.stringify(c)}`);
}

console.log("\nNext 10 chars from lookahead pos:", JSON.stringify(remaining.substring(0, 10)));

const lookaheadRegex = /##|[^#\n]|\n##|$/;
const match = lookaheadRegex.exec(remaining);
console.log("Lookahead exec result:", match);
