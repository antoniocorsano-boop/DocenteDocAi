const fs = require('fs');
const path = require('path');

// Analyze className patterns in components
function analyzeClassNamePatterns() {
  const componentsDir = 'src/components';
  const results = {
    components: [],
    totalUsages: 0,
    patterns: {}
  };

  const files = fs.readdirSync(componentsDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => path.join(componentsDir, file));

  console.log(`Found ${files.length} tsx files`);

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const classNameMatches = content.match(/className\s*=\s*['"][^'"]*['"]/g);

    if (classNameMatches && classNameMatches.length > 0) {
      const componentName = path.basename(filePath, '.tsx');
      console.log(`${componentName}: ${classNameMatches.length} matches`);
      results.components.push({
        name: componentName,
        usages: classNameMatches.length,
        patterns: classNameMatches
      });
      results.totalUsages += classNameMatches.length;

      // Analyze patterns
      classNameMatches.forEach(match => {
        const classStringMatch = match.match(/className\s*=\s*['"]([^'"]*)['"]/);
        if (classStringMatch && classStringMatch[1]) {
          const classes = classStringMatch[1].split(/\s+/);

          classes.forEach(cls => {
            if (cls.trim()) {
              results.patterns[cls] = (results.patterns[cls] || 0) + 1;
            }
          });
        }
      });
    }
  });

  return results;
}

// Generate Block B migration plan
function generateMigrationPlan(analysis) {
  console.log('=== BLOCK B MIGRATION PLAN ===');
  console.log(`Components to migrate: ${analysis.components.length}`);
  console.log(`Total className usages: ${analysis.totalUsages}`);
  console.log('');

  console.log('TOP 10 COMPONENTS BY USAGE:');
  analysis.components.slice(0, 10).forEach((comp, i) => {
    console.log(`${i+1}. ${comp.name}: ${comp.usages} usages`);
  });
  console.log('');

  console.log('MOST COMMON CLASS PATTERNS:');
  const sortedPatterns = Object.entries(analysis.patterns)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20);

  sortedPatterns.forEach(([pattern, count]) => {
    console.log(`${pattern}: ${count} usages`);
  });

  // Save detailed analysis
  fs.writeFileSync('block_b_analysis.json', JSON.stringify(analysis, null, 2));
  console.log('');
  console.log('Detailed analysis saved to block_b_analysis.json');
}

const analysis = analyzeClassNamePatterns();
generateMigrationPlan(analysis);