#!/usr/bin/env node

/**
 * Analyzes 5,373 remaining errors and groups them by category
 * Outputs strategy for each error group
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run full lint and capture output
console.log('🔍 Analyzing 5,373 remaining errors...\n');

try {
  const output = execSync('npm run lint -- --format=json 2>&1', { encoding: 'utf-8' }).catch(() => '');
} catch (e) {
  // Continue even if lint fails
}

// Parse lint output manually
const lintOutput = fs.readFileSync(path.join(__dirname, 'lint-phase4-analysis.txt'), 'utf-8');

// Initialize error categories
const errorGroups = {
  'design-system/no-classname': [],
  'design-system/no-tailwind-classes': [],
  'react/jsx-no-duplicate-props': [],
  '@typescript-eslint/no-unused-vars': [],
  '@typescript-eslint/no-explicit-any': [],
  'parsing-error': [],
  'other': []
};

const fileErrors = {};
const tailwindPatterns = new Map();

// Parse errors
const lines = lintOutput.split('\n');
let currentFile = '';

lines.forEach((line, idx) => {
  // Detect file path
  if (line.includes('C:\\Users\\anton\\DocenteDocAI-Flowise\\docentedoc-ai\\src\\')) {
    const match = line.match(/src\\([^:]+\.tsx?)/);
    if (match) {
      currentFile = match[1];
      if (!fileErrors[currentFile]) {
        fileErrors[currentFile] = {
          'design-system/no-classname': 0,
          'design-system/no-tailwind-classes': 0,
          'react/jsx-no-duplicate-props': 0,
          '@typescript-eslint/no-unused-vars': 0,
          '@typescript-eslint/no-explicit-any': 0,
          'parsing-error': 0,
          'other': 0
        };
      }
    }
  }

  // Count errors by rule
  if (line.includes('design-system/no-classname')) {
    errorGroups['design-system/no-classname'].push(currentFile);
    if (currentFile) fileErrors[currentFile]['design-system/no-classname']++;
  } else if (line.includes('design-system/no-tailwind-classes')) {
    errorGroups['design-system/no-tailwind-classes'].push(currentFile);
    if (currentFile) fileErrors[currentFile]['design-system/no-tailwind-classes']++;
    
    // Extract Tailwind pattern
    const patternMatch = line.match(/Tailwind class '([^']+)'/);
    if (patternMatch) {
      const pattern = patternMatch[1];
      tailwindPatterns.set(pattern, (tailwindPatterns.get(pattern) || 0) + 1);
    }
  } else if (line.includes('react/jsx-no-duplicate-props')) {
    errorGroups['react/jsx-no-duplicate-props'].push(currentFile);
    if (currentFile) fileErrors[currentFile]['react/jsx-no-duplicate-props']++;
  } else if (line.includes('@typescript-eslint/no-unused-vars')) {
    errorGroups['@typescript-eslint/no-unused-vars'].push(currentFile);
    if (currentFile) fileErrors[currentFile]['@typescript-eslint/no-unused-vars']++;
  } else if (line.includes('@typescript-eslint/no-explicit-any')) {
    errorGroups['@typescript-eslint/no-explicit-any'].push(currentFile);
    if (currentFile) fileErrors[currentFile]['@typescript-eslint/no-explicit-any']++;
  } else if (line.includes('Parsing error')) {
    errorGroups['parsing-error'].push(currentFile);
    if (currentFile) fileErrors[currentFile]['parsing-error']++;
  }
});

// Calculate totals
const totalsByRule = {};
Object.keys(errorGroups).forEach(rule => {
  totalsByRule[rule] = errorGroups[rule].length;
});

// Get top files by error count
const filesSorted = Object.entries(fileErrors)
  .map(([file, counts]) => ({
    file,
    total: Object.values(counts).reduce((a, b) => a + b, 0),
    ...counts
  }))
  .sort((a, b) => b.total - a.total);

// Get top Tailwind patterns
const patternsArray = Array.from(tailwindPatterns.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);

// === REPORT ===
console.log('═'.repeat(80));
console.log('📊 ERROR DISTRIBUTION BY RULE');
console.log('═'.repeat(80));

const sortedRules = Object.entries(totalsByRule)
  .sort((a, b) => b[1] - a[1]);

sortedRules.forEach(([rule, count]) => {
  const percentage = ((count / Object.values(totalsByRule).reduce((a, b) => a + b, 0)) * 100).toFixed(1);
  console.log(`  ${rule.padEnd(40)} ${String(count).padStart(5)} errors (${percentage}%)`);
});

console.log(`\n  TOTAL: ${Object.values(totalsByRule).reduce((a, b) => a + b, 0)} errors\n`);

// Top files
console.log('═'.repeat(80));
console.log('📁 TOP 20 FILES WITH MOST ERRORS');
console.log('═'.repeat(80));

filesSorted.slice(0, 20).forEach((item, idx) => {
  console.log(`  ${String(idx + 1).padStart(2)}. ${item.file.padEnd(50)} ${item.total} errors`);
  console.log(`     ├─ no-classname: ${item['design-system/no-classname']}`);
  console.log(`     ├─ no-tailwind-classes: ${item['design-system/no-tailwind-classes']}`);
  console.log(`     ├─ no-duplicate-props: ${item['react/jsx-no-duplicate-props']}`);
  console.log(`     └─ other: ${item['@typescript-eslint/no-unused-vars'] + item['@typescript-eslint/no-explicit-any'] + item['parsing-error']}`);
});

// Top Tailwind patterns
console.log('\n' + '═'.repeat(80));
console.log('🎨 TOP 20 TAILWIND PATTERNS STILL IN USE');
console.log('═'.repeat(80));

patternsArray.forEach(([pattern, count], idx) => {
  const percent = ((count / totalsByRule['design-system/no-tailwind-classes']) * 100).toFixed(1);
  console.log(`  ${String(idx + 1).padStart(2)}. ${pattern.padEnd(50)} ${String(count).padStart(4)} (${percent}%)`);
});

// === STRATEGY RECOMMENDATIONS ===
console.log('\n' + '═'.repeat(80));
console.log('🎯 PHASE 4 STRATEGY - GROUP-BY-GROUP REMEDIATION');
console.log('═'.repeat(80));

const noClassNameCount = totalsByRule['design-system/no-classname'];
const noTailwindCount = totalsByRule['design-system/no-tailwind-classes'];
const duplicatePropsCount = totalsByRule['react/jsx-no-duplicate-props'];
const otherCount = Object.values(totalsByRule).reduce((a, b) => a + b, 0) - noClassNameCount - noTailwindCount - duplicatePropsCount;

console.log(`
📌 GROUP 1: className + Tailwind Pattern (Highest Priority)
   Files: ${filesSorted.slice(0, 5).map(f => f.file).join(', ...')}
   Strategy: Use ultra-aggressive converter batch
   Expected Reduction: ~300-400 errors
   Command: node batch-convert.js [files...]

📌 GROUP 2: Duplicate Props Issues (Quick Win)
   Count: ${duplicatePropsCount} errors
   Strategy: Manual fixes for JSX style prop consolidation
   Expected Reduction: ~200-300 errors
   Effort: LOW - Simple prop consolidation

📌 GROUP 3: TypeScript Issues (no-unused-vars, no-explicit-any)
   Count: ${Object.values(totalsByRule).reduce((a, b) => a + b, 0) - noClassNameCount - noTailwindCount - duplicatePropsCount}
   Strategy: Code cleanup + type annotations
   Expected Reduction: ~100-150 errors
   Effort: MEDIUM - Type system updates

📌 GROUP 4: Remaining Tailwind Patterns (Edge Cases)
   Patterns with MD3 tokens embedded: rounded-[var(...)]
   Strategy: Enhanced regex patterns for complex classNames
   Expected Reduction: ~200-300 errors

🎯 CUMULATIVE PHASE 4 TARGET:
   Current: 5,373 errors
   Target:  ~3,500-4,000 errors (33% further reduction)
   Effort:  4-6 hours with batch automation
`);

console.log('═'.repeat(80));
console.log('✅ Analysis complete!\n');

// Write summary to file
fs.writeFileSync(
  path.join(__dirname, 'ERROR_ANALYSIS_REPORT.md'),
  `# Phase 4 Error Analysis Report

## Error Distribution
${sortedRules.map(([rule, count]) => {
  const percentage = ((count / Object.values(totalsByRule).reduce((a, b) => a + b, 0)) * 100).toFixed(1);
  return `- **${rule}**: ${count} errors (${percentage}%)`;
}).join('\n')}

## Top 20 Files by Error Count
${filesSorted.slice(0, 20).map((item, idx) => {
  return `${idx + 1}. ${item.file} (${item.total} errors)`;
}).join('\n')}

## Top 20 Tailwind Patterns
${patternsArray.map(([pattern, count], idx) => {
  const percent = ((count / totalsByRule['design-system/no-tailwind-classes']) * 100).toFixed(1);
  return `${idx + 1}. \`${pattern}\` (${count} occurrences, ${percent}%)`;
}).join('\n')}

## Strategy
${`GROUP 1: className + Tailwind Pattern
GROUP 2: Duplicate Props Issues  
GROUP 3: TypeScript Issues
GROUP 4: Remaining Tailwind Patterns`}
`
);

console.log('📄 Report saved to ERROR_ANALYSIS_REPORT.md\n');
