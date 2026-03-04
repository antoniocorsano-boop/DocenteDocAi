/**
 * Fix invalid `sys.colors.*` references left by botched MD3 migration.
 * These are JS expressions (evaluate to NaN/undefined), not valid CSS values.
 * Replaces them with proper `var(--md-sys-color-*)` tokens.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function findTsxFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) results.push(...findTsxFiles(full));
    else if (full.endsWith('.tsx')) {
      const content = readFileSync(full, 'utf-8');
      if (content.includes('sys.colors.')) results.push(full);
    }
  }
  return results;
}

const files = findTsxFiles('src/components');

console.log(`Found ${files.length} files with sys.colors references:\n`);

// Ordered replacements: longer patterns first to avoid partial matches
const replacements = [
  // Opacity variants (color/opacity) — must come before simple color names
  // primary variants
  ['sys.colors.primaryContainer/30', "'color-mix(in srgb, var(--md-sys-color-primary-container) 30%, transparent)'"],
  ['sys.colors.primaryContainer/20', "'color-mix(in srgb, var(--md-sys-color-primary-container) 20%, transparent)'"],
  ['sys.colors.primaryContainer/5', "'color-mix(in srgb, var(--md-sys-color-primary-container) 5%, transparent)'"],
  ['sys.colors.primary/10', "'color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent)'"],
  ['sys.colors.primary/5', "'color-mix(in srgb, var(--md-sys-color-primary) 5%, transparent)'"],
  
  // secondary variants
  ['sys.colors.secondary-container/30', "'color-mix(in srgb, var(--md-sys-color-secondary-container) 30%, transparent)'"],
  ['sys.colors.secondary-container/20', "'color-mix(in srgb, var(--md-sys-color-secondary-container) 20%, transparent)'"],
  ['sys.colors.secondary/10', "'color-mix(in srgb, var(--md-sys-color-secondary) 10%, transparent)'"],
  
  // tertiary variants
  ['sys.colors.tertiary-container/50', "'color-mix(in srgb, var(--md-sys-color-tertiary-container) 50%, transparent)'"],
  ['sys.colors.tertiary/10', "'color-mix(in srgb, var(--md-sys-color-tertiary) 10%, transparent)'"],
  ['sys.colors.tertiary/5', "'color-mix(in srgb, var(--md-sys-color-tertiary) 5%, transparent)'"],
  
  // error variants
  ['sys.colors.error/10', "'color-mix(in srgb, var(--md-sys-color-error) 10%, transparent)'"],
  
  // outline variants
  ['sys.colors.outline-variant/30', "'color-mix(in srgb, var(--md-sys-color-outline-variant) 30%, transparent)'"],
  
  // scrim/black
  ['sys.colors.black/40', "'color-mix(in srgb, var(--md-sys-color-scrim, #000) 40%, transparent)'"],
  
  // Simple color tokens (no opacity) — order: longest first
  ['sys.colors.on-error-container', "'var(--md-sys-color-on-error-container)'"],
  ['sys.colors.on-primaryContainer', "'var(--md-sys-color-on-primary-container)'"],
  ['sys.colors.on-secondary-container', "'var(--md-sys-color-on-secondary-container)'"],
  ['sys.colors.on-tertiary-container', "'var(--md-sys-color-on-tertiary-container)'"],
  ['sys.colors.on-warning-container', "'var(--md-sys-color-on-warning-container, var(--md-sys-color-on-error-container))'"],
  ['sys.colors.warning-container', "'var(--md-sys-color-warning-container, var(--md-sys-color-error-container))'"],
  ['sys.colors.on-error', "'var(--md-sys-color-on-error)'"],
  ['sys.colors.error', "'var(--md-sys-color-error)'"],
  ['sys.colors.white', "'var(--md-sys-color-surface)'"],
  
  // Misattributed values (CSS properties mistakenly treated as colors)
  // These produce invalid `color: sys.colors.center` which should be removed
  // as the color property shouldn't have value "center"
  ['sys.colors.center', "'inherit'"],  // placeholder — will be fixed manually
  ['sys.colors.ellipsis', "'inherit'"],  // placeholder — will be fixed manually
  ['sys.colors.gradient-to-b', "'var(--md-sys-color-outline-variant)'"],  // approximate
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
