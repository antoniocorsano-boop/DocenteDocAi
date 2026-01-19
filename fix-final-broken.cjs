const fs = require('fs');

// Fix remaining broken CSS patterns
function fixBrokenPatterns(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix all remaining broken patterns
  const patterns = [
    [/'var\(--md-sys-[^']+'\)'Container/g, (match) => match.replace(/'Container$/, "'")],
    [/'var\(--md-sys-[^']+'\)'est/g, (match) => match.replace(/'est$/, "'")],
    [/"var\(--md-sys-[^"]+"\)"Container/g, (match) => match.replace(/"Container$/, '"')],
    [/"var\(--md-sys-[^"]+"\)"est/g, (match) => match.replace(/"est$/, '"')]
  ];

  patterns.forEach(([regex, replacer]) => {
    const original = content;
    content = content.replace(regex, replacer);
    if (content !== original) {
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed ' + filePath);
  }
}

// Fix the identified broken files
const brokenFiles = [
  'src/components/CircolareAnalysisModal.tsx',
  'src/components/Menu.tsx',
  'src/components/StudentActionMenu.tsx',
  'src/components/Timetable.tsx'
];

brokenFiles.forEach(fixBrokenPatterns);
console.log('All broken CSS patterns fixed');