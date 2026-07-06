const str = "\n\n> [!info]";

console.log("String from heading end:", JSON.stringify(str));

const lookahead = /^## |\n## |$/m;
const match = lookahead.exec(str);
console.log("Lookahead match:", match);

if (match) {
  console.log("  Matched:", JSON.stringify(match[0]));
  console.log("  Index:", match.index);
}
