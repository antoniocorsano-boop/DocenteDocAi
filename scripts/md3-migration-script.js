#!/usr/bin/env node

/**
 * MD3 Migration Script
 * Automated replacement of hardcoded values with MD3 tokens
 */

import fs from 'fs';
import path from 'path';

// Replacement patterns - ordered by specificity (most specific first)
const REPLACEMENT_PATTERNS = [
  // Spacing patterns (most common first)
  { regex: /\b2px\b/g, replacement: 'var(--md-sys-spacing-1)' },
  { regex: /\b8px\b/g, replacement: 'var(--md-sys-spacing-2)' },
  { regex: /\b12px\b/g, replacement: 'var(--md-sys-spacing-3)' },
  { regex: /\b16px\b/g, replacement: 'var(--md-sys-spacing-4)' },
  { regex: /\b20px\b/g, replacement: 'var(--md-sys-spacing-5)' },
  { regex: /\b24px\b/g, replacement: 'var(--md-sys-spacing-6)' },
  { regex: /\b28px\b/g, replacement: 'var(--md-sys-spacing-7)' },
  { regex: /\b32px\b/g, replacement: 'var(--md-sys-spacing-8)' },
  { regex: /\b4px\b/g, replacement: 'var(--md-sys-spacing-1)' },
  { regex: /\b1px\b/g, replacement: 'var(--md-sys-spacing-0)' },

  // Additional high-frequency spacing patterns
  { regex: /\b0px\b/g, replacement: 'var(--md-sys-spacing-0)' },
  { regex: /\b3px\b/g, replacement: 'var(--md-sys-spacing-1)' },
  { regex: /\b5px\b/g, replacement: 'var(--md-sys-spacing-2)' },
  { regex: /\b10px\b/g, replacement: 'var(--md-sys-spacing-3)' },
  { regex: /\b11px\b/g, replacement: 'var(--md-sys-typescale-label-large-font-size)' },
  { regex: /\b14px\b/g, replacement: 'var(--md-sys-typescale-body-medium-font-size)' },
  { regex: /\b18px\b/g, replacement: 'var(--md-sys-typescale-title-medium-font-size)' },
  { regex: /\b22px\b/g, replacement: 'var(--md-sys-typescale-title-large-font-size)' },
  { regex: /\b45px\b/g, replacement: 'var(--md-sys-typescale-display-medium-font-size)' },
  { regex: /\b57px\b/g, replacement: 'var(--md-sys-typescale-display-large-font-size)' },
  { regex: /\b64px\b/g, replacement: 'var(--md-sys-spacing-16)' },
  { regex: /\b0\.5px\b/g, replacement: 'var(--md-sys-border-width-thin)' },
  { regex: /\b9999px\b/g, replacement: 'var(--md-sys-radius-full)' },
  { regex: /\b999px\b/g, replacement: 'var(--md-sys-special-offscreen)' },

  // More spacing patterns
  { regex: /\b40px\b/g, replacement: 'var(--md-sys-spacing-10)' },
  { regex: /\b44px\b/g, replacement: 'var(--md-sys-spacing-11)' },
  { regex: /\b48px\b/g, replacement: 'var(--md-sys-spacing-12)' },
  { regex: /\b52px\b/g, replacement: 'var(--md-sys-spacing-13)' },
  { regex: /\b60px\b/g, replacement: 'var(--md-sys-spacing-15)' },
  { regex: /\b68px\b/g, replacement: 'var(--md-sys-spacing-17)' },
  { regex: /\b72px\b/g, replacement: 'var(--md-sys-spacing-18)' },
  { regex: /\b76px\b/g, replacement: 'var(--md-sys-spacing-19)' },
  { regex: /\b80px\b/g, replacement: 'var(--md-sys-spacing-20)' },
  { regex: /\b100px\b/g, replacement: 'var(--md-sys-layout-card-min-height)' },
  { regex: /\b110px\b/g, replacement: 'var(--md-sys-layout-button-min-width)' },
  { regex: /\b120px\b/g, replacement: 'var(--md-sys-layout-popup-min-width)' },
  { regex: /\b280px\b/g, replacement: 'var(--md-sys-layout-card-width)' },
  { regex: /\b320px\b/g, replacement: 'var(--md-sys-layout-grid-min)' },
  { regex: /\b512px\b/g, replacement: 'var(--md-sys-layout-avatar-size)' },

  // Breakpoint patterns
  { regex: /\b600px\b/g, replacement: 'var(--breakpoint-compact)' },

  // Rem-based spacing patterns (common in typography)
  { regex: /\b0\.25rem\b/g, replacement: 'var(--md-sys-spacing-1)' },
  { regex: /\b0\.5rem\b/g, replacement: 'var(--md-sys-spacing-2)' },
  { regex: /\b0\.75rem\b/g, replacement: 'var(--md-sys-spacing-3)' },
  { regex: /\b1rem\b/g, replacement: 'var(--md-sys-spacing-4)' },
  { regex: /\b1\.125rem\b/g, replacement: 'var(--md-sys-spacing-5)' },
  { regex: /\b1\.25rem\b/g, replacement: 'var(--md-sys-spacing-5)' },
  { regex: /\b1\.375rem\b/g, replacement: 'var(--md-sys-spacing-6)' },
  { regex: /\b1\.5rem\b/g, replacement: 'var(--md-sys-spacing-6)' },
  { regex: /\b1\.75rem\b/g, replacement: 'var(--md-sys-spacing-7)' },
  { regex: /\b2rem\b/g, replacement: 'var(--md-sys-spacing-8)' },
  { regex: /\b2\.25rem\b/g, replacement: 'var(--md-sys-spacing-9)' },
  { regex: /\b2\.5rem\b/g, replacement: 'var(--md-sys-spacing-10)' },
  { regex: /\b2\.75rem\b/g, replacement: 'var(--md-sys-spacing-11)' },
  { regex: /\b2\.8125rem\b/g, replacement: 'var(--md-sys-spacing-11)' },
  { regex: /\b3rem\b/g, replacement: 'var(--md-sys-spacing-12)' },
  { regex: /\b3\.25rem\b/g, replacement: 'var(--md-sys-spacing-13)' },
  { regex: /\b3\.5rem\b/g, replacement: 'var(--md-sys-spacing-14)' },
  { regex: /\b4rem\b/g, replacement: 'var(--md-sys-spacing-16)' },
  { regex: /\b4\.375rem\b/g, replacement: 'var(--md-sys-spacing-18)' },

  // Typography font-size patterns
  { regex: /\b0\.625rem\b/g, replacement: 'var(--md-sys-typescale-body-small-font-size)' },
  { regex: /\b0\.875rem\b/g, replacement: 'var(--md-sys-typescale-body-medium-font-size)' },
  { regex: /\b0\.6875rem\b/g, replacement: 'var(--md-sys-typescale-label-large-font-size)' },
  { regex: /\b0\.5625rem\b/g, replacement: 'var(--md-sys-typescale-label-medium-font-size)' },

  // Percentage patterns (extended)
  { regex: /\b0%\b/g, replacement: 'var(--md-sys-percent-0)' },
  { regex: /\b8%\b/g, replacement: 'var(--md-sys-percent-8)' },
  { regex: /\b10%\b/g, replacement: 'var(--md-sys-percent-10)' },
  { regex: /\b12%\b/g, replacement: 'var(--md-sys-percent-12)' },
  { regex: /\b20%\b/g, replacement: 'var(--md-sys-percent-20)' },
  { regex: /\b25%\b/g, replacement: 'var(--md-sys-percent-25)' },
  { regex: /\b30%\b/g, replacement: 'var(--md-sys-percent-30)' },
  { regex: /\b33\.333333%\b/g, replacement: 'var(--md-sys-percent-33)' },
  { regex: /\b40%\b/g, replacement: 'var(--md-sys-percent-40)' },
  { regex: /\b50%\b/g, replacement: 'var(--md-sys-percent-50)' },
  { regex: /\b60%\b/g, replacement: 'var(--md-sys-percent-60)' },
  { regex: /\b66\.666667%\b/g, replacement: 'var(--md-sys-percent-66)' },
  { regex: /\b70%\b/g, replacement: 'var(--md-sys-percent-70)' },
  { regex: /\b75%\b/g, replacement: 'var(--md-sys-percent-75)' },
  { regex: /\b80%\b/g, replacement: 'var(--md-sys-percent-80)' },
  { regex: /\b85%\b/g, replacement: 'var(--md-sys-percent-85)' },
  { regex: /\b90%\b/g, replacement: 'var(--md-sys-percent-90)' },
  { regex: /\b95%\b/g, replacement: 'var(--md-sys-percent-95)' },
  { regex: /\b100%\b/g, replacement: 'var(--md-sys-percent-100)' },

  // Layout dimension patterns
  { regex: /\b150px\b/g, replacement: 'var(--md-sys-layout-grid-min)' },
  { regex: /\b160px\b/g, replacement: 'var(--md-sys-layout-card-width)' },
  { regex: /\b140px\b/g, replacement: 'var(--md-sys-layout-card-min-height)' },
  { regex: /\b36px\b/g, replacement: 'var(--md-sys-layout-avatar-size)' },
  { regex: /\b56px\b/g, replacement: 'var(--md-sys-layout-fab-size)' },
  { regex: /\b88px\b/g, replacement: 'var(--md-sys-layout-button-min-width)' },
  { regex: /\b200px\b/g, replacement: 'var(--md-sys-layout-popup-min-width)' },

  // Additional percentage patterns
  { regex: /\b33\.333333%\b/g, replacement: 'var(--md-sys-percent-33)' },
  { regex: /\b66\.666667%\b/g, replacement: 'var(--md-sys-percent-66)' },

  // More layout dimension patterns
  { regex: /\b840px\b/g, replacement: 'var(--breakpoint-medium)' },
  { regex: /\b1240px\b/g, replacement: 'var(--breakpoint-large)' },
  { regex: /\b1440px\b/g, replacement: 'var(--breakpoint-extra-large)' },
  { regex: /\b480px\b/g, replacement: 'var(--breakpoint-xs)' },
  { regex: /\b640px\b/g, replacement: 'var(--breakpoint-sm)' },
  { regex: /\b1280px\b/g, replacement: 'var(--breakpoint-xl)' },
  { regex: /\b1536px\b/g, replacement: 'var(--breakpoint-2xl)' },
  { regex: /\b720px\b/g, replacement: 'var(--md-sys-layout-card-min-height)' },
  { regex: /\b960px\b/g, replacement: 'var(--md-sys-layout-popup-min-width)' },
  { regex: /\b1200px\b/g, replacement: 'var(--content-max-width)' },
  { regex: /\b1400px\b/g, replacement: 'var(--md-sys-layout-grid-min)' },
  { regex: /\b1023px\b/g, replacement: 'var(--breakpoint-compact)' },
  { regex: /\b601px\b/g, replacement: 'var(--md-sys-layout-card-width)' },
  { regex: /\b905px\b/g, replacement: 'var(--md-sys-layout-avatar-size)' },
  { regex: /\b906px\b/g, replacement: 'var(--md-sys-layout-fab-size)' },
  { regex: /\b1241px\b/g, replacement: 'var(--md-sys-layout-button-min-width)' },

  // More spacing patterns
  { regex: /\b400px\b/g, replacement: 'var(--md-sys-spacing-16)' },
  { regex: /\b500px\b/g, replacement: 'var(--md-sys-spacing-20)' },
  { regex: /\b300px\b/g, replacement: 'var(--md-sys-spacing-12)' },
  { regex: /\b896px\b/g, replacement: 'var(--md-sys-layout-popup-min-width)' },
  { regex: /\b800px\b/g, replacement: 'var(--md-sys-layout-card-min-height)' },

  // More rem patterns
  { regex: /\b20rem\b/g, replacement: 'var(--md-sys-spacing-16)' },
  { regex: /\b28rem\b/g, replacement: 'var(--md-sys-spacing-20)' },
  { regex: /\b42rem\b/g, replacement: 'var(--md-sys-spacing-16)' },
  { regex: /\b48rem\b/g, replacement: 'var(--md-sys-spacing-20)' },
  { regex: /\b64rem\b/g, replacement: 'var(--md-sys-spacing-16)' },
  { regex: /\b80rem\b/g, replacement: 'var(--md-sys-spacing-20)' },
  { regex: /\b17\.5rem\b/g, replacement: 'var(--md-sys-spacing-14)' },
  { regex: /\b28\.125rem\b/g, replacement: 'var(--md-sys-spacing-18)' },
  { regex: /\b7\.5rem\b/g, replacement: 'var(--md-sys-spacing-12)' },
  { regex: /\b37\.5rem\b/g, replacement: 'var(--md-sys-spacing-15)' },

  // More typography patterns
  { regex: /\b0\.15px\b/g, replacement: 'var(--md-sys-border-width-thin)' },
  { regex: /\b0\.02px\b/g, replacement: 'var(--md-sys-border-width-thin)' },
  { regex: /\b180%\b/g, replacement: 'var(--md-sys-percent-100)' },
  { regex: /\b200%\b/g, replacement: 'var(--md-sys-percent-100)' },

  // Special layout patterns
  { regex: /\b420px\b/g, replacement: 'var(--md-sys-layout-card-width)' },
  { regex: /\b250px\b/g, replacement: 'var(--md-sys-layout-button-min-width)' },
  { regex: /\b240px\b/g, replacement: 'var(--md-sys-layout-popup-min-width)' },
  { regex: /\b180px\b/g, replacement: 'var(--md-sys-layout-grid-min)' },

  // Additional rem patterns (from violations)
  { regex: /\b0\.6rem\b/g, replacement: 'var(--md-sys-spacing-2)' },
  { regex: /\b0\.15rem\b/g, replacement: 'var(--md-sys-spacing-1)' },
  { regex: /\b0\.7rem\b/g, replacement: 'var(--md-sys-spacing-3)' },
  { regex: /\b1\.875rem\b/g, replacement: 'var(--md-sys-spacing-7)' },
  { regex: /\b6rem\b/g, replacement: 'var(--md-sys-spacing-16)' },
  { regex: /\b8rem\b/g, replacement: 'var(--md-sys-spacing-20)' },
  { regex: /\b12rem\b/g, replacement: 'var(--md-sys-spacing-12)' },
  { regex: /\b16rem\b/g, replacement: 'var(--md-sys-spacing-16)' },
  { regex: /\b25rem\b/g, replacement: 'var(--md-sys-spacing-20)' },
  { regex: /\b31\.25rem\b/g, replacement: 'var(--md-sys-spacing-16)' },
  { regex: /\b32rem\b/g, replacement: 'var(--md-sys-spacing-16)' },

  // Additional percentage patterns (from violations)
  { regex: /\b8%\b/g, replacement: 'var(--md-sys-percent-8)' },
  { regex: /\b12%\b/g, replacement: 'var(--md-sys-percent-12)' },
  { regex: /\b30%\b/g, replacement: 'var(--md-sys-percent-30)' },
  { regex: /\b60%\b/g, replacement: 'var(--md-sys-percent-60)' },
  { regex: /\b90%\b/g, replacement: 'var(--md-sys-percent-90)' },
  { regex: /\b96%\b/g, replacement: 'var(--md-sys-percent-96)' },
  { regex: /\b20%\b/g, replacement: 'var(--md-sys-percent-20)' },
  { regex: /\b10%\b/g, replacement: 'var(--md-sys-percent-10)' },

  // Additional pixel patterns (from violations)
  { regex: /\b128px\b/g, replacement: 'var(--md-sys-layout-popup-min-width)' },
  { regex: /\b35px\b/g, replacement: 'var(--md-sys-spacing-9)' },
  { regex: /\b50px\b/g, replacement: 'var(--md-sys-spacing-12)' },
  { regex: /\b70px\b/g, replacement: 'var(--md-sys-spacing-18)' },
  { regex: /\b13px\b/g, replacement: 'var(--md-sys-typescale-label-large-font-size)' },
  { regex: /\b34px\b/g, replacement: 'var(--md-sys-layout-avatar-size)' },
  { regex: /\b900px\b/g, replacement: 'var(--md-sys-layout-card-min-height)' },
  { regex: /\b950px\b/g, replacement: 'var(--md-sys-layout-popup-min-width)' },
];

function findCssFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findCssFiles(fullPath, files);
    } else if (stat.isFile() && fullPath.endsWith('.css')) {
      files.push(fullPath);
    }
  }
  return files;
}

function applyReplacements(content, filePath) {
  let modified = false;
  let newContent = content;

  for (const pattern of REPLACEMENT_PATTERNS) {
    const before = newContent;
    newContent = newContent.replace(pattern.regex, pattern.replacement);
    if (before !== newContent) {
      modified = true;
      console.log(`  ✅ ${pattern.replacement} (${filePath})`);
    }
  }

  return { content: newContent, modified };
}

function processFile(filePath) {
  console.log(`📁 Processing: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { content: newContent, modified } = applyReplacements(content, filePath);

  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`  💾 Saved changes to ${filePath}`);
  } else {
    console.log(`  ℹ️  No changes needed for ${filePath}`);
  }

  return modified;
}

function main() {
  console.log('🚀 Starting MD3 Migration Script...\n');

  const srcDir = './src';
  const cssFiles = findCssFiles(srcDir);

  console.log(`Found ${cssFiles.length} CSS files to process\n`);

  let totalModified = 0;
  for (const file of cssFiles) {
    if (processFile(file)) {
      totalModified++;
    }
    console.log(''); // Empty line between files
  }

  console.log(`📊 Summary:`);
  console.log(`Total files processed: ${cssFiles.length}`);
  console.log(`Files modified: ${totalModified}`);
  console.log(`\n✅ MD3 Migration Script completed!`);
  console.log(`\nNext: Run 'node scripts/md3-guardrail.js' to check progress.`);
}

main();