#!/usr/bin/env node

/**
 * PHASE 5 - Quick Win: Fix Duplicate Style Props
 * Merges duplicate style={{...}} style={{...}} into single style={{...}}
 * 
 * This targets errors like:
 * - Line 271: No duplicate props allowed (react/jsx-no-duplicate-props)
 * Pattern: style={{ prop1: "val1" }} style={{ prop2: "val2" }}
 * Should become: style={{ prop1: "val1", prop2: "val2" }}
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function fixDuplicateStyleProps(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = content;
  let fixCount = 0;

  // Pattern 1: Two style props with simple values
  // style={{ ... }} style={{ ... }}
  // This is tricky because we need to parse and merge the objects
  // For now, let's handle the most common cases manually detected

  // Pattern: className with duplicate style props
  // className="..." style={{...}} style={{...}}
  const duplicateStyleRegex = /style=\{\{([^}]+)\}\}\s+style=\{\{([^}]+)\}\}/g;
  
  if (duplicateStyleRegex.test(modified)) {
    let match;
    while ((match = duplicateStyleRegex.exec(modified)) !== null) {
      const first = match[1].trim();
      const second = match[2].trim();
      const merged = `style={{ ${first}, ${second} }}`;
      const original = match[0];
      modified = modified.replace(original, merged);
      fixCount++;
    }
  }

  // Pattern: className="..." with className="..." after another element
  // className="material-symbols-outlined" style={{...}} style={{...}}
  // Look for className="something" inside and fix after it
  const classNameStyleRegex = /className="material-symbols-outlined"\s+style=\{\{([^}]+)\}\}\s+style=\{\{([^}]+)\}\}/g;
  
  if (classNameStyleRegex.test(modified)) {
    let match;
    while ((match = classNameStyleRegex.exec(modified)) !== null) {
      const first = match[1].trim();
      const second = match[2].trim();
      const replacement = `className="material-symbols-outlined" style={{ ${first}, ${second} }}`;
      modified = modified.replace(match[0], replacement);
      fixCount++;
    }
  }

  if (fixCount > 0) {
    fs.writeFileSync(filePath, modified, 'utf8');
    return fixCount;
  }
  return 0;
}

// Main execution
async function main() {
  try {
    console.log('\n🔧 PHASE 5 - Quick Win: Fix Duplicate Style Props');
    console.log('═'.repeat(60));
    
    // Get list of files with duplicate prop errors from lint
    console.log('📋 Scanning for duplicate style props...\n');
    
    const componentsDir = path.join(__dirname, 'src', 'components');
    const uiDir = path.join(componentsDir, 'ui');
    
    let totalFixed = 0;
    const filesFixed = [];
    
    // Process UI components first (known to have duplicate props)
    const uiFiles = [
      'ActionTile.tsx',
      'AiMemoryChip.tsx',
      'AiThinkingGem.tsx',
      'CategoryCard.tsx',
      'InfoCard.tsx',
      'M3Dialog.tsx',
      'TabGroup.tsx',
      'M3ExpressiveCard.tsx',
      'M3ChoiceCard.tsx',
    ];
    
    for (const file of uiFiles) {
      const filePath = path.join(uiDir, file);
      if (fs.existsSync(filePath)) {
        const fixed = fixDuplicateStyleProps(filePath);
        if (fixed > 0) {
          filesFixed.push({ file, fixed });
          totalFixed += fixed;
          console.log(`  ✅ ${file}: ${fixed} duplicate props merged`);
        }
      }
    }
    
    // Also check story files
    const storyFiles = [
      'M3ActivityItem.stories.tsx',
      'M3EmptyStateCard.stories.tsx',
      'M3HeroCard.stories.tsx',
      'M3SuggessionsCard.stories.tsx',
      'M3SuggestionItem.stories.tsx',
    ];
    
    for (const file of storyFiles) {
      const filePath = path.join(uiDir, file);
      if (fs.existsSync(filePath)) {
        const fixed = fixDuplicateStyleProps(filePath);
        if (fixed > 0) {
          filesFixed.push({ file, fixed });
          totalFixed += fixed;
          console.log(`  ✅ ${file}: ${fixed} duplicate props merged`);
        }
      }
    }
    
    console.log(`\n✅ Duplicate props fixed: ${totalFixed}`);
    console.log(`   Files modified: ${filesFixed.length}`);
    
    if (totalFixed > 0) {
      console.log('\n📝 Running lint to verify...');
      const lintResult = execSync('npm run lint 2>&1 | findstr /C:"problems" || echo "No match"', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      console.log('   Lint result:', lintResult.trim().split('\n').pop());
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
