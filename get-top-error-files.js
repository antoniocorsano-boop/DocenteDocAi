const fs = require('fs');

const content = fs.readFileSync('lint-phase4-analysis.txt', 'utf-8');

// Split by file sections (lines starting with C:\Users...\src\)
const filePattern = /C:\\Users[^:]*\\src\\([^:]+\.tsx?)/g;
const files = {};
let lastFile = null;
let errorCount = 0;

// Count lines per file section
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if this is a file header
  const fileMatch = line.match(/C:\\Users[^:]*\\src\\([^:]+\.tsx?)/);
  if (fileMatch) {
    if (lastFile) {
      files[lastFile] = errorCount;
    }
    lastFile = fileMatch[1];
    errorCount = 0;
  } else if (lastFile && (line.includes('error') || line.includes('warning'))) {
    errorCount++;
  }
}

// Add last file
if (lastFile) {
  files[lastFile] = errorCount;
}

// Sort and display
const sorted = Object.entries(files)
  .filter(([f, c]) => c > 0)
  .sort((a, b) => b[1] - a[1]);

console.log('📊 TOP 30 COMPONENT FILES WITH MOST ERRORS:\n');
sorted.slice(0, 30).forEach(([file, count], idx) => {
  console.log(`${String(idx + 1).padStart(2)}. ${String(count).padStart(3)} errors - ${file}`);
});

console.log(`\n📈 Summary:`);
console.log(`Total files with errors: ${sorted.length}`);
console.log(`Total error lines in components: ${sorted.reduce((a, b) => a + b[1], 0)}`);

// Write report
const report = sorted.slice(0, 30).map(([f, c], i) => 
  `${i + 1}. **${f}** - ${c} errors`
).join('\n');

fs.writeFileSync('TOP_30_ERROR_FILES.md', `# Top 30 Component Files with Most Errors\n\n${report}`);

console.log(`\n✅ Report saved to TOP_30_ERROR_FILES.md`);
