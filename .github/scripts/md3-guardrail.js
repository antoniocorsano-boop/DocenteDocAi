import fs from "fs";
import path from "path";

const FORBIDDEN = [
  /\b\d+px\b/,
  /\b\d+rem\b/,
  /\b\d+%\b/,
  /#[0-9a-fA-F]{3,6}\b/,
  /rgba?\(/,
  /className\s*=/,
];

function scan(file) {
  const content = fs.readFileSync(file, "utf8");
  return FORBIDDEN.some((r) => r.test(content));
}

function walk(dir, files = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else {
      const isTsTsxCss = /\.(ts|tsx|css)$/.test(p);
      if (isTsTsxCss) files.push(p);
    }
  }
  return files;
}

const files = walk("src");
const offenders = files.filter(scan);

if (offenders.length) {
  console.error("❌ MD3 GUARDRAIL VIOLATION:");
  offenders.forEach((f) => console.error(" -", f));
  process.exit(1);
}

console.log("✅ MD3 Guardrail passed");
