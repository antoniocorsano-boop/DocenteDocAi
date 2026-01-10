/**
 * batch-token-replace.js
 * 
 * Replace legacy CSS tokens with M3 tokens based on TOKEN_IMPACT_REPORT
 * Usage: node batch-token-replace.js
 */

import fs from 'fs';
import path from 'path';

// Configurazione file CSS da processare
const cssFiles = [
  'src/modules.css',
  'src/design-system/legacyStyles.css',
  'index.css',
  'src/design-system/m3-interactive.css'
];

// Mappa legacy → M3 token SAFE TO CONSOLIDATE
const tokenMap = {
  // SHAPE TOKENS
  '--shape-xs': '--md-sys-shape-corner-extra-small',
  '--shape-s': '--md-sys-shape-corner-small',
  '--shape-m': '--md-sys-shape-corner-medium',
  '--shape-l': '--md-sys-shape-corner-large',
  '--shape-xl': '--md-sys-shape-corner-extra-large',
  '--shape-full': '--md-sys-shape-corner-full',

  // ELEVATION TOKENS
  '--elevation-0': '--md-sys-elevation-level0',
  '--elevation-1': '--md-sys-elevation-level1',
  '--elevation-2': '--md-sys-elevation-level2',

  // TYPOGRAPHY
  '20px': 'var(--md-sys-typescale-title-medium-size)',
  '11px': 'var(--md-sys-typescale-body-small-size)',
  '10px': 'var(--md-sys-typescale-label-small-size)',

  // COLOR TOKENS
  '#fff': 'var(--md-sys-color-surface)',
  '#d32f2f': 'var(--md-sys-color-error)',
  'rgba(0, 0, 0, 0.1)': 'var(--md-sys-color-shadow)',
  'rgba(0, 0, 0, 0.18)': 'var(--md-sys-color-shadow)'
};

// Funzione per sostituire i token in un file
function replaceTokensInFile(filePath, tokenMap) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [legacy, m3] of Object.entries(tokenMap)) {
    const regex = new RegExp(escapeRegex(legacy), 'g');
    content = content.replace(regex, m3);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Tokens replaced in ${filePath}`);
}

// Utility: escape regex per stringa
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Esecuzione batch
cssFiles.forEach(file => {
  const fullPath = path.resolve(file);
  if (fs.existsSync(fullPath)) {
    replaceTokensInFile(fullPath, tokenMap);
  } else {
    console.warn(`⚠️ File not found: ${fullPath}`);
  }
});

console.log('🎉 All token replacements completed!');
