/**
 * Reverse the incorrect var(--md-sys-percent-100) → '100%' replacement.
 * The token var(--md-sys-percent-100) is the correct MD3 compliant form.
 * Only '100%' inside TSX inline style strings should be reverted.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function findFiles(dir, ext) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    try {
      const stat = statSync(full);
      if (stat.isDirectory()) results.push(...findFiles(full, ext));
      else if (full.endsWith(ext)) {
        results.push(full);
      }
    } catch { /* skip */ }
  }
  return results;
}

const files = findFiles('src', '.tsx');

// These are the exact string patterns that appear in TSX inline styles
// We replace specific quoted '100%' occurrences that were MD3 tokens
const replacements = [
  ["'100%'", "'var(--md-sys-percent-100)'"],
  ['"100%"', '"var(--md-sys-percent-100)"'],
];

let totalReplacements = 0;
let filesChanged = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf-8');
  let fileReplacements = 0;
  
  for (const [search, replace] of replacements) {
    const count = content.split(search).length - 1;
    if (count > 0) {
      content = content.replaceAll(search, replace);
      fileReplacements += count;
    }
  }
  
  if (fileReplacements > 0) {
    writeFileSync(file, content, 'utf-8');
    console.log(`  ${file}: ${fileReplacements} replacements`);
    totalReplacements += fileReplacements;
    filesChanged++;
  }
}

console.log(`\nTotal: ${totalReplacements} replacements across ${filesChanged} files`);
