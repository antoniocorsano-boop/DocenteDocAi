#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const targets = process.argv.slice(2).length ? process.argv.slice(2) : ['src/components'];

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

function stripFallbacks(content) {
  // remove numeric fallbacks inside var(...) e.g. var(--foo, 0.1em) -> var(--foo)
  // also handle nested fallbacks like var(--a, var(--b, 0.1em)) -> var(--a)
  return content.replace(/var\((--[a-zA-Z0-9_\-]+)\s*,\s*(?:var\([^)]+\)|[0-9.]+(?:em|px|vh|rem))\s*\)/g, 'var($1)');
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
    const raw = fs.readFileSync(f, 'utf8');
    const updated = stripFallbacks(raw);
    if (updated !== raw) {
      fs.writeFileSync(f + '.preappfix.bak', raw, 'utf8');
      fs.writeFileSync(f, updated, 'utf8');
      console.log('Patched', path.relative(ROOT, f));
      updatedCount++;
    }
  } catch (e) {
    console.error('Error processing', f, e.message);
  }
}
console.log('Files updated:', updatedCount);
