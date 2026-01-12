#!/usr/bin/env node

/**
 * Phase 4 - Direct file targeting approach
 * Manually target the top 30 files with most remaining errors
 * and apply convert-ultra-aggressive.js one by one
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('═'.repeat(80));
console.log('🎯 PHASE 4 - DIRECT FILE TARGETING');
console.log('═'.repeat(80));

// Top files from analysis with className errors (from lint-phase4-analysis.txt inspection)
const topFiles = [
  'src/components/ClassDashboard.tsx',
  'src/components/AnnualPlanningWizard.tsx',
  'src/components/AnalyticsHub.tsx',
  'src/components/ClassAnalytics.tsx',
  'src/components/WorkflowGuide.tsx',
  'src/components/ui/M3ExpressiveCard.tsx',
  'src/components/ui/UseCaseCard.tsx',
  'src/components/ui/M3ActivityItem.stories.tsx',
  'src/components/ui/M3SuggestionCard.stories.tsx',
  'src/components/ui/M3SuggestionItem.stories.tsx',
  'src/components/ui/M3EmptyStateCard.stories.tsx',
  'src/components/ui/M3HeroCard.stories.tsx',
  'src/components/ui/M3ChoiceCard.tsx',
  'src/components/ui/M3DatePicker.tsx',
  'src/components/ui/M3BadgedIcon.tsx',
  'src/components/ui/M3AnimatedIcon.tsx',
  'src/components/ui/TabGroup.tsx',
  'src/components/accessibility/SkipLink.tsx',
  'src/components/charts/AdvancedCharts.tsx',
  'src/components/charts/BarChart.tsx',
  'src/components/charts/DonutChart.tsx',
  'src/components/ModalContext.tsx',
  'src/context/ModalContext.tsx',
];

console.log(`\n🎯 Processing ${topFiles.length} files with convert-ultra-aggressive.js\n`);

let successCount = 0;
let failCount = 0;
let totalFiles = 0;

for (const file of topFiles) {
  const fullPath = path.join(__dirname, file);
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    console.log(`  ⚠️  File not found: ${file}`);
    failCount++;
    continue;
  }
  
  totalFiles++;
  try {
    console.log(`  🔄 Processing: ${file}`);
    const cmd = `node convert-ultra-aggressive.js "${fullPath}"`;
    execSync(cmd, { stdio: 'ignore' });
    successCount++;
    process.stdout.write(`     ✅ Success\n`);
  } catch (e) {
    failCount++;
    process.stdout.write(`     ❌ Failed\n`);
  }
}

console.log(`\n═`.repeat(40));
console.log(`\n📊 Results:\n`);
console.log(`  ✅ Successfully processed: ${successCount}/${totalFiles}`);
console.log(`  ❌ Failed: ${failCount}`);

console.log(`\n⏱️  Running npm run lint to measure impact...\n`);

try {
  const output = execSync('npm run lint 2>&1 | tail -5', { encoding: 'utf-8', stdio: 'pipe', maxBuffer: 20 * 1024 * 1024 });
  console.log(output);
} catch (e) {
  // Lint output
  const output = e.stdout || e.stderr || '';
  const match = output.match(/(\d+) problems?/);
  if (match) {
    console.log(`\n📈 New error count: ${match[1]}`);
  }
}

console.log(`\n✅ Phase 4 direct targeting complete!\n`);
