import fs from "fs";
import path from "path";

const base = path.resolve("md3-engine");

if (!fs.existsSync(base)) fs.mkdirSync(base);

const files = {
  "README.md": `
# MD3 Migration Engine

## Uso semplice

1️⃣ Genera la lista dei file da migrare
\`\`\`
node md3-engine/md3-analyzer.js
\`\`\`

2️⃣ Avvia la migrazione controllata
\`\`\`
node md3-engine/md3-engine.js
\`\`\`

3️⃣ Quando lo script si ferma:
- apri il file indicato
- premi TAB su Copilot
- salva
- rilancia il comando

⚠️ NON correggere a mano.
Copilot solo sugli errori ESLint segnalati.
`,

  "md3-analyzer.js": `
import { execSync } from "child_process";
import fs from "fs";

try {
  const out = execSync("npm run lint -- --format json", { encoding: "utf8" });
  const report = JSON.parse(out);

  const priority = report
    .filter(f => f.messages.some(m => m.ruleId?.includes("md3")))
    .sort((a, b) => b.messages.length - a.messages.length)
    .map(f => ({
      file: f.filePath,
      violations: f.messages.length
    }));

  fs.writeFileSync("md3-engine/md3-priority.json", JSON.stringify(priority, null, 2));
  console.log("✅ MD3 priority list created");
} catch {
  console.error("❌ ESLint must run without fatal errors");
}
`,

  "md3-codemod.js": `
import fs from "fs";

export function codemod(file) {
  let code = fs.readFileSync(file, "utf8");

  code = code
    .replace(/layers\\.sys\\.color\\.([a-zA-Z0-9]+)/g, "var(--md-sys-color-$1)")
    .replace(/useTheme\\(\\)/g, "")
    .replace(/<p>/g, '<M3Typography variant="bodyMedium">')
    .replace(/<\\/p>/g, "</M3Typography>")
    .replace(/<h1>/g, '<M3Typography variant="headlineLarge">')
    .replace(/<\\/h1>/g, "</M3Typography>");

  fs.writeFileSync(file, code);
}
`,

  "md3-engine.js": `
import fs from "fs";
import { execSync } from "child_process";
import { codemod } from "./md3-codemod.js";

const list = JSON.parse(fs.readFileSync("md3-engine/md3-priority.json", "utf8"));

for (const { file } of list.slice(0, 3)) {
  console.log("🔧 Migrating:", file);
  codemod(file);

  try {
    execSync(\`npm run lint -- \${file}\`, { stdio: "pipe" });
    console.log("✅ OK:", file);
  } catch {
    console.log("🧠 STOP – serve Copilot su:", file);
    console.log(\`
PROMPT PER COPILOT:
"Rendi questo file MD3 compliant.
Risolvi SOLO errori ESLint/MD3.
NON cambiare la logica."
\`);
    break;
  }
}
`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(base, name), content.trimStart());
}

console.log("🎉 MD3 Engine creato in /md3-engine");
