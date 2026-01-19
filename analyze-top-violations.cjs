const fs = require('fs');
const report = JSON.parse(fs.readFileSync('md3-compliance-report.json', 'utf8'));
const components = report.components
  .filter(c => !c.compliant && (c.violations.tailwind > 0 || c.violations.className > 0))
  .sort((a, b) => (b.violations.tailwind + b.violations.className) - (a.violations.tailwind + a.violations.className))
  .slice(0, 10);

console.log('Top 10 components with most Tailwind/className violations:');
components.forEach((c, i) => {
  console.log(`${i+1}. ${c.name}: ${c.violations.tailwind} Tailwind, ${c.violations.className} className (total: ${c.totalViolations})`);
});