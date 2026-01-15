#!/usr/bin/env node
/**
 * Fix theme token path references to include .layers
 */

const fs = require('fs');
const path = require('path');

const files = [
  'src/components/Settings.tsx',
  'src/components/HelpModal.tsx',
  'src/components/App.tsx',
  'src/components/VideoAnalysisModal.tsx'
];

// Correction mappings - replace incorrect short paths with correct long paths
const corrections = {
  'theme.colors.': 'theme.layers.sys.colors.',
  'theme.shape.': 'theme.layers.ref.shape.',
  'theme.spacing.': 'theme.layers.ref.spacing.',
  'theme.motion.': 'theme.layers.motion.',
  'theme.elevation.': 'theme.layers.elevation.',
};

function fixFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⏭️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  const original = content;
  
  // Apply all corrections
  Object.entries(corrections).forEach(([from, to]) => {
    // Only replace if not already corrected
    if (!content.includes(to)) {
      content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
    }
  });
  
  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Fixed token paths: ${filePath}`);
    return true;
  } else {
    console.log(`⏭️  Already correct: ${filePath}`);
    return false;
  }
}

try {
  files.forEach(file => fixFile(file));
  console.log('\n✅ All token paths corrected!');
} catch (error) {
  console.error('❌ Fix failed:', error.message);
  process.exit(1);
}
