const str = "\n\n> [!info]";

console.log("String:", JSON.stringify(str));
console.log("\nTesting $ directly:");
const dollarRegex = /$/m;
const m1 = dollarRegex.exec(str);
console.log("$ matches at index:", m1 ? m1.index : "NO MATCH");
console.log("Matched:", m1 ? JSON.stringify(m1[0]) : "NONE");

console.log("\nTesting alternatives one by one:");
const tests = [
  { regex: /^## /m, label: "^## " },
  { regex: /\n## /m, label: "\\n## " },
  { regex: /$/m, label: "$" },
];

for (const { regex, label } of tests) {
  const m = regex.exec(str);
  console.log(`${label}: index=${m ? m.index : "NONE"}, matched=${m ? JSON.stringify(m[0]) : "NONE"}`);
}

console.log("\nTesting disjunction /^## |\\n## |$/m:");
const disjRegex = /^## |\n## |$/m;
const m2 = disjRegex.exec(str);
console.log("Disjunction result:", m2);
