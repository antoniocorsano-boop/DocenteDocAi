/**
 * scan-legacy-components.ts
 * Script per contare i componenti legacy da migrare in DocenteDoc AI
 */

import { readdirSync, readFileSync } from "fs";
import { join } from "path";

// Cartella principale dei componenti
const COMPONENTS_DIR = join(__dirname, "..", "..", "src", "components");

// Lista componenti legacy da cercare (aggiornabile)
const LEGACY_COMPONENTS = [
  "SettingsGroup",
  "FormFieldWrapper",
  "ActionTile",
  "CategoryCard",
  "PageWrapper",
  "SectionWrapper"
];

// Funzione ricorsiva per leggere file TSX/TS
function getAllFiles(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      files.push(fullPath);
    }
  }
  return files;
}

// Conta le occorrenze di ciascun componente legacy
function countLegacyComponents(files: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const component of LEGACY_COMPONENTS) {
    counts[component] = 0;
  }

  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    for (const component of LEGACY_COMPONENTS) {
      // Cerca utilizzo come JSX tag: <Component ...>
      const regex = new RegExp(`<${component}[\\s/>]`, "g");
      const matches = content.match(regex);
      if (matches) counts[component] += matches.length;
    }
  }

  return counts;
}

// Esecuzione
console.log("🔍 Starting scan for legacy components...");
console.log("📂 COMPONENTS_DIR:", COMPONENTS_DIR);

try {
  const allFiles = getAllFiles(COMPONENTS_DIR);
  console.log(`📁 Found ${allFiles.length} TypeScript/React files`);
  console.log("Files found:", allFiles.slice(0, 5)); // Show first 5 files
  
  const legacyCounts = countLegacyComponents(allFiles);

  console.log("\n📋 Componenti Legacy Rimanenti - DocenteDoc AI\n");
  console.table(legacyCounts);
} catch (error) {
  console.error("❌ Error:", error);
}
