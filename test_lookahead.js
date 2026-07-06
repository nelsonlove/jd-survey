const str = "\n> [!info]";

// Test each alternative separately
const alternatives = [
  { pattern: "##", desc: "##" },
  { pattern: "[^#\\n]", desc: "[^#\\n]" },
  { pattern: "\\n##", desc: "\\n##" },
  { pattern: "$", desc: "$" },
  { pattern: "[^#\\n]|$", desc: "[^#\\n]|$" },
  { pattern: "\\n|$", desc: "\\n|$" },
  { pattern: "\\n|[^#\\n]|$", desc: "\\n|[^#\\n]|$" },
];

console.log("String to check: " + JSON.stringify(str));
console.log("");

for (const { pattern, desc } of alternatives) {
  const regex = new RegExp("^" + pattern);
  const match = regex.exec(str);
  if (match) {
    console.log(`✓ Pattern "${desc}": MATCH -> ${JSON.stringify(match[0])}`);
  } else {
    console.log(`✗ Pattern "${desc}": NO MATCH`);
  }
}
