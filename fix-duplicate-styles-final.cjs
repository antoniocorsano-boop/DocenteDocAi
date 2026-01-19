const fs = require('fs');
const path = require('path');

// Function to process a file and remove duplicate style attributes
function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Regex to match duplicate style attributes: style={{...}} style={{...}}
        // Keep only the first style attribute
        const duplicateStyleRegex = /style=\{\{([^}]*)\}\}\s*style=\{\{[^}]*\}\}/g;

        const newContent = content.replace(duplicateStyleRegex, (match, firstStyleContent) => {
            console.log(`Found duplicate style in ${filePath}: keeping first style`);
            modified = true;
            return `style={{${firstStyleContent}}}`;
        });

        if (modified) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Fixed duplicate styles in ${filePath}`);
        }

        return modified;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Function to recursively find all .tsx and .ts files
function findFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            files.push(...findFiles(fullPath));
        } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
            files.push(fullPath);
        }
    }

    return files;
}

// Main execution
const srcDir = path.join(__dirname, 'src');
console.log('Starting duplicate style attributes removal...');

const files = findFiles(srcDir);
let totalModified = 0;

for (const file of files) {
    if (processFile(file)) {
        totalModified++;
    }
}

console.log(`Duplicate style attributes removal completed! Processed ${files.length} files, modified ${totalModified} files.`);