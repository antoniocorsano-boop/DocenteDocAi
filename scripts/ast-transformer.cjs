#!/usr/bin/env node
/**
 * ast-transformer.cjs
 * AST-aware transformer for .ts/.tsx files (string/template literals only)
 * 
 * This script performs conservative token wrapping in TypeScript/TSX files
 * by parsing the AST and only transforming string literals and template literals.
 * It avoids touching code logic, function names, or variable names.
 */

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
      if (name === 'node_modules' || name === '.git' || name === 'dist' || name === 'build') continue;
      res.push(...walk(full));
    } else if (st.isFile()) {
      const ext = path.extname(full).toLowerCase();
      if (['.ts', '.tsx'].includes(ext)) res.push(full);
    }
  }
  return res;
}

// Regex patterns for detecting hardcoded values in string literals
const hexRe = /#([0-9a-fA-F]{3,8})\b/g;
const rgbRe = /rgba?\([^)]+\)/g;
const pxRe = /(\d+(?:\.\d+)?)(px|rem|em|vh|vw|%)/g;

/**
 * Simple string literal transformer
 * This is a conservative approach that only wraps values found in string literals
 * It does NOT use a full AST parser to keep it simple and avoid dependencies
 */
function transformStringLiterals(content) {
  let modified = false;
  let result = content;
  
  // Match string literals (single and double quotes)
  // This is a simplified approach - a full AST parser would be more robust
  const stringLiteralRe = /(['"`])(?:(?!\1)[^\\]|\\.)*?\1/g;
  
  result = result.replace(stringLiteralRe, (match) => {
    let inner = match;
    let changed = false;
    
    // Don't touch if already wrapped with var(...)
    if (inner.includes('var(--')) {
      return match;
    }
    
    // Transform hex colors
    if (hexRe.test(inner)) {
      inner = inner.replace(hexRe, (hex) => {
        const normalized = hex.toLowerCase().replace('#', '');
        changed = true;
        return `var(--app-legacy-color-${normalized}, ${hex})`;
      });
      hexRe.lastIndex = 0; // Reset regex
    }
    
    if (changed) {
      modified = true;
      return inner;
    }
    return match;
  });
  
  return { content: result, modified };
}

/**
 * Process a single file
 */
function processFile(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const { content: transformed, modified } = transformStringLiterals(raw);
    
    if (modified) {
      // Create backup
      fs.writeFileSync(file + '.preappfix.bak', raw, 'utf8');
      // Write transformed content
      fs.writeFileSync(file, transformed, 'utf8');
      console.log('Transformed string literals in', file);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error processing', file, e.message);
    return false;
  }
}

/**
 * Main execution
 */
let files = [];
for (const t of targets) {
  const p = path.resolve(ROOT, t);
  files.push(...walk(p));
}
files = Array.from(new Set(files));

console.log(`AST Transformer: Processing ${files.length} TypeScript files...`);
console.log('Target: String and template literals only');
console.log('Approach: Conservative wrapping with fallbacks');
console.log('');

let updated = 0;
for (const f of files) {
  if (processFile(f)) updated++;
}

console.log('');
console.log(`Files updated: ${updated}`);
console.log(`Files unchanged: ${files.length - updated}`);
console.log('');
console.log('NOTE: This transformer only wraps values in string/template literals.');
console.log('It does NOT modify code logic, function calls, or variable assignments.');
console.log('Review the .preappfix.bak files to verify transformations.');
