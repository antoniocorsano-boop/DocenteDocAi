#!/usr/bin/env node
/**
 * Fix Token References - Remove incorrect ${} wrapping
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Settings.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix: Remove ${} wrappers from token references in object literals
  // Pattern: ${theme.layers.X.Y} => theme.layers.X.Y
  content = content.replace(/\$\{(theme\.layers[^}]+)\}/g, '$1');
  
  // Fix pattern where spaces around: ${ theme.layers.X.Y }
  content = content.replace(/\$\{\s*(theme\.layers[^}]+)\s*\}/g, '$1');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('✅ Fixed all token references - removed incorrect ${} wrapping');
  
} catch (error) {
  console.error('❌ Fix failed:', error.message);
  process.exit(1);
}
