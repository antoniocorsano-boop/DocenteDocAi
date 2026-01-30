/**
 * MD3 Typography Refactor Script - Improved Version
 *
 * Maps specific font sizes to appropriate MD3 typography tokens based on semantic usage.
 * Creates backups and provides detailed logging.
 */

import fs from "fs";
import path from "path";
import { glob } from "glob";

const TARGET_DIR = "src";
const BACKUP_EXT = ".bak";

const FILE_PATTERNS = [
  `${TARGET_DIR}/components/**/*.tsx`,
  `${TARGET_DIR}/styles/**/*.css`,
  `${TARGET_DIR}/layout/**/*.tsx`
];

// MD3 Typography Token Mappings - Map specific values to appropriate tokens
const TYPOGRAPHY_TOKENS = [
  // Font Size Mappings
  { pattern: /font-size:\s*14px/gi, replacement: "font-size: var(--md-sys-typescale-body-large-font-size)" },
  { pattern: /font-size:\s*16px/gi, replacement: "font-size: var(--md-sys-typescale-body-large-font-size)" },
  { pattern: /font-size:\s*18px/gi, replacement: "font-size: var(--md-sys-typescale-headline-small-font-size)" },
  { pattern: /font-size:\s*20px/gi, replacement: "font-size: var(--md-sys-typescale-headline-small-font-size)" },
  { pattern: /font-size:\s*24px/gi, replacement: "font-size: var(--md-sys-typescale-headline-medium-font-size)" },
  { pattern: /font-size:\s*28px/gi, replacement: "font-size: var(--md-sys-typescale-headline-large-font-size)" },
  { pattern: /font-size:\s*32px/gi, replacement: "font-size: var(--md-sys-typescale-display-small-font-size)" },
  { pattern: /font-size:\s*36px/gi, replacement: "font-size: var(--md-sys-typescale-display-medium-font-size)" },
  { pattern: /font-size:\s*48px/gi, replacement: "font-size: var(--md-sys-typescale-display-large-font-size)" },
  { pattern: /font-size:\s*12px/gi, replacement: "font-size: var(--md-sys-typescale-body-medium-font-size)" },
  { pattern: /font-size:\s*11px/gi, replacement: "font-size: var(--md-sys-typescale-body-small-font-size)" },
  { pattern: /font-size:\s*10px/gi, replacement: "font-size: var(--md-sys-typescale-label-small-font-size)" },

  // Font Weight Mappings
  { pattern: /font-weight:\s*400/gi, replacement: "font-weight: var(--md-sys-typescale-body-large-font-weight)" },
  { pattern: /font-weight:\s*500/gi, replacement: "font-weight: var(--md-sys-typescale-title-medium-font-weight)" },
  { pattern: /font-weight:\s*600/gi, replacement: "font-weight: var(--md-sys-typescale-title-large-font-weight)" },
  { pattern: /font-weight:\s*700/gi, replacement: "font-weight: var(--md-sys-typescale-headline-large-font-weight)" },

  // Line Height Mappings
  { pattern: /line-height:\s*1\.2/gi, replacement: "line-height: var(--md-sys-typescale-body-medium-line-height)" },
  { pattern: /line-height:\s*1\.4/gi, replacement: "line-height: var(--md-sys-typescale-body-large-line-height)" },
  { pattern: /line-height:\s*1\.6/gi, replacement: "line-height: var(--md-sys-typescale-headline-medium-line-height)" },

  // Letter Spacing Mappings
  { pattern: /letter-spacing:\s*0\.1em/gi, replacement: "letter-spacing: var(--md-sys-typescale-body-medium-tracking)" },
  { pattern: /letter-spacing:\s*0\.15em/gi, replacement: "letter-spacing: var(--md-sys-typescale-title-medium-tracking)" },
  { pattern: /letter-spacing:\s*0\.25em/gi, replacement: "letter-spacing: var(--md-sys-typescale-headline-large-tracking)" },

  // Font Family (keep as-is for now, may need custom tokens)
  // { pattern: /font-family:[^;]+/gi, replacement: "font-family: var(--md-sys-typescale-body-medium-font-family)" }
];

async function runRefactor() {
  let totalFilesProcessed = 0;
  let totalReplacements = 0;

  for (const pattern of FILE_PATTERNS) {
    const files = await glob(pattern);
    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");

      // create backup
      fs.writeFileSync(file + BACKUP_EXT, content);

      let newContent = content;
      let fileReplacements = 0;

      TYPOGRAPHY_TOKENS.forEach(mapping => {
        const matches = newContent.match(mapping.pattern);
        if (matches) {
          newContent = newContent.replace(mapping.pattern, mapping.replacement);
          fileReplacements += matches.length;
        }
      });

      if (fileReplacements > 0) {
        fs.writeFileSync(file, newContent);
        console.log(`✅ ${file}: ${fileReplacements} replacements`);
        totalReplacements += fileReplacements;
        totalFilesProcessed++;
      }
    }
  }

  console.log(`\n🎯 MD3 Typography Refactor Complete!`);
  console.log(`📁 Files processed: ${totalFilesProcessed}`);
  console.log(`🔄 Total replacements: ${totalReplacements}`);
  console.log(`💾 Backups created for all modified files (.bak)`);
  console.log(`\n⚠️  Note: This script maps common font sizes to appropriate MD3 tokens.`);
  console.log(`   Review changes and adjust mappings as needed for semantic correctness.`);
}

runRefactor().catch(console.error);