const fs = require('fs');
const path = require('path');

const componentsDir = path.join(process.cwd(), 'src', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

const testComponents = [];
files.forEach(file => {
  const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
  const duplicateCount = (content.match(/style=\{[^}]*\}\s*style=\{[^}]*\}/g) || []).length;
  const layersCount = (content.match(/layers\./g) || []).length;

  if ((duplicateCount > 0 || layersCount > 0) && duplicateCount <= 2) { // Componenti semplici per test
    testComponents.push({file, duplicateStyles: duplicateCount, layersRefs: layersCount, totalErrors: duplicateCount + layersCount});
  }
});

testComponents.sort((a, b) => a.totalErrors - b.totalErrors); // Ordina per semplicità
console.log('Componenti di test selezionati:');
testComponents.slice(0, 3).forEach((comp, i) => {
  console.log(`${i+1}. ${comp.file}: ${comp.totalErrors} errori totali`);
});

console.log('\nJSON per script:', JSON.stringify(testComponents.slice(0, 3)));