// Test the negative lookahead pattern separately

const str = "test\n\nmore\n## next";

console.log("String:", JSON.stringify(str));

const negLA = /(?:(?!^## |\n## )[\s\S])*/m;
const match = negLA.exec(str);

console.log("\nMatching (?:(?!^## |\\n## )[\\s\\S])*:");
console.log("Match:", match ? JSON.stringify(match[0]) : "NO MATCH");
console.log("Length:", match ? match[0].length : 0);

// Also test with the heading
const withHeading = /^## Contents((?:(?!^## |\n## )[\s\S])*)$/m;
const m2 = withHeading.exec("## Contents\nmore content");
console.log("\nWith heading and content:");
console.log("Match:", m2 ? m2[0] : "NO MATCH");
