const str = "\n> [!info]";

console.log("String:", JSON.stringify(str));
console.log("\nTesting lookahead at position 0 (at the newline):");

// Test lookahead as part of a full regex
const regex1 = /^(?=##|[^#\n]|\n##|$)/;
const match1 = regex1.exec(str);
console.log("Lookahead (?=##|[^#\\n]|\\n##|$) at pos 0:", match1 ? "MATCH" : "NO MATCH");

// Test each alternative
const alts = [
  { pattern: /^##/, desc: "##" },
  { pattern: /^[^#\n]/, desc: "[^#\\n]" },
  { pattern: /^\n##/, desc: "\\n##" },
  { pattern: /^$/, desc: "$" },
];

for (const { pattern, desc } of alts) {
  const m = pattern.exec(str);
  console.log(`  Alt "${desc}": ${m ? "MATCH -> " + JSON.stringify(m[0]) : "NO MATCH"}`);
}

// Test lookahead with the alternation directly
const lookahead = /##|[^#\n]|\n##|$/;
const laMatch = lookahead.exec(str);
console.log("\nDirect exec of alternation:", laMatch ? `MATCH at index ${laMatch.index}, matched ${JSON.stringify(laMatch[0])}` : "NO MATCH");
