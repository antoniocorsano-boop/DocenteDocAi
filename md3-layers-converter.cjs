const fs = require('fs');
const path = require('path');

/**
 * MD3 Layers Reference Converter
 * Script dedicato per completare la conversione dei riferimenti layers. rimanenti
 */

// Mappatura sicura dei tokens MD3
const MD3_TOKEN_MAP = {
  // Spacing
  "layers.ref.spacing['1']": 'var(--md-sys-spacing-1)',
  "layers.ref.spacing['2']": 'var(--md-sys-spacing-2)',
  "layers.ref.spacing['3']": 'var(--md-sys-spacing-3)',
  "layers.ref.spacing['4']": 'var(--md-sys-spacing-4)',
  "layers.ref.spacing['5']": 'var(--md-sys-spacing-5)',
  "layers.ref.spacing['6']": 'var(--md-sys-spacing-6)',
  "layers.ref.spacing['7']": 'var(--md-sys-spacing-7)',
  "layers.ref.spacing['8']": 'var(--md-sys-spacing-8)',
  "layers.ref.spacing['12']": 'var(--md-sys-spacing-12)',
  "layers.ref.spacing['14']": 'var(--md-sys-spacing-14)',
  "layers.ref.spacing['16']": 'var(--md-sys-spacing-16)',
  "layers.ref.spacing['80']": 'var(--md-sys-spacing-80)',

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
  "layers.ref.shape.small": 'var(--md-sys-shape-corner-small)',

  // Elevation
  "layers.sys.elevation.level1": 'var(--md-sys-elevation-level1)',
  "layers.sys.elevation.level2": 'var(--md-sys-elevation-level2)',
  "layers.sys.elevation.level3": 'var(--md-sys-elevation-level3)',
  "layers.elevation.level1": 'var(--md-sys-elevation-level1)',
  "layers.elevation.level2": 'var(--md-sys-elevation-level2)',

  // Motion
  "layers.sys.motion.duration.short2": 'var(--md-sys-motion-duration-short2)',
  "layers.sys.motion.duration.medium": 'var(--md-sys-motion-duration-medium)',
  "layers.sys.motion.easing.standard": 'var(--md-sys-motion-easing-standard)',
  "layers.sys.motion.easing.expressive": 'var(--md-sys-motion-easing-expressive)',
  "layers.motion.easing.standard": 'var(--md-sys-motion-easing-standard)',
  "layers.motion.easing.expressive": 'var(--md-sys-motion-easing-expressive)',
  "layers.motion.duration.short": 'var(--md-sys-motion-duration-short2)',
  "layers.motion.duration.short2": 'var(--md-sys-motion-duration-short2)',
  "layers.motion.duration.medium": 'var(--md-sys-motion-duration-medium)',

  // Typography (basic mapping - may need refinement)
  "layers.ref.typography.labelLarge.fontWeight": 'var(--md-sys-typescale-label-large-font-weight)',
  "layers.ref.typography.labelLarge.fontSize": 'var(--md-sys-typescale-label-large-font-size)',
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
 * Converte tutti i riferimenti layers. in un file
 */
function convertLayersInFile(filePath) {
  console.log(`🔄 Converting layers refs in ${path.basename(filePath)}...`);

  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // Trova tutti i pattern layers.* nel contenuto - versione migliorata per multilinea
  // Prima cerca pattern completi con parentesi
  const layersPatterns = [
    /layers\.[^\s'";,}\n]+/g,  // Pattern semplice
    /layers\.[^'";,}\n]*\[[^\]]+\]/g,  // Pattern con parentesi quadre
  ];

  const allMatches = [];
  layersPatterns.forEach(regex => {
    const matches = content.match(regex);
    if (matches) {
      allMatches.push(...matches);
    }
  });

  if (allMatches.length > 0) {
    // Rimuovi duplicati e ordina per lunghezza decrescente
    const uniqueLayersRefs = [...new Set(allMatches)].sort((a, b) => b.length - a.length);

    uniqueLayersRefs.forEach(layersRef => {
      // Salta se contiene newline (pattern incompleto)
      if (layersRef.includes('\n')) return;

      // Salta pattern incompleti che finiscono con [ o . senza completamento
      if (layersRef.endsWith('[') || layersRef.endsWith('.') || layersRef.match(/\[$/)) {
        console.log(`⚠️  Skipping incomplete pattern: ${layersRef}`);
        return;
      }

      // Salta pattern che sembrano riferimenti a proprietà non esistenti
      if (layersRef.includes('*')) return;

      const md3Token = convertLayersRef(layersRef);
      if (md3Token !== layersRef) {
        try {
          // Usa word boundaries per essere più precisi
          const regex = new RegExp('\\b' + layersRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
          content = content.replace(regex, md3Token);
          hasChanges = true;
          console.log(`✅ ${layersRef} → ${md3Token}`);
        } catch (error) {
          console.log(`❌ Error converting ${layersRef}: ${error.message}`);
        }
      } else {
        console.log(`⚠️  Unmapped layers reference: ${layersRef}`);
      }
    });
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${path.basename(filePath)}`);
    return true;
  } else {
    console.log(`⏭️  No layers refs found in ${path.basename(filePath)}`);
    return false;
  }
}

/**
 * Trova tutti i componenti che hanno ancora riferimenti layers.
 */
function findComponentsWithLayersRefs() {
  const componentsDir = path.join(__dirname, 'src', 'components');
  const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

  const componentsWithLayers = [];

  files.forEach(file => {
    const filePath = path.join(componentsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    if (/layers\./.test(content)) {
      componentsWithLayers.push({
        file,
        layersRefs: (content.match(/layers\./g) || []).length
      });
    }
  });

  return componentsWithLayers;
}

// Se eseguito direttamente
if (require.main === module) {
  const componentsWithLayers = findComponentsWithLayersRefs();

  if (componentsWithLayers.length === 0) {
    console.log('🎉 No components with layers. references found!');
    process.exit(0);
  }

  console.log(`📋 Found ${componentsWithLayers.length} components with layers. references:`);
  componentsWithLayers.forEach(comp => {
    console.log(`  - ${comp.file}: ${comp.layersRefs} references`);
  });

  console.log('\n🚀 Starting conversion...');

  let converted = 0;
  componentsWithLayers.forEach(comp => {
    const filePath = path.join(__dirname, 'src', 'components', comp.file);
    if (convertLayersInFile(filePath)) {
      converted++;
    }
  });

  console.log(`\n🎉 Conversion completed!`);
  console.log(`✅ Converted ${converted}/${componentsWithLayers.length} components`);
}

module.exports = { convertLayersInFile, findComponentsWithLayersRefs, convertLayersRef };