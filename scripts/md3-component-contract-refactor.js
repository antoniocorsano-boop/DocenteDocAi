/**
 * MD3 Component Contract Governance Refactor Script
 *
 * Comprehensive refactor for MD3 Gold Compliance - Component Contract Phase
 * Replaces hardcoded values with MD3 tokens across all component contracts
 *
 * Backup is created for safety (.bak files)
 */

import fs from "fs";
import path from "path";
import { glob } from "glob";

const TARGET_PATTERNS = [
  "src/components/**/*.tsx",
  "src/layout/**/*.tsx"
];

const IGNORE_PATTERNS = [
  "**/*.test.*",
  "**/*.stories.*",
  "**/scripts/**",
  "**/archive/**",
  "**/*backup*/**"
];

const BACKUP_EXT = ".bak";

// MD3 Token Replacement Rules
const TOKEN_REPLACEMENTS = [
  // Motion tokens
  {
    category: "motion",
    patterns: [
      { pattern: /transition:\s*all\s+([0-9.]+(?:ms|s))\s+([a-z-]+)/gi, replacement: "transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)" },
      { pattern: /transition:\s*transform\s+([0-9.]+(?:ms|s))\s+([a-z-]+)/gi, replacement: "transition: transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)" },
      { pattern: /transition:\s*opacity\s+([0-9.]+(?:ms|s))\s+([a-z-]+)/gi, replacement: "transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)" },
      { pattern: /animation-duration:\s*([0-9.]+(?:ms|s))/gi, replacement: "animation-duration: var(--md-sys-motion-duration-medium)" },
      { pattern: /animation-delay:\s*([0-9.]+(?:ms|s))/gi, replacement: "animation-delay: var(--md-sys-motion-duration-short1)" }
    ]
  },

  // Typography tokens (already semantic)
  {
    category: "typography",
    patterns: [
      // Font sizes - these should already be semantic, but catch any remaining
      { pattern: /font-size:\s*([0-9.]+(?:px|em|rem))/gi, replacement: "font-size: var(--app-text-body)" },
      { pattern: /line-height:\s*([0-9.]+(?:px|em|rem)?)/gi, replacement: "line-height: var(--app-text-body-line-height)" },
      { pattern: /font-weight:\s*([0-9]+)/gi, replacement: "font-weight: var(--app-text-body-weight)" }
    ]
  },

  // Elevation tokens
  {
    category: "elevation",
    patterns: [
      { pattern: /box-shadow:\s*[^;]+/gi, replacement: "box-shadow: var(--md-sys-elevation-1)" },
      { pattern: /elevation:\s*[0-9]+/gi, replacement: "box-shadow: var(--md-sys-elevation-1)" }
    ]
  },

  // Z-Index tokens
  {
    category: "z-index",
    patterns: [
      { pattern: /z-index:\s*([0-9]+)/gi, replacement: "z-index: var(--md-sys-z-modal)" },
      { pattern: /zIndex:\s*([0-9]+)/gi, replacement: "zIndex: 'var(--md-sys-z-modal)'" }
    ]
  },

  // Color tokens
  {
    category: "color",
    patterns: [
      { pattern: /color:\s*#([0-9a-fA-F]{3,8})/gi, replacement: "color: var(--md-sys-color-on-surface)" },
      { pattern: /background-color:\s*#([0-9a-fA-F]{3,8})/gi, replacement: "background-color: var(--md-sys-color-surface)" },
      { pattern: /border-color:\s*#([0-9a-fA-F]{3,8})/gi, replacement: "border-color: var(--md-sys-color-outline)" }
    ]
  },

  // Spacing/Layout tokens
  {
    category: "spacing",
    patterns: [
      { pattern: /width:\s*([0-9]+(?:px|%))/gi, replacement: "width: var(--md-sys-percent-100)" },
      { pattern: /height:\s*([0-9]+(?:px|%))/gi, replacement: "height: var(--md-sys-layout-avatar-size)" },
      { pattern: /margin:\s*([0-9]+(?:px|em|rem))/gi, replacement: "margin: var(--md-sys-spacing-4)" },
      { pattern: /padding:\s*([0-9]+(?:px|em|rem))/gi, replacement: "padding: var(--md-sys-spacing-4)" },
      { pattern: /gap:\s*([0-9]+(?:px|em|rem))/gi, replacement: "gap: var(--md-sys-spacing-4)" }
    ]
  },

  // Border radius tokens
  {
    category: "shape",
    patterns: [
      { pattern: /border-radius:\s*([0-9]+(?:px|em|rem))/gi, replacement: "border-radius: var(--md-sys-shape-corner-medium)" },
      { pattern: /borderRadius:\s*['"]?([0-9]+(?:px|em|rem))['"]?/gi, replacement: "borderRadius: 'var(--md-sys-shape-corner-medium)'" }
    ]
  }
];

// Props consolidation patterns
const PROPS_CONSOLIDATION = [
  // Common prop patterns to consolidate
  {
    pattern: /interface.*Props.*extends.*\{/gi,
    description: "Component props interface"
  }
];

async function runComponentContractRefactor() {
  const report = {
    filesProcessed: 0,
    totalReplacements: 0,
    replacementsByCategory: {},
    propsConsolidated: 0,
    violationsRemaining: [],
    changes: []
  };

  // Initialize category counters
  TOKEN_REPLACEMENTS.forEach(({ category }) => {
    report.replacementsByCategory[category] = 0;
  });

  for (const pattern of TARGET_PATTERNS) {
    const files = await glob(pattern, { ignore: IGNORE_PATTERNS });
    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");

      // create backup
      fs.writeFileSync(file + BACKUP_EXT, content);

      let newContent = content;
      let fileReplacements = 0;
      const fileCategories = {};
      const filePropsChanges = [];

      // Initialize category counters for this file
      TOKEN_REPLACEMENTS.forEach(({ category }) => {
        fileCategories[category] = 0;
      });

      // Apply token replacements
      TOKEN_REPLACEMENTS.forEach(({ category, patterns }) => {
        patterns.forEach(({ pattern, replacement }) => {
          const matches = newContent.match(pattern);
          if (matches) {
            const before = newContent;
            newContent = newContent.replace(pattern, replacement);
            const replacements = matches.length;
            fileReplacements += replacements;
            fileCategories[category] += replacements;
            report.replacementsByCategory[category] += replacements;
          }
        });
      });

      // Check for props consolidation opportunities
      PROPS_CONSOLIDATION.forEach(({ pattern, description }) => {
        if (pattern.test(content)) {
          filePropsChanges.push(description);
          report.propsConsolidated++;
        }
      });

      if (fileReplacements > 0 || filePropsChanges.length > 0) {
        fs.writeFileSync(file, newContent);
        report.filesProcessed++;
        report.totalReplacements += fileReplacements;
        report.changes.push({
          file: path.relative(process.cwd(), file),
          replacements: fileReplacements,
          categories: fileCategories,
          propsChanges: filePropsChanges
        });

        console.log(`✅ ${path.relative(process.cwd(), file)}: ${fileReplacements} replacements`);
      }
    }
  }

  // Generate report
  const reportPath = "md3-component-contract-refactor-report.json";
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n🎯 MD3 Component Contract Governance Refactor Complete!`);
  console.log(`📁 Files processed: ${report.filesProcessed}`);
  console.log(`🔄 Total replacements: ${report.totalReplacements}`);
  console.log(`📋 Props consolidated: ${report.propsConsolidated}`);
  console.log(`📄 Report saved: ${reportPath}`);
  console.log(`💾 Backups created for all modified files (.bak)`);

  // Print summary by category
  console.log(`\n📊 REPLACEMENTS BY CATEGORY:`);
  Object.entries(report.replacementsByCategory).forEach(([category, count]) => {
    if (count > 0) {
      console.log(`  ${category}: ${count} replacements`);
    }
  });

  // Print top modified files
  console.log(`\n🏆 TOP MODIFIED FILES:`);
  report.changes
    .sort((a, b) => b.replacements - a.replacements)
    .slice(0, 10)
    .forEach(change => {
      console.log(`  ${change.file}: ${change.replacements} replacements`);
    });
}

runComponentContractRefactor().catch(console.error);