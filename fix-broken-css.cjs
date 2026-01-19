const fs = require('fs');
const path = require('path');

// Function to fix broken CSS properties
function fixBrokenCss(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix the broken patterns caused by previous script
  content = content.replace(/'var\(--md-sys-[^']*'\)Container/g, (match) => {
    const token = match.replace(/'Container$/, "'");
    changed = true;
    return token;
  });

  content = content.replace(/'var\(--md-sys-[^']*'\)est/g, (match) => {
    const token = match.replace(/'est$/, "'");
    changed = true;
    return token;
  });

  // Also fix any remaining unquoted var(--md-sys-*) patterns
  content = content.replace(/(\w+):\s*var\(--md-sys-[^)]+\)(?=\s*[,}])/g, (match, prop) => {
    const tokenMatch = match.match(/var\(--md-sys-[^)]+\)/);
    if (tokenMatch) {
      changed = true;
      return `${prop}: '${tokenMatch[0]}'`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed broken CSS in ${filePath}`);
  }
}

// Find all .tsx files in src/components
const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir)
  .filter(file => file.endsWith('.tsx'))
  .map(file => path.join(componentsDir, file));

files.forEach(fixBrokenCss);
console.log('Finished fixing broken CSS patterns');