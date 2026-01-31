#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const targets = process.argv.slice(2).length ? process.argv.slice(2) : ['src/components'];

const mapping = {
  '0.1em': 'var(--app-legacy-0_1em, 0.1em)',
  '0.005em': 'var(--app-legacy-0_005em, 0.005em)',
  '0.5em': 'var(--app-legacy-0_5em, 0.5em)',
  '300px': 'var(--app-legacy-300px, 300px)',
  '250px': 'var(--app-legacy-250px, 250px)',
  '0.2em': 'var(--app-legacy-0_2em, 0.2em)',
  '0.025em': 'var(--app-legacy-0_025em, 0.025em)',
  '0.15em': 'var(--app-legacy-0_15em, 0.15em)',
  '0.08em': 'var(--app-legacy-0_08em, 0.08em)',
  '100vh': 'var(--app-legacy-100vh, 100vh)'
};

function walkAndCollect(folder) {
  const res = [];
  if (!fs.existsSync(folder)) return res;
  const stat = fs.statSync(folder);
  if (stat.isFile()) return [folder];
  for (const name of fs.readdirSync(folder)) {
    const p = path.join(folder, name);
    const s = fs.statSync(p);
    if (s.isDirectory()) {
      if (name === '__tests__' || name === '__snapshots__') continue;
      res.push(...walkAndCollect(p));
    } else if (s.isFile()) {
      const ext = path.extname(p);
      if (['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.md'].includes(ext)) res.push(p);
    }
  }
  return res;
}

function replaceInFile(file) {
  let raw = fs.readFileSync(file, 'utf8');
  let updated = raw;
  for (const [k, v] of Object.entries(mapping)) {
    // replace only whole token occurrences (word boundary-ish)
    const re = new RegExp(k.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
    updated = updated.replace(re, (match, offset, string) => {
      // avoid double-wrapping if already uses var(...)
      const before = string.slice(Math.max(0, offset-12), offset);
      if (/var\(.*\)/.test(before + match)) return match;
      return v;
    });
  }
  if (updated !== raw) {
    fs.writeFileSync(file + '.preappfix.bak', raw, 'utf8');
    fs.writeFileSync(file, updated, 'utf8');
    return true;
  }
  return false;
}

let files = [];
for (const t of targets) {
  const tgt = path.resolve(ROOT, t);
  files.push(...walkAndCollect(tgt));
}
files = Array.from(new Set(files));
let updatedCount = 0;
for (const f of files) {
  try {
    if (replaceInFile(f)) {
      console.log('Patched', path.relative(ROOT, f));
      updatedCount++;
    }
  } catch (e) {
    console.error('Error processing', f, e.message);
  }
}
console.log('Files updated:', updatedCount);
