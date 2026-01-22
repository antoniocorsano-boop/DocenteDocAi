import fs from "fs";
import { execSync } from "child_process";
import { codemod } from "./md3-codemod.js";

const list = JSON.parse(fs.readFileSync("md3-engine/md3-priority.json", "utf8"));

for (const { file } of list.slice(0, 3)) {
  console.log("🔧 Migrating:", file);
  codemod(file);

  try {
    execSync(`npm run lint -- ${file}`, { stdio: "pipe" });
    console.log("✅ OK:", file);
  } catch {
    console.log("🧠 STOP – serve Copilot su:", file);
    console.log(`
PROMPT PER COPILOT:
"Rendi questo file MD3 compliant.
Risolvi SOLO errori ESLint/MD3.
NON cambiare la logica."
`);
    break;
  }
}
