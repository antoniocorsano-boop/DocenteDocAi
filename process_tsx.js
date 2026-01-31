const fs = require('fs');
const path = require('path');

// Function to process a .tsx file
function processTsxFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if already has the header
  if (content.startsWith('/* GENERATED: MD3 Platinum Recovery — DO NOT EDIT MANUALLY */')) {
    return; // Skip
  }

  // Add header
  content = '/* GENERATED: MD3 Platinum Recovery — DO NOT EDIT MANUALLY */\n\n' + content;

  // Update imports - this is simplistic, need to parse properly
  // For now, assume we replace import lines

  // For styles, replace hardcoded - simplistic
  content = content.replace(/'(\d+)px'/g, "'var(--md-sys-spacing-$1)'"); // rough
  // etc.

  // Add props if missing - hard

  // Add skeleton - hard

  // Add TODO

  fs.writeFileSync(filePath, content);
}

// Find all .tsx files
const componentsDir = path.join(__dirname, 'src', 'components');
function findTsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...findTsxFiles(fullPath));
    } else if (item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

const tsxFiles = findTsxFiles(componentsDir);
tsxFiles.forEach(processTsxFile);

console.log('Processed', tsxFiles.length, 'files');