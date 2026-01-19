const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix all known broken patterns
  content = content.replace(/'var\(--md-sys-[^']+'\)'Container/g, (match) => {
    return match.replace(/'Container$/, "'");
  });

  content = content.replace(/'var\(--md-sys-[^']+'\)'est/g, (match) => {
    return match.replace(/'est$/, "'");
  });

  if (content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed ' + filePath);
  }
}

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx')).map(f => path.join(componentsDir, f));
files.forEach(fixFile);