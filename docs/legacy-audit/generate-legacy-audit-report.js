/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs').promises;
const path = require('path');

/**
 * Recursively finds all .tsx files in the given directory.
 * @param {string} dir - The directory to search in.
 * @returns {Promise<string[]>} An array of file paths.
 */
async function findTsxFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findTsxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Analyzes a .tsx file for legacy patterns.
 * @param {string} filePath - The path to the file.
 * @returns {Promise<Object>} An AuditEntry object.
 */
async function analyzeFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const componentName = path.basename(filePath, '.tsx');

  // Check for inline CSS classes
  const inlineClassPatterns = /\b(className\s*=\s*["'][^"']*(bg-|text-|border-|shadow-|rounded-|p-)[^"']*["'])/g;
  const hasInlineStyles = inlineClassPatterns.test(content);

  // Check for hardcoded styles in style objects
  const stylePatterns = /style\s*=\s*\{\s*\{[^}]*\b(color|backgroundColor|borderRadius|boxShadow|padding)\s*:/g;
  const hasHardcodedColors = stylePatterns.test(content);

  // Check for base components
  const baseComponents = ['M3SurfaceCard', 'M3HeroCard', 'M3SuggestionCard', 'M3SuggestionItem', 'M3ActivityItem', 'M3EmptyStateCard'];
  const usesBaseComponents = baseComponents.some(comp => content.includes(comp));

  // Determine if legacy
  const isLegacy = (hasInlineStyles || hasHardcodedColors) && !usesBaseComponents;

  // Generate notes
  let notes = '';
  if (isLegacy) {
    if (hasInlineStyles) {
      notes += 'Has inline CSS classes. ';
    }
    if (hasHardcodedColors) {
      notes += 'Has hardcoded styles. ';
    }
    notes += 'Consider migrating to base M3 components.';
  } else if (usesBaseComponents) {
    notes = 'Already migrated using base components.';
  } else {
    notes = 'No legacy patterns detected.';
  }

  return {
    componentName,
    filePath,
    inlineStyles: hasInlineStyles,
    hardcodedColors: hasHardcodedColors,
    migrated: usesBaseComponents,
    notes,
  };
}

/**
 * Main function to generate the legacy audit report.
 */
async function generateLegacyAuditReport() {
  const componentsDir = path.join(process.cwd(), 'src', 'components');
  const outputDir = path.join(process.cwd(), 'docs', 'legacy-audit');
  const outputFile = path.join(outputDir, 'legacy-component-audit.json');

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Find all .tsx files
  const tsxFiles = await findTsxFiles(componentsDir);

  // Analyze each file
  const components = [];
  for (const file of tsxFiles) {
    const entry = await analyzeFile(file);
    components.push(entry);
  }

  // Create report
  const report = {
    timestamp: new Date().toISOString(),
    components,
  };

  // Save to JSON
  await fs.writeFile(outputFile, JSON.stringify(report, null, 2));

  // Calculate summary
  const totalComponents = components.length;
  const legacyDetected = components.filter(c => (c.inlineStyles || c.hardcodedColors) && !c.migrated).length;
  const migrated = components.filter(c => c.migrated).length;

  // Log summary
  console.log(`Total components analyzed: ${totalComponents}`);
  console.log(`Legacy components detected: ${legacyDetected}`);
  console.log(`Migrated components: ${migrated}`);
}

// Run the script
generateLegacyAuditReport().catch(console.error);