#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const targets = [
  path.join(ROOT, 'src', 'components', 'Settings.tsx'),
  path.join(ROOT, 'src', 'components', 'StudentClassroomView.tsx')
];

const replacements = [
  {re: /(?<![-\d\.])0\.005em/g, to: 'var(--md-sys-typescale-tracking-micro, 0.005em)'},
  {re: /(?<![-\d\.])0\.025em/g, to: 'var(--md-sys-typescale-tracking-xxxxs, 0.025em)'},
  {re: /(?<![-\d\.])0\.05em/g, to: 'var(--md-sys-typescale-tracking-xxxs, 0.05em)'},
  {re: /(?<![-\d\.])0\.08em/g, to: 'var(--md-sys-typescale-tracking-xxs, 0.08em)'},
  {re: /(?<![-\d\.])0\.1em/g, to: 'var(--md-sys-typescale-tracking-xxs, 0.1em)'},
  {re: /(?<![-\d\.])0\.15em/g, to: 'var(--md-sys-typescale-tracking-xs, 0.15em)'},
  {re: /(?<![-\d\.])0\.2em/g, to: 'var(--md-sys-typescale-tracking-sm, 0.2em)'},
  {re: /(?<!\w)-0\.005em/g, to: 'var(--md-sys-typescale-tracking-micro, -0.005em)'},
  {re: /(?<!\w)-0\.025em/g, to: 'var(--md-sys-typescale-tracking-xxxxs, -0.025em)'},
  {re: /(?<!\w)-0\.005em/g, to: 'var(--md-sys-typescale-tracking-micro, -0.005em)'},
  {re: /(?<!\w)-0\.005em/g, to: 'var(--md-sys-typescale-tracking-micro, -0.005em)'},
  {re: /100vh/g, to: 'var(--md-sys-viewport-height-full, 100vh)'}
];

let totalChanged = 0;
for (const file of targets) {
  if (!fs.existsSync(file)) {
    console.warn('Target not found:', file);
    continue;
  }
  const raw = fs.readFileSync(file, 'utf8');
  let content = raw;
  for (const r of replacements) {
    content = content.replace(r.re, r.to);
  }
  if (content !== raw) {
    fs.writeFileSync(file + '.preappfix.bak', raw, 'utf8');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Patched', path.relative(ROOT, file));
    totalChanged++;
  } else {
    console.log('No changes for', path.relative(ROOT, file));
  }
}
console.log('Files updated:', totalChanged);
