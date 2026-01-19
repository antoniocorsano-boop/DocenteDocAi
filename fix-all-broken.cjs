const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix )Container patterns in quoted strings
  content = content.replace(/"var\(--md-sys-[^)]+\)Container"/g, (match) => {
    return match.replace(/\)Container"$/, ')"');
  });

  // Fix )est patterns in quoted strings
  content = content.replace(/"var\(--md-sys-[^)]+\)est"/g, (match) => {
    return match.replace(/\)est"$/, ')"');
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed ' + filePath);
  }
}

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx')).map(f => path.join(componentsDir, f));
files.forEach(fixFile);