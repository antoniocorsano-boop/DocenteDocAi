#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGET = process.argv[2] || 'src/components';
const exts = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.md'];

function walk(dir) {
  const res = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (name === '__tests__' || name === '__snapshots__') continue;
      res.push(...walk(p));
    } else if (stat.isFile()) {
      if (exts.includes(path.extname(p))) res.push(p);
    }
  }
  return res;
}

function replaceContent(content, file) {
  const lines = content.split(/\r?\n/);
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let newLine = line;

    // 1) Comment-only: replace 44px in comments with token
    if (/^\s*\/\//.test(line) || line.includes('/*')) {
      newLine = newLine.replace(/44px/g, 'var(--app-spacing-touch)');
    }

    // 2) max content width: replace 1200px when used with max
    if (/max[-A-Za-z0-9_]*\s*[:=]/i.test(line) || /maxWidth/.test(line)) {
      newLine = newLine.replace(/1200px/g, 'var(--content-max-width)');
    }

    // 3) chart/card heights: 300px/250px when file or line mentions chart/card
    if (/chart|card/i.test(file) || /chart|card/i.test(line)) {
      newLine = newLine.replace(/\b300px\b/g, 'var(--app-chart-height-large)').replace(/\b250px\b/g, 'var(--app-chart-height-medium)');
    }

    if (newLine !== line) {
      lines[i] = newLine;
      changed = true;
    }
  }
  return { changed, content: lines.join('\n') };
}

function main() {
  const rootDir = path.join(ROOT, TARGET);
  if (!fs.existsSync(rootDir)) {
    console.error('Target not found:', rootDir);
    process.exit(1);
  }
  const files = walk(rootDir);
  let updated = 0;
  for (const f of files) {
    const raw = fs.readFileSync(f, 'utf8');
    const { changed, content } = replaceContent(raw, f);
    if (changed) {
      fs.writeFileSync(f + '.preappfix.bak', raw, 'utf8');
      fs.writeFileSync(f, content, 'utf8');
      console.log('Patched', path.relative(ROOT, f));
      updated++;
    }
  }
  console.log('Files updated:', updated);
}

main();
