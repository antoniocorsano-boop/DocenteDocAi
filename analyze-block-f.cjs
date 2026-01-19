const fs = require('fs');
const path = require('path');

function analyzeLegacyStylesViolations() {
  const reportPath = path.join(__dirname, 'md3-compliance-report.json');

  try {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const components = report.components;

    // Filter components with legacyStyles violations
    const componentsWithLegacyStyles = components
      .filter(comp => comp.violations.legacyStyles > 0)
      .sort((a, b) => b.violations.legacyStyles - a.violations.legacyStyles);

    console.log('🔍 Block F: Inline Styles Migration Analysis');
    console.log('=' .repeat(50));
    console.log(`📊 Total components with legacy styles: ${componentsWithLegacyStyles.length}`);
    console.log(`📊 Total legacy styles violations: ${report.violations.legacyStyles}`);
    console.log('');

    console.log('🎯 Top 20 High-Impact Components (Block F Priority):');
    console.log('-'.repeat(60));

    componentsWithLegacyStyles.slice(0, 20).forEach((comp, index) => {
      const violations = comp.violations.legacyStyles;
      const fileName = path.basename(comp.path, '.tsx');
      console.log(`${(index + 1).toString().padStart(2)}. ${fileName.padEnd(25)} | ${violations.toString().padStart(2)} violations`);
    });

    console.log('');
    console.log('📈 Violation Distribution:');
    const distribution = {
      '15+': componentsWithLegacyStyles.filter(c => c.violations.legacyStyles >= 15).length,
      '10-14': componentsWithLegacyStyles.filter(c => c.violations.legacyStyles >= 10 && c.violations.legacyStyles < 15).length,
      '5-9': componentsWithLegacyStyles.filter(c => c.violations.legacyStyles >= 5 && c.violations.legacyStyles < 10).length,
      '1-4': componentsWithLegacyStyles.filter(c => c.violations.legacyStyles >= 1 && c.violations.legacyStyles < 5).length
    };

    Object.entries(distribution).forEach(([range, count]) => {
      console.log(`  ${range} violations: ${count} components`);
    });

    return componentsWithLegacyStyles;

  } catch (error) {
    console.error('❌ Error analyzing report:', error.message);
    return [];
  }
}

analyzeLegacyStylesViolations();