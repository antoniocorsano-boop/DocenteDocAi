#!/usr/bin/env node
/*
  governance-check.cjs
  CommonJS variant of the MD3 governance scanner to run even when package.json type=module
*/
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
const arg = (name, defaultValue) => {
  const idx = argv.indexOf(name);
  if (idx === -1) return defaultValue;
  return argv[idx + 1] || defaultValue;
};

const targetPattern = arg('--path', 'src/**/*.ts?(x)');
const mode = arg('--mode', 'warn'); // warn | fail

const forbiddenUnitRegex = /(?:\d+(?:\.\d+)?)(px|rem|vh|vw|%|em)\b/gi;
const hexColorRegex = /#(?:[0-9a-fA-F]{3,8})\b/g;
const rgbRegex = /rgba?\(/gi;

const tokenAllowedRegex = /var\(\s*--(?:md-sys-|app-)[^)]+\)/i;

// Files or paths to ignore from the scanner (documented exceptions)
const ignorePathPatterns = [
  /src\/design-system\/legacy-colors\.ts$/i,
  /src\/design-system\/pdf-colors\.ts$/i,
  /src\/design-system\/.*\.test\.ts$/i,
  /src\/stories\//i,
  /__tests__\//i,
  /\/__tests__\//i
];

// Simple file walker to replace glob dependency
function walkFiles(dir, pattern) {
  const results = [];
  
  function walk(currentPath) {
    if (!fs.existsSync(currentPath)) return;
    const stat = fs.statSync(currentPath);
    
    if (stat.isFile()) {
      if (currentPath.match(/\.(ts|tsx)$/)) {
        results.push(currentPath);
      }
      return;
    }
    
    if (stat.isDirectory()) {
      const items = fs.readdirSync(currentPath);
      for (const item of items) {
        if (item === 'node_modules' || item === '.git' || item === 'dist' || item === 'build') continue;
        walk(path.join(currentPath, item));
      }
    }
  }
  
  // Parse simple pattern like "src/**/*.ts?(x)"
  const baseDir = pattern.split('/**')[0] || dir;
  walk(path.resolve(baseDir));
  return results;
}

function findViolationsInContent(content, file) {
  const lines = content.split(/\r?\n/);
  const violations = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;
    while ((match = forbiddenUnitRegex.exec(line)) !== null) {
      if (!tokenAllowedRegex.test(line)) {
        violations.push({ file, line: i + 1, column: match.index + 1, type: 'hardcoded-unit', text: match[0].trim() });
      }
    }
    if (hexColorRegex.test(line) && !tokenAllowedRegex.test(line)) {
      violations.push({ file, line: i + 1, column: line.search(hexColorRegex) + 1 || 1, type: 'hex-color', text: (line.match(hexColorRegex) || []).join(', ') });
    }
    if (rgbRegex.test(line) && !tokenAllowedRegex.test(line)) {
      violations.push({ file, line: i + 1, column: line.search(rgbRegex) + 1 || 1, type: 'rgb-color', text: 'rgb/rgba usage' });
    }
  }
  return violations;
}

function scan() {
  const files = walkFiles('.', targetPattern);
  const allViolations = [];
  files.forEach((file) => {
    // skip ignored paths (normalize to forward-slash)
    const normalized = file.replace(/\\\\/g, '/').replace(/\\/g, '/');
    if (ignorePathPatterns.some(rx => rx.test(normalized))) return;
    try {
      const content = fs.readFileSync(path.resolve(file), 'utf8');
      const violations = findViolationsInContent(content, file);
      allViolations.push(...violations);
    } catch (e) {
      console.error('Error reading', file, e.message);
    }
  });

  if (allViolations.length === 0) {
    console.log(`MD3 Governance Check: no violations in ${files.length} files (mode=${mode})`);
  } else {
    console.log(`MD3 Governance Check: found ${allViolations.length} violation(s) (mode=${mode})`);
    allViolations.forEach((v) => {
      console.log(`${v.file}:${v.line}:${v.column} [${v.type}] ${v.text}`);
    });
  }

  return { filesScanned: files.length, violations: allViolations };
}

const result = scan();
const exitCode = result.violations.length === 0 ? 0 : (mode === 'fail' ? 2 : 0);
try {
  const outDir = path.resolve('tmp');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'governance-check-result.json');
  fs.writeFileSync(outPath, JSON.stringify({ mode, filesScanned: result.filesScanned, violations: result.violations }, null, 2), 'utf8');
  console.log('Wrote results to', outPath);
} catch (e) {
  console.error('Failed to write results file', e.message);
}

process.exit(exitCode);
