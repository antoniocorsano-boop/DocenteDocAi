// file: md3-gold-fix.ts
import fs from "fs";
import path from "path";

// CONFIGURAZIONE
const filesToFix = [
  "src/components/AssistantFab.tsx",
  "src/layout.css",
  "src/modules.css",
  "src/theme.css",
  "src/components/components.css",
];

const elevationMap: Record<string, string> = {
  "--md-sys-elevation-level-1": "--md-elevation-1",
  "--md-sys-elevation-level-2": "--md-elevation-2",
  "--md-sys-elevation-level-3": "--md-elevation-3",
  "--md-sys-elevation-level-4": "--md-elevation-4",
  "--md-sys-elevation-level-5": "--md-elevation-5",
};

const motionDurationMap: Record<string, string> = {
  "0.01ms": "var(--md-sys-motion-duration-short)",
  "0.1s": "var(--md-sys-motion-duration-short)",
  "0.2s": "var(--md-sys-motion-duration-short)",
  "0.3s": "var(--md-sys-motion-duration-medium)",
  "0.4s": "var(--md-sys-motion-duration-medium)",
  "0.5s": "var(--md-sys-motion-duration-medium)",
  "0.7s": "var(--md-sys-motion-duration-long)",
  "1s": "var(--md-sys-motion-duration-long)",
  "2s": "var(--md-sys-motion-duration-extra-long)",
  "3s": "var(--md-sys-motion-duration-extra-long)",
  "120ms": "var(--md-sys-motion-duration-short)",
};

const motionEasingMap: Record<string, string> = {
  "ease": "var(--md-sys-motion-easing-standard)",
  "ease-out": "var(--md-sys-motion-easing-emphasized)",
  "ease-in-out": "var(--md-sys-motion-easing-standard)",
  "linear": "var(--md-sys-motion-easing-linear)",
};

// UTILITY: Leggi, sostituisci e salva file
function replaceTokensInFile(filePath: string) {
  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(absPath, "utf-8");
  const changes: string[] = [];

  // Elevation
  for (const [oldToken, newToken] of Object.entries(elevationMap)) {
    if (content.includes(oldToken)) {
      content = content.replace(new RegExp(oldToken, "g"), newToken);
      changes.push(`Elevation: ${oldToken} → ${newToken}`);
    }
  }

  // Motion Duration
  for (const [oldVal, newToken] of Object.entries(motionDurationMap)) {
    if (content.includes(oldVal)) {
      content = content.replace(new RegExp(oldVal, "g"), newToken);
      changes.push(`Duration: ${oldVal} → ${newToken}`);
    }
  }

  // Motion Easing
  for (const [oldVal, newToken] of Object.entries(motionEasingMap)) {
    if (content.includes(oldVal)) {
      content = content.replace(new RegExp(oldVal, "g"), newToken);
      changes.push(`Easing: ${oldVal} → ${newToken}`);
    }
  }

  if (changes.length > 0) {
    fs.writeFileSync(absPath, content, "utf-8");
    console.log(`\nUpdated ${filePath}:`);
    changes.forEach(change => console.log("  " + change));
  } else {
    console.log(`No changes needed in ${filePath}`);
  }
}

// ESECUZIONE SCRIPT
console.log("🚀 Starting MD3 Gold motion & elevation fix...\n");

filesToFix.forEach(replaceTokensInFile);

console.log("\n✅ MD3 Gold fix completed. Run ESLint & tests to validate.");