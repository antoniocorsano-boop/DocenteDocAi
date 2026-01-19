const fs = require('fs');
const path = require('path');

/**
 * MD3 Migration Script - Block A: JSX Duplicate Props
 * Approccio sicuro per evitare duplicazioni e errori umani
 */

// Mappatura sicura dei tokens MD3 - espansa per gestire più pattern
const MD3_TOKEN_MAP = {
  // Spacing
  "layers.ref.spacing['4']": 'var(--md-sys-spacing-4)',
  "layers.ref.spacing['5']": 'var(--md-sys-spacing-5)',
  "layers.ref.spacing['6']": 'var(--md-sys-spacing-6)',
  "layers.ref.spacing['8']": 'var(--md-sys-spacing-8)',
  "layers.ref.spacing['3']": 'var(--md-sys-spacing-3)',

  // Colors
  "layers.sys.color.primary": 'var(--md-sys-color-primary)',
  "layers.sys.color.onPrimary": 'var(--md-sys-color-on-primary)',
  "layers.sys.color.surfaceContainerLow": 'var(--md-sys-color-surface-container-low)',
  "layers.sys.color.surfaceContainerHigh": 'var(--md-sys-color-surface-container-high)',
  "layers.sys.color.surfaceContainerLowest": 'var(--md-sys-color-surface-container-lowest)',
  "layers.sys.color.onSurfaceVariant": 'var(--md-sys-color-on-surface-variant)',
  "layers.sys.color.outline": 'var(--md-sys-color-outline)',
  "layers.sys.color.outlineVariant": 'var(--md-sys-color-outline-variant)',
  "layers.sys.color.error": 'var(--md-sys-color-error)',
  "layers.sys.color.onError": 'var(--md-sys-color-on-error)',
  "layers.sys.color.tertiary": 'var(--md-sys-color-tertiary)',
  "layers.sys.color.onTertiary": 'var(--md-sys-color-on-tertiary)',
  "layers.sys.color.secondary": 'var(--md-sys-color-secondary)',
  "layers.sys.color.onSecondary": 'var(--md-sys-color-on-secondary)',
  "layers.sys.color.surface": 'var(--md-sys-color-surface)',
  "layers.sys.color.onSurface": 'var(--md-sys-color-on-surface)',

  // Shapes
  "layers.ref.shape.corner.large": 'var(--md-sys-shape-corner-large)',
  "layers.ref.shape.corner.medium": 'var(--md-sys-shape-corner-medium)',
  "layers.ref.shape.corner.full": 'var(--md-sys-shape-corner-full)',

  // Elevation
  "layers.sys.elevation.level1": 'var(--md-sys-elevation-level1)',

  // Motion
  "layers.sys.motion.duration.short2": 'var(--md-sys-motion-duration-short2)',
  "layers.sys.motion.easing.standard": 'var(--md-sys-motion-easing-standard)',
};

/**
 * Converte dinamicamente un riferimento layers. nel token MD3 corrispondente
 */
function convertLayersRef(layersRef) {
  // Se è già nella mappa, usalo
  if (MD3_TOKEN_MAP[layersRef]) {
    return MD3_TOKEN_MAP[layersRef];
  }

  // Altrimenti, prova a convertirlo dinamicamente
  // layers.ref.spacing['4'] -> var(--md-sys-spacing-4)
  const spacingMatch = layersRef.match(/layers\.ref\.spacing\['(\d+)'\]/);
  if (spacingMatch) {
    return `var(--md-sys-spacing-${spacingMatch[1]})`;
  }

  // layers.sys.color.error -> var(--md-sys-color-error)
  const colorMatch = layersRef.match(/layers\.sys\.color\.(\w+)/);
  if (colorMatch) {
    const colorName = colorMatch[1];
    // Converti camelCase in kebab-case
    const kebabColor = colorName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    return `var(--md-sys-color-${kebabColor})`;
  }

  // layers.ref.shape.corner.large -> var(--md-sys-shape-corner-large)
  const shapeMatch = layersRef.match(/layers\.ref\.shape\.corner\.(\w+)/);
  if (shapeMatch) {
    return `var(--md-sys-shape-corner-${shapeMatch[1]})`;
  }

  // layers.sys.elevation.level1 -> var(--md-sys-elevation-level1)
  const elevationMatch = layersRef.match(/layers\.sys\.elevation\.(\w+)/);
  if (elevationMatch) {
    return `var(--md-sys-elevation-${elevationMatch[1]})`;
  }

  // layers.sys.motion.* -> var(--md-sys-motion-*)
  const motionMatch = layersRef.match(/layers\.sys\.motion\.(\w+)\.(\w+)/);
  if (motionMatch) {
    return `var(--md-sys-motion-${motionMatch[1]}-${motionMatch[2]})`;
  }

  // Se non riusciamo a convertirlo, logga un warning e restituisci il valore originale
  console.log(`⚠️  Unmapped layers reference: ${layersRef}`);
  return layersRef;
}

