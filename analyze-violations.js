import fs from 'fs';

// Read ESLint JSON output
const data = JSON.parse(fs.readFileSync('eslint-components-remaining.json', 'utf8'));

// Filter and sort by violation count
const violations = data
  .filter(item => item.messages && item.messages.length > 0)
  .map(item => ({
    file: item.filePath.split('/').pop(),
    violations: item.messages.length
  }))
  .sort((a, b) => b.violations - a.violations)
  .slice(0, 10);

console.log('Top 10 components by violation count:');
violations.forEach(v => console.log(`${v.file}: ${v.violations} violations`));