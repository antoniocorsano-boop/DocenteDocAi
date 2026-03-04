/**
 * fix-bare-divs.mjs
 * Heuristically adds MD3 inline styles to bare <div>, <header>, <section>,
 * <main>, <aside>, <article> elements that have no style or className props.
 *
 * Rules:
 * - <div> on its own line → add style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}
 *   UNLESS the next sibling or child looks like a horizontal item (icon + text pattern)
 *   → then use flexDirection: 'row', alignItems: 'center'
 * - <header> → flex row, align center, justify between
 * - <section> → flex column, gap 4
 * - <main> → flex column, flex 1, overflow hidden
 *
 * Skips files that already had replacements made (StudentProfile, LessonView, UdaPlanner, OperationsCenter, CurriculumManager)
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SKIP_FILES = new Set([
  'StudentProfile.tsx',
  'LessonView.tsx',
  'UdaPlanner.tsx',
  'OperationsCenter.tsx',
  'CurriculumManager.tsx',
]);

const SRC = 'src/components';
const files = readdirSync(SRC).filter(f => f.endsWith('.tsx') && !SKIP_FILES.has(f));

// Regex: matches a bare tag with NO props (no style, no className, nothing)
// Captures: indent, tagName
const BARE_TAG_RE = /^([ \t]*)<(div|section|header|main|aside|article)>(\s*)$/;

let totalFixed = 0;
let filesFixed = 0;

for (const filename of files) {
  const filePath = join(SRC, filename);
  const original = readFileSync(filePath, 'utf8');
  const lines = original.split('\n');
  
  let changed = false;
  const out = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = BARE_TAG_RE.exec(line);
    
    if (!m) {
      out.push(line);
      continue;
    }
    
    const indent = m[1];
    const tag = m[2];
    
    // Look ahead to determine layout direction
    // Check next non-empty line content
    let nextContent = '';
    for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
      const nl = lines[j].trim();
      if (nl) { nextContent = nl; break; }
    }
    
    // Look at previous context to determine semantic meaning
    let prevContent = '';
    for (let j = i - 1; j >= Math.max(i - 5, 0); j--) {
      const pl = lines[j].trim();
      if (pl && !pl.startsWith('//') && !pl.startsWith('{/*')) { prevContent = pl; break; }
    }
    
    let style = '';
    
    if (tag === 'header') {
      style = `style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--md-sys-spacing-4) var(--md-sys-spacing-6)', backgroundColor: 'var(--md-sys-color-surface-container-low)', borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' }}`;
    } else if (tag === 'section' || tag === 'main' || tag === 'aside' || tag === 'article') {
      style = `style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}`;
    } else {
      // div — determine if it's a row or column
      // Heuristics for ROW layouts:
      // - Next element is a span with icon + text (short text like material icons)
      // - Contains "Actions", "Header", "Row", "Buttons" in context
      // - Has siblings with no block children
      const isRowHint = 
        (nextContent.match(/^<span[> ]/) && nextContent.length < 80) ||
        prevContent.includes('SectionHeader') ||
        prevContent.includes('Actions') ||
        prevContent.toLowerCase().includes('actions') ||
        nextContent.includes('M3Button') ||
        (nextContent.startsWith('<M3Button') && !nextContent.includes('onClick={handleNew'));
      
      const isColumnHint =
        nextContent.startsWith('<div') ||
        nextContent.startsWith('<section') ||
        nextContent.startsWith('<InfoCard') ||
        nextContent.startsWith('<M3List') ||
        nextContent.startsWith('{') ||
        nextContent.startsWith('<EmptyState');
      
      if (isRowHint && !isColumnHint) {
        style = `style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}`;
      } else {
        style = `style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}`;
      }
    }
    
    out.push(`${indent}<${tag} ${style}>`);
    changed = true;
    totalFixed++;
  }
  
  if (changed) {
    writeFileSync(filePath, out.join('\n'), 'utf8');
    filesFixed++;
    console.log(`Fixed ${filename}`);
  }
}

console.log(`\nTotal: ${totalFixed} bare tags fixed across ${filesFixed} files.`);
