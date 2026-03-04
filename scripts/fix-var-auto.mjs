/**
 * Fix additional invalid CSS patterns left by botched MD3 migration:
 * - 'var(auto)' → 'auto'
 * - 'var(--md-sys-percent-100)' → '100%'
 * - '"var(auto)"' → '"auto"' (double-quoted version)
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
        const content = readFileSync(full, 'utf-8');
        if (content.includes('var(auto)') || content.includes('var(--md-sys-percent-100)')) {
          results.push(full);
        }
      }
    } catch { /* skip */ }
  }
  return results;
}

const files = findFiles('src', '.tsx');

console.log(`Found ${files.length} files with invalid patterns:\n`);

const replacements = [
  // Replace var(auto) → auto anywhere in the source (inside strings, shorthand etc.)
  ['var(auto)', 'auto'],
  // Replace var(--md-sys-percent-100) → 100%
  ['var(--md-sys-percent-100)', '100%'],
];

let totalReplacements = 0;

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
  }
}

console.log(`\nTotal: ${totalReplacements} replacements across ${files.length} files`);
