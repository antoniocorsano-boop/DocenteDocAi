#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the mappings for MD3 tokens to theme.layers
const tokenMappings = {
  'var(--md-sys-color-': 'layers.sys.colors.',
  'var(--md-sys-spacing-': "layers.ref.spacing['",
  'var(--md-sys-shape-corner-': 'layers.ref.shape.corner.',
  'var(--md-sys-elevation-': 'layers.sys.elevation.',
  'var(--md-sys-motion-duration-': 'layers.motion.duration.',
  'var(--md-sys-motion-easing-': 'layers.motion.easing.',
};

// Function to check if a file should be skipped
function shouldSkipFile(filePath) {
  const fileName = path.basename(filePath);
  // Skip story files and migration scripts
  return fileName.endsWith('.stories.tsx') || fileName.endsWith('.stories.ts') ||
         fileName.includes('migration') || fileName.includes('convert') ||
         fileName.includes('batch') || fileName.includes('analyze');
}

// Function to find all .tsx and .ts files in src/components/
function findComponentFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...findComponentFiles(fullPath));
    } else if ((item.endsWith('.tsx') || item.endsWith('.ts')) && !shouldSkipFile(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

// Function to check if useTheme is already imported
function hasUseThemeImport(content) {
  return /import\s*{\s*[^}]*useTheme[^}]*}\s*from\s*['"]@mui\/material['"]/m.test(content) ||
         /import\s*{\s*[^}]*useTheme[^}]*}\s*from\s*['"]@mui\/system['"]/m.test(content);
}

// Function to add useTheme import
function addUseThemeImport(content) {
  // Find the last import statement
  const importRegex = /^import\s+.*$/gm;
  const imports = content.match(importRegex);
  if (!imports) return content;

  const lastImport = imports[imports.length - 1];
  const lastImportIndex = content.lastIndexOf(lastImport) + lastImport.length;

  // Add useTheme to the last import if it's from @mui/material or @mui/system
  let newContent = content;
  if (lastImport.includes('@mui/material')) {
    newContent = content.replace(lastImport, lastImport.replace(/}$/, ', useTheme}'));
  } else if (lastImport.includes('@mui/system')) {
    newContent = content.replace(lastImport, lastImport.replace(/}$/, ', useTheme}'));
  } else {
    // Add a new import line
    newContent = content.slice(0, lastImportIndex) + '\nimport { useTheme } from \'@mui/material\';' + content.slice(lastImportIndex);
  }

  return newContent;
}

// Function to replace MD3 tokens in style attributes
function replaceTokensInStyle(content) {
  // Regex to find style attributes containing var(--md-*)
  const styleRegex = /style\s*=\s*{\s*{\s*([^}]*?var\(--md-[^}]*?)\s*}\s*}/g;
  let newContent = content;
  let match;

  while ((match = styleRegex.exec(content)) !== null) {
    const styleBlock = match[1];
    let newStyleBlock = styleBlock;

    // Replace var(--md-*) tokens - handle both quoted and unquoted cases
    const regex = /'var\(--md-sys-[^)]+\)'|var\(--md-sys-[^)]+\)/g;
    newStyleBlock = newStyleBlock.replace(regex, (match) => {
      // Remove quotes if present
      const token = match.replace(/^'|'$/g, '');
      
      // Extract the token type and value
      const tokenMatch = token.match(/var\(--md-sys-([^)]+)\)/);
      if (!tokenMatch) return match;
      
      const fullToken = tokenMatch[1]; // e.g., 'color-outline' or 'spacing-6'
      const parts = fullToken.split('-');
      const tokenType = parts[0];
      const tokenValue = parts.slice(1).join('-');
      
      if (tokenType === 'color') {
        return `layers.sys.colors.${tokenValue.replace(/-/g, '')}`;
      } else if (tokenType === 'spacing') {
        return `layers.ref.spacing['${tokenValue}']`;
      } else if (tokenType === 'shape' && parts[1] === 'corner') {
        return `layers.ref.shape.corner.${parts.slice(2).join('')}`;
      } else if (tokenType === 'elevation') {
        return `layers.sys.elevation.${tokenValue}`;
      } else if (tokenType === 'motion') {
        if (parts[1] === 'duration') {
          return `layers.motion.duration.${parts.slice(2).join('')}`;
        } else if (parts[1] === 'easing') {
          return `layers.motion.easing.${parts.slice(2).join('')}`;
        }
      }
      
      return match; // fallback
    });

    // Handle transition strings - convert to template literals
    newStyleBlock = newStyleBlock.replace(/'all layers\.motion\.duration\.([^']*)\s+layers\.motion\.easing\.([^']*)'/g,
      (match, duration, easing) => `\`all \${layers.motion.duration.${duration}} \${layers.motion.easing.${easing}}\``);

    // Handle other transition patterns
    newStyleBlock = newStyleBlock.replace(/'([^']*layers\.motion\.duration\.[^']*\s+layers\.motion\.easing\.[^']*)'/g,
      (match, content) => `\`${content.replace(/layers\.motion\.duration\.([^ ]+)\s+layers\.motion\.easing\.([^']*)/g, (m, d, e) => `\${layers.motion.duration.${d}} \${layers.motion.easing.${e}}`)}\``);

    // Replace the style block (keep the double braces)
    newContent = newContent.replace(match[0], `style={{${newStyleBlock}}}`);
  }

  return newContent;
}

// Function to add useTheme hook usage
function addUseThemeHook(content) {
  // Find the component function start - more flexible regex
  const functionRegex = /(?:export\s+)?(?:const|function)\s+\w+\s*(?::\s*[^=]+)?\s*=\s*(?:\([^)]*\)\s*=>)?\s*{/;
  const match = content.match(functionRegex);
  if (!match) return content;

  const functionStart = match.index + match[0].length;
  const beforeFunction = content.slice(0, functionStart);
  const afterFunction = content.slice(functionStart);

  // Check if layers is already destructured
  if (beforeFunction.includes('const { layers } = useTheme();')) {
    return content;
  }

  // Add the hook usage after the function start
  return beforeFunction + '\n  const { layers } = useTheme();' + afterFunction;
}

// Function to process a single file
function processFile(filePath) {
  console.log(`Processing ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if file contains var(--md-*) in style
  if (!/style\s*=\s*{\s*[^}]*var\(--md-[^}]*}/g.test(content)) {
    return; // No changes needed
  }

  // Replace tokens
  content = replaceTokensInStyle(content);

  // Check if useTheme is needed and add import
  if (!hasUseThemeImport(content)) {
    content = addUseThemeImport(content);
  }

  // Add useTheme hook usage
  content = addUseThemeHook(content);

  // Write back
  fs.writeFileSync(filePath, content, 'utf-8');
}

// Main function
function main() {
  const componentsDir = path.join(__dirname, 'src', 'components');
  if (!fs.existsSync(componentsDir)) {
    console.error('src/components directory not found');
    process.exit(1);
  }

  const files = findComponentFiles(componentsDir);
  console.log(`Found ${files.length} files to process`);

  for (const file of files) {
    try {
      processFile(file);
    } catch (error) {
      console.error(`Error processing ${file}: ${error.message}`);
    }
  }

  console.log('Migration completed');
}

if (require.main === module) {
  main();
}