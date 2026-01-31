#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const targets = process.argv.slice(2).length ? process.argv.slice(2) : ['src/design-system'];

function walk(dir) {
  const res = [];
  if (!fs.existsSync(dir)) return res;
  const s = fs.statSync(dir);
  if (s.isFile()) return [dir];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      res.push(...walk(full));
    } else if (st.isFile()) {
      const ext = path.extname(full).toLowerCase();
      if (['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.json'].includes(ext)) res.push(full);
    }
  }
  return res;
}

const hexRe = /#([0-9a-fA-F]{3,8})\b/g;

function safeWrap(hex) {
  const normalized = hex.toLowerCase().replace('#', '');
  return `var(--app-legacy-color-${normalized}, ${hex})`;
}

function processFile(file) {
  let raw = fs.readFileSync(file, 'utf8');
  let out = raw;

  out = out.replace(hexRe, (match, group, offset, string) => {
    // don't touch if already inside var(...)
    const before = string.slice(Math.max(0, offset - 10), offset);
    if (before.includes('var(')) return match;
    return safeWrap(match);
  });

  if (out !== raw) {
    fs.writeFileSync(file + '.preappfix.bak', raw, 'utf8');
    fs.writeFileSync(file, out, 'utf8');
    console.log('Wrapped hex colors in', file);
    return true;
  }
  return false;
}

let files = [];
for (const t of targets) {
  const p = path.resolve(ROOT, t);
  files.push(...walk(p));
}
files = Array.from(new Set(files));
let updated = 0;
for (const f of files) {
  try {
    if (processFile(f)) updated++;
  } catch (e) {
    console.error('Error', f, e.message);
  }
}
console.log('Files updated:', updated);
