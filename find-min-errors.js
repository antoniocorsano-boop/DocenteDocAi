const { execSync } = require('child_process');

// Run ESLint with JSON format and suppress warnings
let output;
try {
  output = execSync('npx eslint src/components --format json 2>&1', {
    encoding: 'utf-8',
    stdio: 'pipe',
    maxBuffer: 10 * 1024 * 1024
  });
} catch (err) {
  output = err.stdout || err.message;
}

// Try to extract JSON - find the first [ character
const jsonStart = output.indexOf('[');
if (jsonStart === -1) {
  console.error('No JSON found in output');
  console.error('Output:', output.substring(0, 500));
  process.exit(1);
}

let jsonStr = output.substring(jsonStart);
// Find the last ] character
const jsonEnd = jsonStr.lastIndexOf(']');
if (jsonEnd === -1) {
  console.error('No closing bracket found');
  process.exit(1);
}

jsonStr = jsonStr.substring(0, jsonEnd + 1);

let data;
try {
  data = JSON.parse(jsonStr);
} catch (err) {
  console.error('Failed to parse JSON:', err.message);
  console.error('JSON preview:', jsonStr.substring(0, 200));
  process.exit(1);
}

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
} else {
  console.log('\nNo files with 1-5 errors found!');
  console.log('\nTotal files with errors:', filesWithErrors.length);
  if (filesWithErrors.length > 0) {
    console.log('Files with fewest errors:', filesWithErrors.slice(0, 5).map(f => f.filePath.replace(/^.*[\\\/]components[\\\/]/, 'src/components/') + ` (${f.errorCount})`).join(', '));
  }
}
