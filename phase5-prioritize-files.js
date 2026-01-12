#!/usr/bin/env node

/**
 * Phase 5: Manual Review - Identify Top Priority Files
 * Extract all errors per file and rank them
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('═'.repeat(80));
console.log('🔍 PHASE 5 - MANUAL REVIEW - FILE PRIORITY ANALYSIS');
console.log('═'.repeat(80));

// Get fresh lint output
console.log('\n📋 Collecting lint data...\n');

let lintOutput = '';
try {
  lintOutput = execSync('npm run lint 2>&1', {
    encoding: 'utf-8',
    maxBuffer: 50 * 1024 * 1024
  });
} catch (e) {
  lintOutput = e.stdout || '';
}

// Parse by file
const fileErrors = {};
const lines = lintOutput.split('\n');
let currentFile = '';

for (const line of lines) {
  // Match file paths
  const fileMatch = line.match(/^C:\\[^\n]*\\src\\([^\n:]+\.(tsx?|jsx?))/);
  if (fileMatch) {
    currentFile = fileMatch[1];
    if (!fileErrors[currentFile]) {
      fileErrors[currentFile] = {
        total: 0,
        className: 0,
        tailwind: 0,
        duplicateProps: 0,
        tsIssues: 0,
        other: 0,
        lines: []
      };
    }
  }

  if (!currentFile) continue;

  // Count by error type
  if (line.includes('design-system/no-classname')) {
    fileErrors[currentFile].className++;
    fileErrors[currentFile].total++;
  } else if (line.includes('design-system/no-tailwind-classes')) {
    fileErrors[currentFile].tailwind++;
    fileErrors[currentFile].total++;
  } else if (line.includes('react/jsx-no-duplicate-props')) {
    fileErrors[currentFile].duplicateProps++;
    fileErrors[currentFile].total++;
  } else if (
    line.includes('@typescript-eslint/no-unused-vars') ||
    line.includes('@typescript-eslint/no-explicit-any')
  ) {
    fileErrors[currentFile].tsIssues++;
    fileErrors[currentFile].total++;
  } else if (
    (currentFile && line.includes('error')) ||
    line.includes('warning')
  ) {
    fileErrors[currentFile].other++;
    fileErrors[currentFile].total++;
  }
}

// Sort by error count
const sorted = Object.entries(fileErrors)
  .filter(([f, c]) => c.total > 0 && f.includes('components'))
  .sort((a, b) => b[1].total - a[1].total)
  .slice(0, 50);

console.log(`📊 TOP 50 FILES BY ERROR COUNT:\n`);
console.log(
  'Rank'.padEnd(5) +
    'Total'.padEnd(8) +
    'className'.padEnd(12) +
    'Tailwind'.padEnd(10) +
    'DupProps'.padEnd(10) +
    'TS Issues'.padEnd(10) +
    'File'
);
console.log('─'.repeat(100));

sorted.forEach(([file, data], idx) => {
  console.log(
    `${(idx + 1).toString().padEnd(5)}` +
      `${data.total.toString().padEnd(8)}` +
      `${data.className.toString().padEnd(12)}` +
      `${data.tailwind.toString().padEnd(10)}` +
      `${data.duplicateProps.toString().padEnd(10)}` +
      `${data.tsIssues.toString().padEnd(10)}` +
      file
  );
});

// Export top 20 for review
const top20Files = sorted.slice(0, 20).map(([f]) => f);

console.log(`\n\n📌 TOP 20 FILES FOR MANUAL REVIEW:\n`);
top20Files.forEach((f, i) => {
  const errors = fileErrors[f];
  console.log(`${i + 1}. src/${f}`);
  console.log(`   Errors: ${errors.total} | className: ${errors.className} | Tailwind: ${errors.tailwind}`);
});

// Save to file
fs.writeFileSync(
  'TOP_20_PRIORITY_FILES.txt',
  top20Files.map((f, i) => `${i + 1}. src/${f}`).join('\n')
);

console.log(`\n✅ Top 20 files saved to TOP_20_PRIORITY_FILES.txt\n`);
console.log('═'.repeat(80));
console.log('\n🚀 Ready for manual review. Start with:');
console.log(`   1. ${top20Files[0]}`);
console.log(`   2. ${top20Files[1]}`);
console.log(`   3. ${top20Files[2]}`);
console.log('\n');
