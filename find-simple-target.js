const { execSync } = require('child_process');

const output = execSync('npx eslint src/components --format json', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
const data = JSON.parse(output);

// Find files with 1-3 ONLY className errors (no other error types)
const candidates = data.filter(f => {
  if (f.errorCount < 1 || f.errorCount > 3) return false;
  // All messages must be className/tailwind only
  return f.messages.length > 0 && f.messages.every(m => 
    m.ruleId === 'design-system/no-classname' || 
    m.ruleId === 'design-system/no-tailwind-classes'
  );
});

// Find simple components (not stories, modals, views)
const simple = candidates.filter(f => {
  const name = f.filePath.toLowerCase();
  return !name.includes('stories') && 
         !name.includes('modal') && 
         !name.includes('views') && 
         !name.includes('view.tsx');
});

if (simple.length > 0) {
  const target = simple[0];
  console.log('FILE:', target.filePath);
  console.log('ERROR_COUNT:', target.errorCount);
  const classNameErrors = target.messages.filter(m => m.ruleId === 'design-system/no-classname');
  classNameErrors.forEach(m => {
    console.log(`LINE_${m.line}:`, m.message);
  });
  
  // Also extract the actual className values from source
  const fs = require('fs');
  const source = fs.readFileSync(target.filePath, 'utf-8');
  const lines = source.split('\n');
  classNameErrors.forEach(m => {
    if (lines[m.line - 1]) {
      const classMatch = lines[m.line - 1].match(/className="([^"]+)"/);
      if (classMatch) {
        console.log(`CLASSNAME_VALUE_${m.line}:`, classMatch[1]);
      }
    }
  });
} else {
  console.log('No simple targets found');
  console.log('Candidates:', candidates.map(c => ({
    file: c.filePath.split('\\').pop(),
    errors: c.errorCount
  })));
}
