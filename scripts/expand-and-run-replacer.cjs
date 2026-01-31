#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
// Optional target directory relative to repo root (default: 'src')
const TARGET = process.argv[2] || 'src';
const SRC = path.join(ROOT, TARGET);
const MAPPING_FILE = path.join(ROOT, 'reports', 'mapping.json');

function readMapping() {
  try {
    const raw = fs.readFileSync(MAPPING_FILE, 'utf8');
    return JSON.parse(raw).mappings || {};
  } catch (e) {
    return {};
  }
}

function walk(dir) {
  const results = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (name === '__tests__' || name === '__snapshots__') continue;
      results.push(...walk(p));
    } else if (stat.isFile()) {
      if (/\.\w+$/.test(p)) results.push(p);
    }
  }
  return results;
}

function camelToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function applyProgrammaticReplacements(content) {
  content = content.replace(/var\(--sys-([a-z0-9-]+)\)/g, (m, g1) => `var(--md-sys-color-${g1})`);

  content = content.replace(/var\(--typography-([a-zA-Z0-9-]+)\)/g, (m, g1) => {
    const kebab = camelToKebab(g1);
    return `var(--md-sys-typescale-${kebab})`;
  });

  content = content.replace(/var\(--app-text-([a-zA-Z0-9-]+)\)/g, (m, g1) => {
    let s = g1;
    s = s.replace(/fontSize/g, 'font-size');
    s = s.replace(/weight/g, 'font-weight');
    s = s.replace(/line-height/g, 'line-height');
    s = camelToKebab(s);
    return `var(--md-sys-typescale-${s})`;
  });

  content = content.replace(/--sys-([a-z0-9-]+)/g, (m, g1) => `--md-sys-color-${g1}`);

  content = content.replace(/var\(--breakpoint-([a-z0-9-]+)\)/g, (m, g1) => `var(--md-sys-breakpoint-${g1})`);

  // additional mappings
  content = content.replace(/var\(--motion-easing-([a-z0-9-]+)\)/g, (m, g1) => `var(--md-sys-motion-easing-${g1})`);
  content = content.replace(/--md-corner-([a-z0-9-]+)/g, (m, g1) => `--md-sys-shape-corner-${g1}`);
  content = content.replace(/var\(--icon-size-([a-z0-9-]+)\)/g, (m, g1) => `var(--md-sys-icon-size-${g1})`);
  content = content.replace(/var\(--content-max-width\)/g, `var(--md-sys-breakpoint-content-max-width)`);
  content = content.replace(/var\(--app-z-([a-z0-9-]+)\)/g, (m, g1) => `var(--md-sys-z-${g1})`);

  return content;
}

function applyExplicitMapping(content, map) {
  for (const [from, to] of Object.entries(map)) {
    const re = new RegExp(`var\\\\\\(\\s*--${from}\\s*\\\\\\)`, 'g');
    content = content.replace(re, `var(--${to})`);
    const re2 = new RegExp(`--${from}`, 'g');
    content = content.replace(re2, `--${to}`);
  }
  return content;
}

function isTextFile(p) {
  return /\.(css|scss|ts|tsx|js|jsx|json|md|html)$/.test(p);
}

function main() {
  const mapping = readMapping();
  const files = walk(SRC).filter(isTextFile);
  let changed = 0;
  for (const f of files) {
    let content = fs.readFileSync(f, 'utf8');
    const original = content;
    content = applyExplicitMapping(content, mapping);
    content = applyProgrammaticReplacements(content);
    if (content !== original) {
      fs.writeFileSync(f + '.preappfix.bak', original, 'utf8');
      fs.writeFileSync(f, content, 'utf8');
      changed++;
      console.log('Updated', path.relative(ROOT, f));
    }
  }
  console.log('Files updated:', changed);
}

main();
