/**
 * MD3 Typography Semantic Token Refactor Script
 *
 * Replaces direct MD3 typography tokens with semantic tokens for better maintainability.
 * Handles both CSS files and inline styles in TSX files.
 *
 * Backup is created for safety (.bak files)
 */

import fs from "fs";
import path from "path";
import { glob } from "glob";

const TARGET_PATTERNS = [
  "src/components/**/*.tsx",
  "src/layout/**/*.tsx",
  "src/styles/**/*.css"
];

const BACKUP_EXT = ".bak";

// MD3 to Semantic Token Mappings
const TOKEN_MAPPINGS = [
  // Display tokens
  {
    md3: /--md-sys-typescale-display-large-font-size/gi,
    semantic: "--app-text-display"
  },
  {
    md3: /--md-sys-typescale-display-large-line-height/gi,
    semantic: "--app-text-display-line-height"
  },
  {
    md3: /--md-sys-typescale-display-large-font-weight/gi,
    semantic: "--app-text-display-weight"
  },
  {
    md3: /--md-sys-typescale-display-medium-font-size/gi,
    semantic: "--app-text-display"
  },
  {
    md3: /--md-sys-typescale-display-medium-line-height/gi,
    semantic: "--app-text-display-line-height"
  },
  {
    md3: /--md-sys-typescale-display-medium-font-weight/gi,
    semantic: "--app-text-display-weight"
  },
  {
    md3: /--md-sys-typescale-display-small-font-size/gi,
    semantic: "--app-text-display"
  },
  {
    md3: /--md-sys-typescale-display-small-line-height/gi,
    semantic: "--app-text-display-line-height"
  },
  {
    md3: /--md-sys-typescale-display-small-font-weight/gi,
    semantic: "--app-text-display-weight"
  },

  // Title tokens
  {
    md3: /--md-sys-typescale-headline-large-font-size/gi,
    semantic: "--app-text-title"
  },
  {
    md3: /--md-sys-typescale-headline-large-line-height/gi,
    semantic: "--app-text-title-line-height"
  },
  {
    md3: /--md-sys-typescale-headline-large-font-weight/gi,
    semantic: "--app-text-title-weight"
  },
  {
    md3: /--md-sys-typescale-headline-medium-font-size/gi,
    semantic: "--app-text-title"
  },
  {
    md3: /--md-sys-typescale-headline-medium-line-height/gi,
    semantic: "--app-text-title-line-height"
  },
  {
    md3: /--md-sys-typescale-headline-medium-font-weight/gi,
    semantic: "--app-text-title-weight"
  },
  {
    md3: /--md-sys-typescale-headline-small-font-size/gi,
    semantic: "--app-text-title"
  },
  {
    md3: /--md-sys-typescale-headline-small-line-height/gi,
    semantic: "--app-text-title-line-height"
  },
  {
    md3: /--md-sys-typescale-headline-small-font-weight/gi,
    semantic: "--app-text-title-weight"
  },
  {
    md3: /--md-sys-typescale-title-large-font-size/gi,
    semantic: "--app-text-title"
  },
  {
    md3: /--md-sys-typescale-title-large-line-height/gi,
    semantic: "--app-text-title-line-height"
  },
  {
    md3: /--md-sys-typescale-title-large-font-weight/gi,
    semantic: "--app-text-title-weight"
  },
  {
    md3: /--md-sys-typescale-title-medium-font-size/gi,
    semantic: "--app-text-title"
  },
  {
    md3: /--md-sys-typescale-title-medium-line-height/gi,
    semantic: "--app-text-title-line-height"
  },
  {
    md3: /--md-sys-typescale-title-medium-font-weight/gi,
    semantic: "--app-text-title-weight"
  },
  {
    md3: /--md-sys-typescale-title-small-font-size/gi,
    semantic: "--app-text-title"
  },
  {
    md3: /--md-sys-typescale-title-small-line-height/gi,
    semantic: "--app-text-title-line-height"
  },
  {
    md3: /--md-sys-typescale-title-small-font-weight/gi,
    semantic: "--app-text-title-weight"
  },

  // Body tokens
  {
    md3: /--md-sys-typescale-body-large-font-size/gi,
    semantic: "--app-text-body"
  },
  {
    md3: /--md-sys-typescale-body-large-line-height/gi,
    semantic: "--app-text-body-line-height"
  },
  {
    md3: /--md-sys-typescale-body-large-font-weight/gi,
    semantic: "--app-text-body-weight"
  },
  {
    md3: /--md-sys-typescale-body-medium-font-size/gi,
    semantic: "--app-text-body"
  },
  {
    md3: /--md-sys-typescale-body-medium-line-height/gi,
    semantic: "--app-text-body-line-height"
  },
  {
    md3: /--md-sys-typescale-body-medium-font-weight/gi,
    semantic: "--app-text-body-weight"
  },
  {
    md3: /--md-sys-typescale-body-small-font-size/gi,
    semantic: "--app-text-body"
  },
  {
    md3: /--md-sys-typescale-body-small-line-height/gi,
    semantic: "--app-text-body-line-height"
  },
  {
    md3: /--md-sys-typescale-body-small-font-weight/gi,
    semantic: "--app-text-body-weight"
  },

  // Label tokens
  {
    md3: /--md-sys-typescale-label-large-font-size/gi,
    semantic: "--app-text-label"
  },
  {
    md3: /--md-sys-typescale-label-large-line-height/gi,
    semantic: "--app-text-label-line-height"
  },
  {
    md3: /--md-sys-typescale-label-large-font-weight/gi,
    semantic: "--app-text-label-weight"
  },
  {
    md3: /--md-sys-typescale-label-medium-font-size/gi,
    semantic: "--app-text-label"
  },
  {
    md3: /--md-sys-typescale-label-medium-line-height/gi,
    semantic: "--app-text-label-line-height"
  },
  {
    md3: /--md-sys-typescale-label-medium-font-weight/gi,
    semantic: "--app-text-label-weight"
  },
  {
    md3: /--md-sys-typescale-label-small-font-size/gi,
    semantic: "--app-text-label"
  },
  {
    md3: /--md-sys-typescale-label-small-line-height/gi,
    semantic: "--app-text-label-line-height"
  },
  {
    md3: /--md-sys-typescale-label-small-font-weight/gi,
    semantic: "--app-text-label-weight"
  }
];

