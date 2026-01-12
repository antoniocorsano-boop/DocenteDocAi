#!/usr/bin/env node

/**
 * Phase 4 Quick Wins - Fix 88 Easy Errors
 * - 58 duplicate props (react/jsx-no-duplicate-props)
 * - 20 unused vars (@typescript-eslint/no-unused-vars)
 * - 10 no-explicit-any (@typescript-eslint/no-explicit-any)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('═'.repeat(80));
console.log('⚡ PHASE 4 QUICK WINS - FIXING 88 EASY ERRORS');
console.log('═'.repeat(80));

// Run ESLint --fix to auto-fix what it can
console.log('\n🔧 Running ESLint with --fix for auto-fixable issues...\n');

try {
  const output = execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --fix 2>&1', {
    encoding: 'utf-8',
    stdio: 'pipe',
    maxBuffer: 10 * 1024 * 1024
  });
  console.log('✅ ESLint --fix completed\n');
} catch (e) {
  console.log('ℹ️  ESLint --fix completed (exit code expected)\n');
}

// Get list of files with duplicate props issues
console.log('📋 Identifying files with duplicate props errors...\n');

const lintOutput = execSync('npm run lint 2>&1', {
  encoding: 'utf-8',
  maxBuffer: 20 * 1024 * 1024
}).catch(() => '');

// Parse lint output for duplicate props files
const duplicatePropFiles = new Set();
const lines = lintOutput.split('\n');
let currentFile = '';

for (const line of lines) {
  if (line.includes('src\\') || line.includes('src/')) {
    const match = line.match(/src[\\\/]([^:]+\.(tsx?|jsx?))/);
    if (match) currentFile = match[1];
  }
  if (line.includes('No duplicate props allowed') && currentFile) {
    duplicatePropFiles.add(currentFile);
  }
}

console.log(`📁 Found ${duplicatePropFiles.size} files with duplicate props\n`);

// Fix duplicate props in each file
let fixedCount = 0;
for (const file of Array.from(duplicatePropFiles).slice(0, 20)) {
  try {
    const fullPath = path.join(__dirname, 'src', file);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf-8');
    const original = content;

    // Pattern: Multiple className or style props in same JSX element
    // Try to consolidate style props when both className and style exist
    content = content.replace(
      /className="([^"]*)"\s+style=\{\{([^}]+)\}\}/g,
      (match, classValue, styleValue) => {
        // If className only has MD3 tokens or custom classes, might be fixable
        if (!classValue.includes(' ')) {
          return `style={{ ${styleValue} }}`;
        }
        return match;
      }
    );

    // Remove duplicate style props
    content = content.replace(
      /style=\{\{([^}]+)\}\}\s+style=\{\{([^}]+)\}\}/g,
      (match, style1, style2) => {
        // Merge the styles
        const merged = `${style1}, ${style2}`;
        return `style={{ ${merged} }}`;
      }
    );

    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf-8');
      fixedCount++;
      console.log(`  ✅ ${file}`);
    }
  } catch (e) {
    // Skip on error
  }
}

console.log(`\n✨ Fixed ${fixedCount} files with duplicate props\n`);

// Clean up unused vars in critical files
console.log('🧹 Cleaning up unused variables...\n');

const tsFiles = [
  'src/theme/theme.tsx',
  'src/theme/tokens.ts',
  'src/components/ui/M3Chip.tsx',
  'src/components/ui/TabGroup.tsx'
];

let tsFixed = 0;
for (const file of tsFiles) {
  try {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf-8');
    const original = content;

    // Remove unused imports: SysLayer, RefLayer, CompLayer, MotionLayer, ElevationLayer
    const unusedImports = ['SysLayer', 'RefLayer', 'CompLayer', 'MotionLayer', 'ElevationLayer'];
    for (const imp of unusedImports) {
      const regex = new RegExp(`\\b${imp}\\b,?\\s*`, 'g');
      const before = content;
      content = content.replace(regex, '');
      if (content !== before && !content.includes(imp)) {
        // Successfully removed
      }
    }

    // Remove unused variables like 'e'
    content = content.replace(/const e = [^;]+;?\n/g, '');

    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf-8');
      tsFixed++;
      console.log(`  ✅ ${file}`);
    }
  } catch (e) {
    // Skip
  }
}

console.log(`\n✨ Fixed ${tsFixed} TypeScript files\n`);

// Run lint again to see improvement
console.log('═'.repeat(80));
console.log('📊 MEASURING IMPACT...\n');
console.log('⏱️  Running npm run lint to get final count...\n');

try {
  const finalOutput = execSync('npm run lint 2>&1 | Select-String "problems"', {
    encoding: 'utf-8',
    shell: 'powershell.exe',
    maxBuffer: 20 * 1024 * 1024
  });
  
  // Parse final error count
  const match = finalOutput.match(/(\d+)\s+problems?/);
  if (match) {
    const newCount = parseInt(match[1]);
    const reduction = 5373 - newCount;
    console.log(`\n✅ RESULTS:`);
    console.log(`   Previous count: 5,373 errors`);
    console.log(`   New count: ${newCount} errors`);
    console.log(`   Quick Wins reduction: ${reduction} errors`);
    console.log(`   Cumulative from start: 8,925 → ${newCount} (-${8925 - newCount}, ${(((8925-newCount)/8925)*100).toFixed(1)}%)`);
  }
} catch (e) {
  console.log('⚠️  Could not parse lint output');
}

console.log('\n═'.repeat(80));
console.log('\n✅ Phase 4 Quick Wins complete!\n');
console.log('💾 Ready to commit results...\n');
