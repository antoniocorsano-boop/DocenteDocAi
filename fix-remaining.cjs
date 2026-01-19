const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix all remaining broken patterns
  content = content.replace(/"var\(--md-sys-[^"]+\)"Container/g, (match) => {
    return match.replace(/"Container$/, '"');
  });

  content = content.replace(/"var\(--md-sys-[^"]+\)"est/g, (match) => {
    return match.replace(/"est$/, '"');
  });

  if (content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed ' + filePath);
  }
}

const files = [
  'src/components/CorpusChat.tsx',
  'src/components/Menu.tsx',
  'src/components/StudentActionMenu.tsx',
  'src/components/Timetable.tsx'
];

files.forEach(fixFile);