async function runRefactor() {
  const report = {
    filesProcessed: 0,
    totalReplacements: 0,
    changes: []
  };

  for (const pattern of TARGET_PATTERNS) {
    const files = await glob(pattern);
    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");

      // create backup
      fs.writeFileSync(file + BACKUP_EXT, content);

      let newContent = content;
      let fileReplacements = 0;
      const fileMappings = [];

      TOKEN_MAPPINGS.forEach(mapping => {
        const matches = newContent.match(mapping.md3);
        if (matches) {
          const before = newContent;
          newContent = newContent.replace(mapping.md3, mapping.semantic);
          const replacements = matches.length;

          fileReplacements += replacements;

          // Find the old token that was replaced
          const oldToken = matches[0];
          const existingMapping = fileMappings.find(m => m.old === oldToken && m.new === mapping.semantic);
          if (existingMapping) {
            existingMapping.count += replacements;
          } else {
            fileMappings.push({
              old: oldToken,
              new: mapping.semantic,
              count: replacements
            });
          }
        }
      });

      if (fileReplacements > 0) {
        fs.writeFileSync(file, newContent);
        report.filesProcessed++;
        report.totalReplacements += fileReplacements;
        report.changes.push({
          file: path.relative(process.cwd(), file),
          replacements: fileReplacements,
          mappings: fileMappings
        });

        console.log(`✅ ${path.relative(process.cwd(), file)}: ${fileReplacements} replacements`);
      }
    }
  }

  // Generate report
  const reportPath = "md3-typography-semantic-refactor-report.json";
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n🎯 MD3 Typography Semantic Token Refactor Complete!`);
  console.log(`📁 Files processed: ${report.filesProcessed}`);
  console.log(`🔄 Total replacements: ${report.totalReplacements}`);
  console.log(`📄 Report saved: ${reportPath}`);
  console.log(`💾 Backups created for all modified files (.bak)`);

  // Print summary
  console.log(`\n📊 SUMMARY OF CHANGES:`);
  report.changes.forEach(change => {
    console.log(`\n📄 ${change.file} (${change.replacements} replacements):`);
    change.mappings.forEach(mapping => {
      console.log(`  ${mapping.old} → ${mapping.new} (${mapping.count}x)`);
    });
  });
}

runRefactor().catch(console.error);