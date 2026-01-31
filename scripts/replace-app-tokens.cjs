#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const semanticPath = path.join(root, 'src', 'design-system', 'semantic-tokens.css');
if (!fs.existsSync(semanticPath)) {
  console.error('semantic-tokens.css not found:', semanticPath);
  process.exit(1);
}

const content = fs.readFileSync(semanticPath, 'utf8');
const mapping = {};
const re = /--(app-[^:\s]+)\s*:\s*var\((--[^)]+)\)\s*;/g;
let m;
while ((m = re.exec(content))) {
  const app = `--${m[1]}`;
  const target = m[2];
  mapping[app] = target;
}

// Resolve chains (app -> app -> md-sys)
function resolve(token) {
  const visited = new Set();
  let cur = token;
  while (mapping[cur] && !visited.has(cur)) {
    visited.add(cur);
    cur = mapping[cur];
  }
  return cur;
}

for (const k of Object.keys(mapping)) mapping[k] = resolve(k);

const exts = ['.ts', '.tsx', '.js', '.jsx', '.css'];
const files = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      walk(full);
    } else if (exts.includes(path.extname(name))) {
      files.push(full);
    }
  }
}

walk(path.join(root, 'src'));

let totalReplacements = 0;
for (const file of files) {
  let txt = fs.readFileSync(file, 'utf8');
  let original = txt;
  for (const [app, md] of Object.entries(mapping)) {
    const reVar = new RegExp(`var\\(\\s*${app}\\s*\\)`, 'g');
    if (reVar.test(txt)) {
      txt = txt.replace(reVar, `var(${md})`);
    }
    const reDirect = new RegExp(`${app}`, 'g');
    if (reDirect.test(txt)) {
      // replace occurrences like '--app-spacing-section' in strings
      txt = txt.replace(reDirect, md);
    }
  }
  if (txt !== original) {
    fs.writeFileSync(file + '.bak', original, 'utf8');
    fs.writeFileSync(file, txt, 'utf8');
    totalReplacements++;
    console.log('Updated', file);
  }
}

console.log('Mappings:', mapping);
console.log('Files updated:', totalReplacements);
console.log('Done. Review changes, run tests and commit.');
