const fs = require('fs');
const content = fs.readFileSync('lint-phase4-analysis.txt', 'utf-8');
const files = {};

// Count errors per file  
const lines = content.split('\n');
for (const line of lines) {
  const match = line.match(/src[\\\/]([^:]+\.tsx?)/);
  if (match) {
    const file = match[1];
    files[file] = (files[file] || 0) + 1;
  }
}

// Sort by count
const sorted = Object.entries(files).sort((a, b) => b[1] - a[1]);
console.log('📊 Top 35 files with most errors:\n');
sorted.slice(0, 35).forEach(([file, count], idx) => {
  console.log(`${String(idx+1).padStart(2)}. ${String(count).padStart(4)} - ${file}`);
});

console.log('\n📈 Summary:');
console.log(`Total unique files with errors: ${Object.keys(files).length}`);
console.log(`Total error lines: ${Object.values(files).reduce((a,b) => a+b, 0)}`);
