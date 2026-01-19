const fs = require('fs');

try {
  const output = fs.readFileSync('lint_output.txt', 'utf8');
  const lines = output.split('\n');

  const violations = {};
  let currentFile = '';

  lines.forEach(line => {
    // Check if this line contains a file path
    if (line.startsWith('C:') && line.includes('.tsx')) {
      const fileMatch = line.match(/([^\\\/]+\.tsx)/);
      if (fileMatch) {
        currentFile = fileMatch[1];
      }
    }
    // Check if this line contains a className violation
    else if (line.includes('className not allowed') && currentFile) {
      violations[currentFile] = (violations[currentFile] || 0) + 1;
    }
  });

  const sorted = Object.entries(violations)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  console.log('Top 10 components with className violations for Block L:');
  sorted.forEach(([file, count]) => {
    console.log(`${file}: ${count} violations`);
  });

  const total = Object.values(violations).reduce((sum, count) => sum + count, 0);
  console.log(`\nTotal className violations remaining: ${total}`);

} catch (error) {
  console.error('Error:', error.message);
}