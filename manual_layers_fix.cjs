const fs = require('fs');
const path = require('path');

const componentsDir = path.join('src', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

let converted = 0;

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // Converti pattern specifici rimanenti
  const conversions = [
    { from: "layers.ref.spacing['2']", to: 'var(--md-sys-spacing-2)' },
    { from: "layers.ref.spacing['1']", to: 'var(--md-sys-spacing-1)' },
    { from: "layers.ref.spacing['3']", to: 'var(--md-sys-spacing-3)' },
    { from: "layers.ref.spacing['12']", to: 'var(--md-sys-spacing-12)' },
    { from: "layers.ref.spacing['14']", to: 'var(--md-sys-spacing-14)' },
    { from: "layers.ref.spacing['16']", to: 'var(--md-sys-spacing-16)' },
    { from: "layers.ref.spacing['7']", to: 'var(--md-sys-spacing-7)' },
    { from: "layers.ref.spacing['80']", to: 'var(--md-sys-spacing-80)' },
  ];

  conversions.forEach(({ from, to }) => {
    if (content.includes(from)) {
      const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      content = content.replace(new RegExp(escaped, 'g'), to);
      hasChanges = true;
      console.log(`✅ ${file}: ${from} → ${to}`);
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    converted++;
  }
});

console.log(`\n🎉 Manual conversion completed! ${converted} components updated`);