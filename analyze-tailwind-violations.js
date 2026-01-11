#!/usr/bin/env node

/**
 * Analyze Tailwind CSS and className violations
 * Groups violations by file and provides conversion statistics
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('🔍 Running ESLint analysis...\n');
  
  // Run ESLint with JSON format
  let output;
  try {
    output = execSync('npx eslint src/components --ext .tsx --format=json', {
      encoding: 'utf-8',
      maxBuffer: 50 * 1024 * 1024 // 50MB buffer for large output
    });
  } catch (e) {
    output = e.stdout || '[]';
  }
  
  const results = JSON.parse(output || '[]');
  
  // Analyze violations by file
  const fileViolations = {};
  const tailwindClasses = new Set();
  
  results.forEach(file => {
    if (!file.messages) return;
    
    const tailwindCount = file.messages.filter(m => 
      m.ruleId === 'design-system/no-tailwind-classes'
    ).length;
    
    const classNameCount = file.messages.filter(m => 
      m.ruleId === 'design-system/no-classname'
    ).length;
    
    if (tailwindCount > 0 || classNameCount > 0) {
      const relPath = file.filePath.replace(/^.*[\\\/]docentedoc-ai[\\\/]/, '');
      
      fileViolations[relPath] = {
        tailwind: tailwindCount,
        className: classNameCount,
        total: tailwindCount + classNameCount,
        classes: new Set()
      };
      
      // Extract Tailwind class names
      file.messages
        .filter(m => m.ruleId === 'design-system/no-tailwind-classes')
        .forEach(m => {
          const match = m.message.match(/Tailwind class '([^']+)'/);
          if (match) {
            fileViolations[relPath].classes.add(match[1]);
            tailwindClasses.add(match[1]);
          }
        });
    }
  });
  
  // Sort by violation count
  const sorted = Object.entries(fileViolations)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 20);
  
  console.log('📊 TOP 20 FILES WITH VIOLATIONS:\n');
  console.log('File | Classes | className | Total');
  console.log('-----|---------|-----------|---------');
  
  sorted.forEach(([file, data]) => {
    console.log(`${file} | ${data.tailwind} | ${data.className} | ${data.total}`);
  });
  
  console.log('\n\n📦 MOST COMMON TAILWIND CLASSES:');
  
  const classFreq = {};
  sorted.forEach(([_, data]) => {
    data.classes.forEach(cls => {
      classFreq[cls] = (classFreq[cls] || 0) + 1;
    });
  });
  
  Object.entries(classFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .forEach(([cls, count]) => {
      console.log(`  ${cls}: ${count} occurrences`);
    });
    
  console.log(`\n✅ Analysis complete. ${results.length} files analyzed.`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
