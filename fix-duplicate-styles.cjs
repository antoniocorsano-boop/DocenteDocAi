const fs = require('fs');
const path = require('path');

// Function to merge duplicate style attributes in JSX
function mergeDuplicateStyles(content) {
  // Regex to find duplicate style attributes
  const duplicateStyleRegex = /style=\{([^}]+)\}\s+style=\{([^}]+)\}/g;

  return content.replace(duplicateStyleRegex, (match, style1, style2) => {
    // Parse the style objects (simplified - assumes simple key: value pairs)
    const merged = `{${style1}, ${style2}}`;
    return `style=${merged}`;
  });
}

// Function to fix duplicate styles in a file
function fixDuplicateStyles(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // More comprehensive regex for duplicate styles
  const styleRegex = /style=\{[^}]+\}\s+style=\{[^}]+\}/g;

  content = content.replace(styleRegex, (match) => {
    // Extract both style objects
    const styles = match.match(/style=\{([^}]+)\}/g);
    if (styles && styles.length === 2) {
      const style1 = styles[0].match(/style=\{([^}]+)\}/)[1];
      const style2 = styles[1].match(/style=\{([^}]+)\}/)[1];

      // Merge them
      const merged = `{${style1}, ${style2}}`;
      changed = true;
      return `style=${merged}`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed duplicate styles in ' + filePath);
  }

  return changed;
}

// Get all TypeScript/React files
function getAllTsxFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

// Fix all files
const srcDir = 'src';
const files = getAllTsxFiles(srcDir);

let totalFixed = 0;
for (const file of files) {
  if (fixDuplicateStyles(file)) {
    totalFixed++;
  }
}

console.log(`Fixed duplicate styles in ${totalFixed} files`);