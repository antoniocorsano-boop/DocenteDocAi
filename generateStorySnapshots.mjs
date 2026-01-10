#!/usr/bin/env node

/**
 * Storybook Snapshot Test Generator
 *
 * Generates Vitest snapshot tests for Storybook stories in src/components
 * Uses @storybook/testing-react for modern story composition
 *
 * Usage: node generateStorySnapshots.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Recursively find all .stories.tsx and .stories.ts files in a directory
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
 * Generate test file content for a stories file
 */
function generateTestContent(storyFilePath, componentName) {
  const relativeStoryPath = path.relative(path.join(__dirname, 'src/components'), storyFilePath)
    .replace(/\\/g, '/')
    .replace(/\.stories\.(tsx|ts)$/, '');

  return `import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { composeStories } from '@storybook/testing-react';
import * as stories from './${relativeStoryPath}.stories';

describe('${componentName} Stories', () => {
  const storyMap = composeStories(stories);

  Object.entries(storyMap).forEach(([storyName, Story]) => {
    it(\`renders \${storyName}\`, () => {
      const { container } = render(<Story />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
`;
}

/**
 * Generate test file path from story file path
 */
function getTestFilePath(storyFilePath) {
  return storyFilePath.replace(/\.stories\.(tsx|ts)$/, '.stories.test.tsx');
}

/**
 * Extract component name from story file path
 */
function getComponentName(storyFilePath) {
  const fileName = path.basename(storyFilePath);
  return fileName.replace(/\.stories\.(tsx|ts)$/, '');
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

  let generatedCount = 0;
  let skippedCount = 0;

  for (const storyFile of storyFiles) {
    const testFilePath = getTestFilePath(storyFile);
    const componentName = getComponentName(storyFile);

    if (fs.existsSync(testFilePath)) {
      console.log(`⏭️  Skipping ${componentName} - test file already exists`);
      skippedCount++;
      continue;
    }

    const testContent = generateTestContent(storyFile, componentName);

    try {
      fs.writeFileSync(testFilePath, testContent, 'utf8');
      console.log(`✅ Generated test for ${componentName}`);
      generatedCount++;
    } catch (error) {
      console.error(`❌ Failed to generate test for ${componentName}: ${error.message}`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Generated: ${generatedCount} test files`);
  console.log(`   Skipped: ${skippedCount} existing test files`);
  console.log(`   Total stories: ${storyFiles.length}`);

  if (generatedCount > 0) {
    console.log(`\n🚀 Run 'npm run test' to execute the new snapshot tests`);
    console.log(`💡 Use 'npm run test -- --update' to update snapshots if needed`);
  }
}

// Execute if run directly
if (process.argv[1] && process.argv[1].endsWith('generateStorySnapshots.mjs')) {
  main();
}

export { findStoryFiles, generateTestContent, getTestFilePath, getComponentName };
