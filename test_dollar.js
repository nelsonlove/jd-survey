// Test where $ matches with multiline flag

const str = "## Heading\n\nmore content";

console.log("String:", JSON.stringify(str));
console.log("Chars with indices:");
for (let i = 0; i < str.length; i++) {
  const ch = str[i];
  const display = ch === '\n' ? '\\n' : ch;
  console.log(`  [${i}] = ${JSON.stringify(display)}`);
}

// Test where ^$ match at each position
const mlRegex = /$/m;  // Match end of line with multiline flag

console.log("\nPositions where $ matches:");
for (let i = 0; i <= str.length; i++) {
  const substr = str.substring(i);
  if (mlRegex.test(substr)) {
    const prevChar = i > 0 ? str[i-1] : 'START';
    const nextChar = i < str.length ? str[i] : 'END';
    console.log(`  [${i}] (after ${JSON.stringify(prevChar)}, before ${JSON.stringify(nextChar)})`);
  }
}
