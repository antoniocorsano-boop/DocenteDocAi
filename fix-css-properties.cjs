const fs = require('fs');
const path = require('path');

// Function to fix CSS custom properties in a file
function fixCssProperties(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix var(--md-sys-*) without quotes in style objects - more precise regex
  const originalContent = content;
  content = content.replace(/(\w+):\s*var\(--md-sys-[^)]+\)(?=\s*[,}])/g, (match, prop) => {
    const tokenMatch = match.match(/var\(--md-sys-[^)]+\)/);
    if (tokenMatch) {
      changed = true;
      return `${prop}: '${tokenMatch[0]}'`;
    }
    return match;
  });

  // Fix template literals with var(--md-sys-*) - more precise
  content = content.replace(/\$\{var\(--md-sys-[^}]*\)\}/g, (match) => {
    const tokenMatch = match.match(/var\(--md-sys-[^}]*\)/);
    if (tokenMatch) {
      changed = true;
      return tokenMatch[0];
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${filePath}`);
  }
}

// Find all .tsx files in src/components
const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir)
  .filter(file => file.endsWith('.tsx'))
  .map(file => path.join(componentsDir, file));

files.forEach(fixCssProperties);
console.log('Finished fixing CSS properties in all components');