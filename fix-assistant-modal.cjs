const fs = require('fs');

const path = 'src/components/AssistantModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix var(--md-sys-*) without quotes in style objects
content = content.replace(/(\w+):\s*var\(--md-sys-[^)]+\)/g, (match, prop) => {
  const token = match.match(/var\(--md-sys-[^)]+\)/)[0];
  return `${prop}: '${token}'`;
});

// Fix template literals with var(--md-sys-*)
content = content.replace(/\$\{var\(--md-sys-[^}]*\)\}/g, (match) => {
  const token = match.match(/var\(--md-sys-[^}]*\)/)[0];
  return token;
});

fs.writeFileSync(path, content);
console.log('Fixed AssistantModal.tsx');