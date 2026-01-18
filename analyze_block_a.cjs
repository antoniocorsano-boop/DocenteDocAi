const fs = require('fs');
const path = require('path');

// Trova tutti i file con errori duplicate style
const findComponentsWithErrors = () => {
  const componentsDir = path.join(process.cwd(), 'src', 'components');
  const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

  const componentsWithErrors = [];

  files.forEach(file => {
    const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');

    // Conta gli style attributes duplicati
    const duplicateStyleMatches = content.match(/style=\{[^}]*\}\s*style=\{[^}]*\}/g);
    const duplicateCount = duplicateStyleMatches ? duplicateStyleMatches.length : 0;

    // Conta i layers.* references
    const layersMatches = content.match(/layers\./g);
    const layersCount = layersMatches ? layersMatches.length : 0;

    if (duplicateCount > 0 || layersCount > 0) {
      componentsWithErrors.push({
        file,
        duplicateStyles: duplicateCount,
        layersRefs: layersCount,
        totalErrors: duplicateCount + layersCount
      });
    }
  });

  return componentsWithErrors.sort((a, b) => b.totalErrors - a.totalErrors);
};

const errors = findComponentsWithErrors();
console.log('Componenti Block A da migrare:', errors.length);
console.log('\nTop 10 componenti con più errori:');
errors.slice(0, 10).forEach((comp, i) => {
  console.log(`${i+1}. ${comp.file}: ${comp.duplicateStyles} duplicate styles, ${comp.layersRefs} layers refs (totale: ${comp.totalErrors})`);
});

console.log('\nTotale errori rimanenti:', errors.reduce((sum, comp) => sum + comp.totalErrors, 0));

// Salva il JSON completo per l'automazione
fs.writeFileSync('all_block_a_components.json', JSON.stringify(errors, null, 2));
console.log('\n💾 Saved all components to all_block_a_components.json');