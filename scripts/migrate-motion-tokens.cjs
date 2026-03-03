#!/usr/bin/env node
/**
 * Migration script: Replace --motion-duration-* and --motion-easing-* bridges 
 * with direct --md-sys-motion-* canonical tokens across CSS/TSX files.
 * 
 * Run: node scripts/migrate-motion-tokens.cjs
 */

const fs = require('fs');
const path = require('path');

// Bridge → canonical mapping (reverse alias resolution)
const MOTION_REPLACEMENTS = [
  // Duration aliases
  [/var\(--motion-duration-short1\)/g, 'var(--md-sys-motion-duration-short)'],
  [/var\(--motion-duration-short2\)/g, 'var(--md-sys-motion-duration-short2)'],
  [/var\(--motion-duration-short3\)/g, 'var(--md-sys-motion-duration-medium)'],
  [/var\(--motion-duration-short4\)/g, 'var(--md-sys-motion-duration-short4)'],
  [/var\(--motion-duration-medium1\)/g, 'var(--md-sys-motion-duration-medium)'],
  [/var\(--motion-duration-medium2\)/g, 'var(--md-sys-motion-duration-long)'],
  [/var\(--motion-duration-medium3\)/g, 'var(--md-sys-motion-duration-long)'],
  [/var\(--motion-duration-medium4\)/g, 'var(--md-sys-motion-duration-long)'],
  [/var\(--motion-duration-long1\)/g, 'var(--md-sys-motion-duration-long)'],
  [/var\(--motion-duration-long2\)/g, 'var(--md-sys-motion-duration-extra-long)'],
  [/var\(--motion-duration-long3\)/g, 'var(--md-sys-motion-duration-extra-long)'],
  [/var\(--motion-duration-long4\)/g, 'var(--md-sys-motion-duration-extra-long)'],
  // Easing aliases
  [/var\(--motion-easing-standard\)/g, 'var(--md-sys-motion-easing-standard)'],
  [/var\(--motion-easing-decelerate\)/g, 'var(--md-sys-motion-easing-decelerated)'],
  [/var\(--motion-easing-accelerate\)/g, 'var(--md-sys-motion-easing-accelerated)'],
  [/var\(--motion-easing-emphasized\)/g, 'var(--md-sys-motion-easing-emphasized)'],
];

const TARGET_EXTENSIONS = ['.css', '.tsx', '.ts'];
const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build', 'archive'];

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
      results.push(fullPath);
    }
  }
  return results;
}

const srcDir = path.join(__dirname, '..', 'src');
const files = walk(srcDir);
let totalReplacements = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  let fileReplacements = 0;

  for (const [pattern, replacement] of MOTION_REPLACEMENTS) {
    const before = content;
    content = content.replace(pattern, replacement);
    if (content !== before) {
      const count = (before.match(pattern) || []).length;
      fileReplacements += count;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`  ✅ ${path.relative(path.join(__dirname, '..'), file)} — ${fileReplacements} replacements`);
    totalReplacements += fileReplacements;
  }
}

console.log(`\n✅ Done: ${totalReplacements} motion token replacements across ${files.length} files`);