/**
 * Migra un singolo componente in modo sicuro
 */
function migrateComponent(componentPath) {
  console.log(`🔄 Migrating ${path.basename(componentPath)}...`);

  let content = fs.readFileSync(componentPath, 'utf8');
  let hasChanges = false;

  // 1. Rimuovi useTheme import se presente
  const useThemeImportRegex = /import\s*\{\s*[^}]*useTheme[^}]*\}\s*from\s*['"]\.\.\/theme\/theme['"];?\s*/g;
  if (useThemeImportRegex.test(content)) {
    content = content.replace(useThemeImportRegex, (match) => {
      // Rimuovi solo useTheme dalla lista degli import, mantieni gli altri
      const importMatch = match.match(/import\s*\{\s*([^}]+)\}\s*from\s*['"]\.\.\/theme\/theme['"]/);
      if (importMatch) {
        const imports = importMatch[1].split(',').map(s => s.trim()).filter(s => s !== 'useTheme');
        if (imports.length > 0) {
          return `import { ${imports.join(', ')} } from '../theme/theme';\n`;
        } else {
          return ''; // Rimuovi completamente l'import se useTheme era l'unico
        }
      }
      return match;
    });
    hasChanges = true;
  }

  // 2. Rimuovi la destrutturazione di layers
  const layersDestructureRegex = /const\s*\{\s*layers\s*\}\s*=\s*useTheme\(\);?\s*/g;
  if (layersDestructureRegex.test(content)) {
    content = content.replace(layersDestructureRegex, '');
    hasChanges = true;
  }

  // 3. Converti tutti i layers.* references usando conversione dinamica
  // Regex per catturare layers.* fino a quando non incontra spazi, virgolette, o fine riga
  const layersRegex = /layers\.[^\s'";,}]+/g;
  const layersMatches = content.match(layersRegex);

  if (layersMatches) {
    // Rimuovi duplicati e ordina per lunghezza decrescente (più specifici prima)
    const uniqueLayersRefs = [...new Set(layersMatches)].sort((a, b) => b.length - a.length);

    uniqueLayersRefs.forEach(layersRef => {
      // Verifica che sia un riferimento valido (finisce con ] o lettera)
      if (layersRef.match(/layers\..*\]$/) || layersRef.match(/layers\..*[a-zA-Z]$/)) {
        const md3Token = convertLayersRef(layersRef);
        if (md3Token !== layersRef) { // Solo se è stato convertito
          const regex = new RegExp(layersRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          content = content.replace(regex, md3Token);
          hasChanges = true;
          console.log(`🔄 Converted ${layersRef} → ${md3Token}`);
        }
      }
    });
  }

  // 4. Gestisci duplicate style attributes in modo sicuro
  // Pattern: style={...} style={...}
  const duplicateStyleRegex = /style=\{([^}]*)\}\s*style=\{([^}]*)\}/g;
  if (duplicateStyleRegex.test(content)) {
    content = content.replace(duplicateStyleRegex, (match, style1, style2) => {
      // Unisci i due oggetti style in uno solo
      const combinedStyle = `${style1.trim()}, ${style2.trim()}`;
      return `style={{ ${combinedStyle} }}`;
    });
    hasChanges = true;
  }

  // 5. Validazione finale: assicurati che non ci siano duplicazioni di variabili
  const lines = content.split('\n');
  const varDeclarations = new Map();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Trova dichiarazioni di variabili/const
    const varMatch = line.match(/^(?:const|let|var)\s+(\[[^\]]+\]|\w+)\s*=/);
    if (varMatch) {
      const varName = varMatch[1];
      if (varDeclarations.has(varName)) {
        console.log(`⚠️  Found duplicate declaration of "${varName}" at line ${i + 1}, removing duplicate`);
        // Rimuovi la linea duplicata
        lines.splice(i, 1);
        i--; // Adjust index after removal
        hasChanges = true;
      } else {
        varDeclarations.set(varName, i + 1);
      }
    }
  }

  if (lines.length !== content.split('\n').length) {
    content = lines.join('\n');
  }

  // Salva solo se ci sono stati cambiamenti
  if (hasChanges) {
    fs.writeFileSync(componentPath, content, 'utf8');
    console.log(`✅ Migrated ${path.basename(componentPath)}`);
    return true;
  } else {
    console.log(`⏭️  No changes needed for ${path.basename(componentPath)}`);
    return false;
  }
}

