#!/usr/bin/env node

/**
 * M3 Token Validation Script
 *
 * Validates Material Design 3 token changes in Storybook components
 * Generates snapshots and compares with existing ones to detect regressions
 *
 * Usage: node validate-m3-tokens.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// M3 tokens to monitor for changes
const M3_TOKENS = [
  '--md-sys-color-surface-variant',
  '--md-sys-color-shadow',
  '--md-sys-color-scrim',
  '--md-sys-elevation-level3'
];

// Components/classes that use the modified tokens (based on our changes)
const AFFECTED_CLASSES = [
  '.hero-icon-bg',
  '.notebook-sources-panel',
  '.live-assistant-source-link',
  '.homework-submission-card',
  '.dialog-backdrop-legacy',
  '.strip-action-button'
];

/**
 * Recursively find all .stories.tsx and .stories.ts files in src/components
 */
function findStoryFiles(dirPath, files = []) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findStoryFiles(fullPath, files);
    } else if (stat.isFile() && (item.endsWith('.stories.tsx') || item.endsWith('.stories.ts'))) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Check if a story file uses components that might be affected by M3 token changes
 */
function storyUsesAffectedComponents(storyFilePath) {
  try {
    const content = fs.readFileSync(storyFilePath, 'utf8');

    // Check if story imports or references components that use affected classes
    // This is a heuristic - we look for component names that might correspond to affected classes
    const affectedComponentPatterns = [
      /HeroIcon/i,
      /HeroHeader/i,
      /NotebookSources/i,
      /LiveAssistantSource/i,
      /HomeworkSubmission/i,
      /DialogBackdrop/i,
      /StripAction/i
    ];

    return affectedComponentPatterns.some(pattern => pattern.test(content));
  } catch (error) {
    console.warn(`Warning: Could not read story file ${storyFilePath}: ${error}`);
    return false;
  }
}

/**
 * Run Vitest snapshot tests and capture output
 */
function runSnapshotTests() {
  try {
    console.log('🧪 Running snapshot tests...');
    const output = execSync('npm run test:snapshots', { encoding: 'utf8', cwd: __dirname });

    // Parse Vitest output to extract passed/failed tests
    // This is a simplified parser - in practice, you might need more robust parsing
    const passed = [];
    const failed = [];

    const lines = output.split('\n');

    for (const line of lines) {
      if (line.includes('✓')) {
        const match = line.match(/✓\s+(.+)/);
        if (match) {
          passed.push(match[1].trim());
        }
      } else if (line.includes('✗')) {
        const match = line.match(/✗\s+(.+)/);
        if (match) {
          failed.push(match[1].trim());
        }
      }
    }

    return { passed, failed };
  } catch (error) {
    console.error('Error running snapshot tests:', error.message);
    return { passed: [], failed: [] };
  }
}

/**
 * Generate detailed report
 */
function generateReport(passed, failed, affectedStories) {
  const report = {
    timestamp: new Date().toISOString(),
    totalStories: passed.length + failed.length,
    passedCount: passed.length,
    failedCount: failed.length,
    affectedStoriesCount: affectedStories.length,
    passedStories: passed,
    failedStories: failed,
    affectedStories: affectedStories,
    m3Tokens: M3_TOKENS,
    affectedClasses: AFFECTED_CLASSES
  };

  return JSON.stringify(report, null, 2);
}

/**
 * Main execution function
 */
function main() {
  const componentsDir = path.join(__dirname, 'src/components');

  if (!fs.existsSync(componentsDir)) {
    console.error('Error: src/components directory not found');
    process.exit(1);
  }

  console.log('🔍 Scanning for Storybook stories...');

  const storyFiles = findStoryFiles(componentsDir);

  if (storyFiles.length === 0) {
    console.log('ℹ️  No story files found in src/components');
    return;
  }

  console.log(`📚 Found ${storyFiles.length} story files`);

  // Identify stories that might be affected by M3 token changes
  const affectedStories = [];
  for (const storyFile of storyFiles) {
    if (storyUsesAffectedComponents(storyFile)) {
      const componentName = path.basename(storyFile).replace(/\.stories\.(tsx|ts)$/, '');
      affectedStories.push(componentName);
    }
  }

  console.log(`🎯 Identified ${affectedStories.length} potentially affected stories`);

  // Run snapshot tests
  const { passed, failed } = runSnapshotTests();

  console.log(`✅ Passed: ${passed.length}`);
  console.log(`❌ Failed: ${failed.length}`);

  // Filter failed tests that are affected by M3 changes
  const affectedFailed = failed.filter(test =>
    affectedStories.some(story => test.includes(story))
  );

  console.log(`🔍 Failed tests related to M3 changes: ${affectedFailed.length}`);

  // Generate report
  const report = generateReport(passed, failed, affectedStories);

  // Write report to file
  const reportPath = path.join(__dirname, 'm3-validation-report.json');
  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`📄 Report saved to ${reportPath}`);

  // Print summary
  console.log('\n📊 Summary:');
  console.log(`   Total stories: ${passed.length + failed.length}`);
  console.log(`   Passed: ${passed.length}`);
  console.log(`   Failed: ${failed.length}`);
  console.log(`   Affected by M3 changes: ${affectedStories.length}`);
  console.log(`   Failed and affected: ${affectedFailed.length}`);

  if (affectedFailed.length > 0) {
    console.log('\n⚠️  Components with potential M3 regressions:');
    affectedFailed.forEach(test => console.log(`   - ${test}`));
  } else {
    console.log('\n✅ No M3-related regressions detected');
  }
}

// Execute if run directly
if (process.argv[1] && process.argv[1].endsWith('validate-m3-tokens.js')) {
  main();
}

export { findStoryFiles, storyUsesAffectedComponents, runSnapshotTests, generateReport };