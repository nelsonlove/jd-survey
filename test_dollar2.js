// More careful testing of $ with m flag

const str = "## Heading\n\nmore content";

console.log("String:", JSON.stringify(str));

// Test with proper regex
const mlRegex = /$/m;
const matches = [];
for (let i = 0; i <= str.length; i++) {
  const substr = str.substring(i);
  const match = mlRegex.exec(substr);
  if (match && match.index === 0) {
    matches.push(i);
  }
}

console.log("Positions where $ matches (with exec):", matches);

// Now test the lookahead that was failing
const headingPos = 11; // Position after "## Heading\n\n"
const afterHeading = str.substring(headingPos);
console.log("\nAfter heading (pos 11):", JSON.stringify(afterHeading));

const lookaheadRegex = /##|[^#\n]|\n##|$/;
const la = lookaheadRegex.exec(afterHeading);
console.log("Lookahead match:", la ? (la[0] === "" ? "(empty match via $)" : JSON.stringify(la[0])) : "NO MATCH");

// Test the actual full regex from our failing case
const sectionRegex = /^## Contents \(Filesystem\)[\s\S]*?\n(?=##|[^#\n]|\n##|$)/m;
const body = "# Title\n\n## Contents (Filesystem)\n\nmore content";
const fullMatch = sectionRegex.exec(body);
console.log("\nFull section match:", fullMatch ? JSON.stringify(fullMatch[0]) : "NO MATCH");
