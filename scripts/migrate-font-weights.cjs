#!/usr/bin/env node
/**
 * Migration script: Replace hardcoded font-weight values with MD3 typescale weight tokens.
 * 
 * Run: node scripts/migrate-font-weights.cjs
 * 
 * NOTE: Only replaces STANDALONE font-weight declarations (not inside font shorthand).
 * Only targets CSS files.
 */

const fs = require('fs');
const path = require('path');

// Weight value → MD3 token mapping
const WEIGHT_MAP = {
  '900': 'var(--md-sys-typescale-weight-black)',
  '800': 'var(--md-sys-typescale-weight-extrabold)',
  '700': 'var(--md-sys-typescale-weight-bold)',
  '600': 'var(--md-sys-typescale-weight-semibold)',
  '500': 'var(--md-sys-typescale-weight-medium)',
  '400': 'var(--md-sys-typescale-weight-regular)',
  '300': 'var(--md-sys-typescale-weight-light)',
  'bold': 'var(--md-sys-typescale-weight-bold)',
  'semibold': 'var(--md-sys-typescale-weight-semibold)',
  'normal': 'var(--md-sys-typescale-weight-regular)',
};

// Only patch standalone font-weight declarations in CSS files
// Pattern: font-weight: <value>; (not inside font: shorthand)
const WEIGHT_PATTERN = /font-weight:\s*(900|800|700|600|500|400|300|bold|semibold|normal)\s*;/g;

const TARGET_EXTENSIONS = ['.css'];
const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build', 'archive'];
// Skip files that are legitimate token source files
const SKIP_FILES = [
  'theme.css', // token definitions — do not replace
];

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (EXCLUDED_DIRS.includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...walk(fullPath));
    } else if (TARGET_EXTENSIONS.includes(path.extname(file))) {
      if (!SKIP_FILES.includes(path.basename(file))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const srcDir = path.join(__dirname, '..', 'src');
const files = walk(srcDir);
let totalReplacements = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let fileReplacements = 0;

  const newContent = content.replace(WEIGHT_PATTERN, (match, value) => {
    const token = WEIGHT_MAP[value];
    if (token) {
      fileReplacements++;
      return `font-weight: ${token};`;
    }
    return match;
  });

  if (fileReplacements > 0) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`  ✅ ${path.relative(path.join(__dirname, '..'), file)} — ${fileReplacements} replacements`);
    totalReplacements += fileReplacements;
  }
}

console.log(`\n✅ Done: ${totalReplacements} font-weight replacements`);
