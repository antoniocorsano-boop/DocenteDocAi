#!/usr/bin/env node
/**
 * Phase 6 Smart Batch Converter
 * 
 * Only targets files where EVERY className can be safely converted
 * Skips files with custom CSS or complex mixed patterns
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get ALL tsx files
const getFiles = () => {
  const files = [];
  const walk = (dir) => {
    try {
      fs.readdirSync(dir).forEach(file => {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
          walk(full);
        } else if (file.endsWith('.tsx')) {
          files.push(full);
        }
      });
    } catch (e) {}
  };
  walk('src/components');
  return files;
};

// Check if a file has ONLY simple, convertible Tailwind
const isSafeToConvert = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Has material-symbols-outlined? Must be careful
  const hasIcons = content.includes('material-symbols-outlined');
  
  // Check for custom CSS pattern (e.g., xyz-abc-def)
  const hasCustomCss = /className="[^"]*[a-z]+-[a-z]+-[a-z]+[^"]*"/.test(content);
  
  // Check for complex Tailwind patterns we should skip
  const hasComplexPatterns = /className="[^"]*(?:space-y|space-x|md:|lg:|sm:|divide|border-t|border-b|border-l|border-r)[^"]*"/.test(content);
  
  // If any of these, skip
  if (hasCustomCss || hasComplexPatterns) {
    return false;
  }
  
  // Count className occurrences with simple patterns only
  const simpleClassNames = (content.match(/className="[^"]*(?:p-|gap-|h-|w-|text-|rounded-|flex|grid|items-|justify-|absolute|relative|fixed|block|inline|overflow-)[^"]*"/g) || []);
  
  // If file has lots of classNames, it's probably complex
  if (simpleClassNames.length > 20) {
    return false;
  }
  
  // Has existing style={{}} that we might conflict with?
  if (simpleClassNames.length > 0 && content.includes('style={{')) {
    return false;
  }
  
  return simpleClassNames.length > 0;
};

// List safest files
console.log('🔍 Scanning for safe conversion candidates...\n');

const files = getFiles();
const safeFiles = [];

files.forEach(file => {
  if (isSafeToConvert(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    const count = (content.match(/className="[^"]*(?:p-|gap-|h-|w-|text-|rounded-|flex|grid)[^"]*"/g) || []).length;
    safeFiles.push({ file, count });
  }
});

safeFiles.sort((a, b) => b.count - a.count);

console.log(`Found ${safeFiles.length} safe files\n`);
console.log('Top 20 safest targets (simple Tailwind only):\n');

safeFiles.slice(0, 20).forEach((f, i) => {
  console.log(`${i+1}. ${path.basename(f.file)}: ${f.count} simple classNames`);
});

console.log(`\nTo convert a specific file, run:`);
console.log(`  npx eslint --fix <file>`);
console.log(`  git add <file>`);
console.log(`  npm run lint`);
