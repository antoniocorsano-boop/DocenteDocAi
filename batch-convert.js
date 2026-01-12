#!/usr/bin/env node

/**
 * Batch File Converter
 * Applies ultra-aggressive Tailwind to MD3 conversion to multiple files
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error('Usage: node batch-convert.js <file1> <file2> ...');
  process.exit(1);
}

let totalConverted = 0;
let successCount = 0;
let failCount = 0;

console.log(`\n🔄 Starting batch conversion of ${files.length} files...\n`);

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`⚠️  ${file} - File not found`);
    failCount++;
    continue;
  }

  try {
    const output = execSync(`node convert-ultra-aggressive.js "${file}" 2>&1`, {
      encoding: 'utf8'
    });

    const match = output.match(/Converted (\d+) className/);
    if (match) {
      const count = parseInt(match[1]);
      totalConverted += count;
      if (count > 0) {
        console.log(`✅ ${path.basename(file)} - ${count} conversions`);
        successCount++;
      } else {
        console.log(`⏭️  ${path.basename(file)} - No conversions needed`);
      }
    } else {
      console.log(`❓ ${path.basename(file)} - Unknown result`);
      failCount++;
    }
  } catch (e) {
    console.log(`❌ ${path.basename(file)} - Error: ${e.message.split('\n')[0]}`);
    failCount++;
  }
}

console.log(`\n📊 Batch conversion complete!`);
console.log(`✅ Successful: ${successCount} files`);
console.log(`❌ Failed: ${failCount} files`);
console.log(`📝 Total conversions: ${totalConverted} className attributes\n`);

process.exit(failCount > 0 ? 1 : 0);