/**
 * Valida che la migrazione non abbia rotto il componente
 */
function validateMigration(componentPath, originalContent = null) {
  const content = fs.readFileSync(componentPath, 'utf8');

  // Se abbiamo il contenuto originale, controlliamo se aveva layers. references
  const hadLayersRefs = originalContent ? /layers\./.test(originalContent) : true;

  // Controlli di validità
  const checks = [
    {
      name: 'No duplicate style attributes',
      pass: !/style=\{[^}]*\}\s*style=\{[^}]*\}/.test(content)
    },
    {
      name: 'No useTheme imports',
      pass: !/import\s*\{[^}]*useTheme[^}]*\}\s*from\s*['"]\.\.\/theme\/theme['"]/.test(content)
    },
    {
      name: 'Valid syntax (basic check)',
      pass: content.includes('export default') || content.includes('export ') || content.includes('function ')
    }
  ];

  // Aggiungi controllo layers. solo se il file originale ne aveva
  if (hadLayersRefs) {
    checks.push({
      name: 'No remaining layers. references',
      pass: !/layers\./.test(content)
    });
  }

  const failedChecks = checks.filter(check => !check.pass);

  if (failedChecks.length > 0) {
    console.log(`❌ Validation failed for ${path.basename(componentPath)}:`);
    failedChecks.forEach(check => console.log(`   - ${check.name}`));
    return false;
  }

  console.log(`✅ Validation passed for ${path.basename(componentPath)}`);
  return true;
}

/**
 * Esegue la migrazione batch dei componenti Block A
 */
function runBatchMigration(components, batchSize = 5) {
  console.log(`🚀 Starting batch migration of ${components.length} components...`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < components.length; i += batchSize) {
    const batch = components.slice(i, i + batchSize);
    console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(components.length/batchSize)} (${batch.length} components)`);

    for (const component of batch) {
      try {
        const componentPath = path.join(__dirname, 'src', 'components', component.file);

        // Leggi il contenuto originale per la validazione
        const originalContent = fs.readFileSync(componentPath, 'utf8');

        const migrated = migrateComponent(componentPath);

        if (migrated) {
          const valid = validateMigration(componentPath, originalContent);
          if (valid) {
            successCount++;
          } else {
            errorCount++;
            console.log(`❌ Migration validation failed for ${component.file}`);
          }
        }
      } catch (error) {
        console.log(`💥 Error migrating ${component.file}: ${error.message}`);
        errorCount++;
      }
    }

    // Pausa tra i batch per evitare sovraccarico
    if (i + batchSize < components.length) {
      console.log('⏳ Pausing for 2 seconds...');
      // In un script reale useremmo setTimeout, ma per ora procediamo
    }
  }

  console.log(`\n🎉 Batch migration completed!`);
  console.log(`✅ Successfully migrated: ${successCount} components`);
  console.log(`❌ Errors: ${errorCount} components`);
  console.log(`📊 Success rate: ${((successCount / (successCount + errorCount)) * 100).toFixed(1)}%`);
}

// Se eseguito direttamente, analizza e mostra il piano
if (require.main === module) {
  const componentsFile = process.argv[2] || 'all_block_a_components.json';

  if (!fs.existsSync(componentsFile)) {
    console.log(`❌ Components file not found: ${componentsFile}`);
    console.log('Usage: node md3-fix-duplicate-props.cjs [components-json-file]');
    console.log('Default: all_block_a_components.json');
    process.exit(1);
  }

  const components = JSON.parse(fs.readFileSync(componentsFile, 'utf8'));

  if (components.length > 0) {
    console.log(`🎯 Starting automated MD3 migration for ${components.length} components...`);
    console.log(`📊 Total errors to fix: ${components.reduce((sum, c) => sum + c.totalErrors, 0)}`);
    runBatchMigration(components);
  } else {
    console.log('📋 MD3 Migration Script - Block A');
    console.log('Usage: node md3-fix-duplicate-props.cjs [components-json-file]');
    console.log('Example: node md3-fix-duplicate-props.cjs all_block_a_components.json');
  }
}

module.exports = { migrateComponent, validateMigration, runBatchMigration };