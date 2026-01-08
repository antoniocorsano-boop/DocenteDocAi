const { readFile, writeFile } = require('fs/promises');
const { join } = require('path');

/**
 * Reads the legacy component audit JSON file.
 * @param {string} filePath - The path to the JSON file.
 * @returns {Promise<Object>} The parsed audit data.
 */
async function readAuditData(filePath) {
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Generates a Markdown report from the audit data.
 * @param {Object} auditData - The audit data object.
 * @returns {string} The Markdown report as a string.
 */
function generateMarkdownReport(auditData) {
  const currentDate = new Date().toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let report = `# Legacy Component Audit Report\n\n`;
  report += `**Data:** ${currentDate}\n\n`;
  report += `**Timestamp ultima esecuzione:** ${auditData.timestamp}\n\n`;
  report += `**Descrizione:** Audit dei componenti legacy per migrazione al design system MD3\n\n`;

  // Sort components alphabetically by componentName
  const sortedComponents = auditData.components.sort((a, b) => a.componentName.localeCompare(b.componentName));

  report += `| Componente | File Path | Inline Styles | Hardcoded Colors | Migrated | Notes |\n`;
  report += `|------------|-----------|---------------|------------------|----------|-------|\n`;

  for (const component of sortedComponents) {
    const migratedIcon = component.migrated ? '✅' : '❌';
    const relativePath = component.filePath.replace(process.cwd(), '.');
    report += `| ${component.componentName} | ${relativePath} | ${component.inlineStyles ? 'Sì' : 'No'} | ${component.hardcodedColors ? 'Sì' : 'No'} | ${migratedIcon} | ${component.notes} |\n`;
  }

  return report;
}

/**
 * Main function to generate the legacy audit report.
 */
async function main() {
  const auditFilePath = join(__dirname, 'legacy-component-audit.json');
  const reportFilePath = join(__dirname, 'legacy-audit-report.md');

  try {
    const auditData = await readAuditData(auditFilePath);
    const report = generateMarkdownReport(auditData);
    await writeFile(reportFilePath, report, 'utf-8');
    console.log('Report generated successfully:', reportFilePath);
  } catch (error) {
    console.error('Error generating report:', error);
  }
}

// Run the script
main();