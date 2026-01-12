#!/usr/bin/env node

/**
 * Massive Batch Converter - Convert ALL .tsx/.jsx files
 * Applies ultra-aggressive Tailwind to MD3 conversion
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function getAllTypeScriptFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .git, build directories
      if (!['node_modules', '.git', 'build', 'dist', '.next'].includes(item)) {
        files = files.concat(getAllTypeScriptFiles(fullPath));
      }
    } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

console.log('🔍 Scanning for all .tsx/.jsx files...\n');

const srcDir = path.join(process.cwd(), 'src');
const files = getAllTypeScriptFiles(srcDir);

console.log(`📝 Found ${files.length} TypeScript component files\n`);

let totalConverted = 0;
let successCount = 0;
let noChangesCount = 0;
let batchSize = 0;

console.log('🚀 Starting aggressive batch conversion...\n');

// Process in batches and show progress
const BATCH_SIZE = 50;
for (let i = 0; i < files.length; i += BATCH_SIZE) {
  const batch = files.slice(i, i + BATCH_SIZE);
  const batchNum = Math.floor(i / BATCH_SIZE) + 1;
  const totalBatches = Math.ceil(files.length / BATCH_SIZE);
  
  console.log(`\n📦 Batch ${batchNum}/${totalBatches} (${i + 1}-${Math.min(i + BATCH_SIZE, files.length)} of ${files.length})`);
  
  for (const file of batch) {
    try {
      const output = execSync(`node convert-ultra-aggressive.js "${file}" 2>&1`, {
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
      });

      const match = output.match(/Converted (\d+) className/);
      if (match) {
        const count = parseInt(match[1]);
        totalConverted += count;
        if (count > 0) {
          successCount++;
          process.stdout.write('✓');
        } else {
          noChangesCount++;
          process.stdout.write('·');
        }
      }
    } catch (e) {
      process.stdout.write('✗');
    }
    
    if ((i + batch.indexOf(file) + 1) % 50 === 0) {
      process.stdout.write(' ');
    }
  }
}

console.log(`\n\n📊 Massive conversion complete!\n`);
console.log(`📈 Statistics:`);
console.log(`   ✅ Files with conversions: ${successCount}`);
console.log(`   ⏭️  Files unchanged: ${noChangesCount}`);
console.log(`   📝 Total className conversions: ${totalConverted}`);
console.log(`   🎯 Avg conversions per file: ${(totalConverted / successCount).toFixed(2)}`);
console.log();

process.exit(0);
