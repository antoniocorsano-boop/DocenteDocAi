const fs = require('fs');
const path = require('path');

// Function to fix malformed CSS values with ')est' suffix
function fixEstSuffixes(content) {
    // Fix patterns like: 'var(--md-sys-color-surface-container-low)'est
    // 'var(--md-sys-color-surface-container-low)'est/50
    // 'var(--md-sys-color-surface-container-low)'est/80
    const estPattern = /('var\([^)]+\))'est([/)\s])/g;

    return content.replace(estPattern, (match, varPart, suffix) => {
        return varPart + suffix;
    });
}

// Process all .tsx files in src directory
function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (file.endsWith('.tsx')) {
            console.log(`Processing ${filePath}`);

            const content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;
            const processedContent = fixEstSuffixes(content);

            if (processedContent !== originalContent) {
                fs.writeFileSync(filePath, processedContent);
                console.log(`Updated ${filePath}`);
            }
        }
    }
}

// Start processing from src directory
const srcDir = path.join(__dirname, 'src');
processDirectory(srcDir);

console.log('Malformed CSS values with )est suffix fixed!');