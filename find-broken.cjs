const fs = require('fs');
const path = require('path');

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx')).map(f => path.join(componentsDir, f));

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(')Container') || content.includes(')est')) {
    console.log(filePath + ' has broken CSS');
  }
});