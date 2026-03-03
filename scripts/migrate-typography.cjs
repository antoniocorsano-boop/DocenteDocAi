'use strict';
const fs = require('fs');
const path = require('path');

const files = [];
function walk(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const st = fs.statSync(full);
    if (st.isDirectory() && !item.startsWith('.') && item !== 'node_modules') walk(full);
    else if (['.css', '.tsx', '.ts'].some(ext => item.endsWith(ext))) files.push(full);
  }
}
walk(path.join(__dirname, '../src'));

const map = [
  // with -fontSize suffix
  ['--typography-display-large-fontSize', '--md-sys-typescale-display-large-size'],
  ['--typography-display-medium-fontSize', '--md-sys-typescale-display-medium-size'],
  ['--typography-display-small-fontSize', '--md-sys-typescale-display-small-size'],
  ['--typography-headline-large-fontSize', '--md-sys-typescale-headline-large-size'],
  ['--typography-headline-medium-fontSize', '--md-sys-typescale-headline-medium-size'],
  ['--typography-headline-small-fontSize', '--md-sys-typescale-headline-small-size'],
  ['--typography-title-large-fontSize', '--md-sys-typescale-title-large-size'],
  ['--typography-title-medium-fontSize', '--md-sys-typescale-title-medium-size'],
  ['--typography-title-small-fontSize', '--md-sys-typescale-title-small-size'],
  ['--typography-body-large-fontSize', '--md-sys-typescale-body-large-size'],
  ['--typography-body-medium-fontSize', '--md-sys-typescale-body-medium-size'],
  ['--typography-body-small-fontSize', '--md-sys-typescale-body-small-size'],
  ['--typography-label-large-fontSize', '--md-sys-typescale-label-large-size'],
  ['--typography-label-medium-fontSize', '--md-sys-typescale-label-medium-size'],
  ['--typography-label-small-fontSize', '--md-sys-typescale-label-small-size'],
  // with -size suffix (components.css pattern)
  ['--typography-display-large-size', '--md-sys-typescale-display-large-size'],
  ['--typography-headline-large-size', '--md-sys-typescale-headline-large-size'],
  ['--typography-title-medium-size', '--md-sys-typescale-title-medium-size'],
  // font family aliases
  ["--typography-headline-large-family", '--font-family'],
  ["--typography-title-medium-family", '--font-family'],
  ['--typography-headline-large-fontFamily', '--font-family'],
  ['--typography-title-medium-fontFamily', '--font-family'],
  // shorthand (no suffix) - in var() context e.g. var(--typography-title-medium)
  ['var(--typography-display-large)', 'var(--md-sys-typescale-display-large-size)'],
  ['var(--typography-display-medium)', 'var(--md-sys-typescale-display-medium-size)'],
  ['var(--typography-display-small)', 'var(--md-sys-typescale-display-small-size)'],
  ['var(--typography-headline-large)', 'var(--md-sys-typescale-headline-large-size)'],
  ['var(--typography-headline-medium)', 'var(--md-sys-typescale-headline-medium-size)'],
  ['var(--typography-headline-small)', 'var(--md-sys-typescale-headline-small-size)'],
  ['var(--typography-title-large)', 'var(--md-sys-typescale-title-large-size)'],
  ['var(--typography-title-medium)', 'var(--md-sys-typescale-title-medium-size)'],
  ['var(--typography-title-small)', 'var(--md-sys-typescale-title-small-size)'],
  ['var(--typography-body-large)', 'var(--md-sys-typescale-body-large-size)'],
  ['var(--typography-body-medium)', 'var(--md-sys-typescale-body-medium-size)'],
  ['var(--typography-body-small)', 'var(--md-sys-typescale-body-small-size)'],
  ['var(--typography-label-large)', 'var(--md-sys-typescale-label-large-size)'],
  ['var(--typography-label-medium)', 'var(--md-sys-typescale-label-medium-size)'],
  ['var(--typography-label-small)', 'var(--md-sys-typescale-label-small-size)'],
];

let totalChanges = 0;
let updatedFiles = 0;

for (const file of files) {
  if (file.endsWith('theme.css')) continue; // theme.css has intentional legacy aliases
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, to] of map) {
    if (content.includes(from)) {
      const count = content.split(from).length - 1;
      content = content.split(from).join(to);
      totalChanges += count;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    updatedFiles++;
    console.log('UPDATED:', path.relative(process.cwd(), file));
  }
}
console.log('\nFiles updated:', updatedFiles, '| Total replacements:', totalChanges);
