const fs = require('fs');
const data = JSON.parse(fs.readFileSync('eslint-components-full.json', 'utf-8'));

// Filter files with errors
const filesWithErrors = data.filter(f => f.errorCount > 0);

// Sort by error count
filesWithErrors.sort((a, b) => a.errorCount - b.errorCount);

// Show only files with 1-5 errors
const minErrors = filesWithErrors.filter(f => f.errorCount <= 5);

console.log('=== Files with 1-5 errors ===\n');
minErrors.slice(0, 10).forEach(f => {
  const shortPath = f.filePath.replace(/^.*[\\\/]components[\\\/]/, 'src/components/');
  console.log(`${shortPath}: ${f.errorCount} error(s)`);
});

if (minErrors.length > 0) {
  console.log('\n=== BEST TARGET (Fewest Errors) ===');
  const best = minErrors[0];
  const shortPath = best.filePath.replace(/^.*[\\\/]components[\\\/]/, 'src/components/');
  console.log(`File: ${shortPath}`);
  console.log(`Error Count: ${best.errorCount}`);
  console.log(`\nErrors:`);
  best.messages.forEach((msg, i) => {
    console.log(`  ${i + 1}. Line ${msg.line}: [${msg.ruleId}] ${msg.message}`);
  });
}
