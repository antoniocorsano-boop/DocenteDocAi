/**
 * Fix stripped empty-attribute elements in TSX files.
 * `<div >` → `<div>` (removes dangling space, makes the empty-attribute indicator clear)
 * This is a safe cleanup pass — actual layout styles are added file by file.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const TAGS = 'div|section|header|footer|main|aside|nav|article|span|p|h1|h2|h3|h4|h5|h6|button|form|label|ul|li|ol|table|tr|td|th|a|figure|figcaption|summary|details';
const PATTERN = new RegExp(`<(${TAGS}) >`, 'g');

function findFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    try {
      const stat = statSync(full);
      if (stat.isDirectory()) {
        if (!['node_modules', 'dist', 'build', '.git', 'archive'].some(d => entry === d)) {
          results.push(...findFiles(full));
        }
      } else if ((full.endsWith('.tsx') || full.endsWith('.jsx')) && !full.includes('.stories.') && !full.includes('.spec.') && !full.includes('.test.')) {
        const content = readFileSync(full, 'utf-8');
        if (PATTERN.test(content)) {
          PATTERN.lastIndex = 0;
          results.push(full);
        }
      }
    } catch { /* skip */ }
  }
  return results;
}

const files = findFiles('src');
console.log(`Found ${files.length} files with empty-attribute elements\n`);

let totalFixed = 0;
for (const file of files) {
  let content = readFileSync(file, 'utf-8');
  const original = content;
  content = content.replace(PATTERN, '<$1>');
  if (content !== original) {
    const count = (original.match(PATTERN) || []).length;
    writeFileSync(file, content, 'utf-8');
    console.log(`  ${file.replace('C:\\Users\\anton\\DocenteDocAI\\DocenteDocAi\\', '')}: ${count} cleaned`);
    totalFixed += count;
  }
}

console.log(`\nTotal: ${totalFixed} empty attributes cleaned across ${files.length} files`);
