#!/usr/bin/env node
/**
 * MD3 BADGE GENERATOR
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Purpose: Generate MD3 compliance badge for PR/README
 * Usage: node scripts/md3-generate-badge.cjs [--output README.md]
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const fs = require('fs');
const path = require('path');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// READ AUDIT REPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function readAuditReport(reportPath) {
  try {
    if (!fs.existsSync(reportPath)) {
      return null;
    }
    const content = fs.readFileSync(reportPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`⚠️  Failed to read ${reportPath}:`, error.message);
    return null;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BADGE GENERATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function generateBadge() {
  const themeReport = readAuditReport(path.join(process.cwd(), 'audit', 'theme-violations.json'));
  const motionReport = readAuditReport(path.join(process.cwd(), 'audit', 'motion-violations.json'));
  const componentReport = readAuditReport(path.join(process.cwd(), 'reports', 'md3-component-contract-violations.json'));

  const themeViolations = themeReport?.summary?.totalViolations || 0;
  const motionViolations = motionReport?.totalViolations || 0;
  const componentViolations = componentReport?.totalViolations || 0;

  const totalViolations = themeViolations + motionViolations + componentViolations;

  const isCompliant = totalViolations === 0;
  const badgeColor = isCompliant ? 'brightgreen' : 'red';
  const badgeLabel = isCompliant ? 'MD3%20COMPLIANT' : 'MD3%20VIOLATIONS';
  const badgeMessage = isCompliant ? 'PASSED' : `${totalViolations}%20violations`;

  const badgeUrl = `https://img.shields.io/badge/${badgeLabel}-${badgeMessage}-${badgeColor}?style=for-the-badge&logo=material-design`;

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏅 MD3 COMPLIANCE BADGE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log(`Status: ${isCompliant ? '✅ COMPLIANT' : `❌ ${totalViolations} violations`}\n`);

  if (!isCompliant) {
    console.log('Breakdown:');
    console.log(`  - Theme: ${themeViolations}`);
    console.log(`  - Motion: ${motionViolations}`);
    console.log(`  - Component: ${componentViolations}\n`);
  }

  console.log('Badge Markdown:\n');
  console.log(`![MD3 Compliance](${badgeUrl})\n`);

  console.log('Badge HTML:\n');
  console.log(`<img src="${badgeUrl}" alt="MD3 Compliance" />\n`);

  console.log('Badge URL:\n');
  console.log(`${badgeUrl}\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return {
    isCompliant,
    totalViolations,
    themeViolations,
    motionViolations,
    componentViolations,
    badgeUrl,
    markdown: `![MD3 Compliance](${badgeUrl})`,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if (require.main === module) {
  const badge = generateBadge();
  
  // Output JSON for CI/CD consumption
  const outputPath = path.join(process.cwd(), 'audit', 'md3-badge.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(badge, null, 2));
  
  console.log(`📄 Badge data saved: ${outputPath}\n`);
  
  process.exit(badge.isCompliant ? 0 : 1);
}

module.exports = { generateBadge };
