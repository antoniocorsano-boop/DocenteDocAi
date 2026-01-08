import { promises as fs } from 'fs';
import path from 'path';

/**
 * Interface for a component audit entry.
 */
interface ComponentAudit {
  componentName: string;
  filePath: string;
  inlineStyles: boolean;
  hardcodedColors: boolean;
  migrated: boolean;
  notes: string;
}

/**
 * Interface for the full audit report.
 */
interface AuditReport {
  timestamp: string;
  components: ComponentAudit[];
}

/**
 * Determines the migration status of a component.
 * @param component - The component audit entry.
 * @returns The migration status string.
 */
function getMigrationStatus(component: ComponentAudit): string {
  if (component.migrated) {
    return 'Migrato';
  }
  if (component.inlineStyles || component.hardcodedColors) {
    return 'Legacy';
  }
  return 'Nessun problema rilevato';
}

/**
 * Determines the types of stylistic issues detected.
 * @param component - The component audit entry.
 * @returns A string describing the issues.
 */
function getStylisticIssues(component: ComponentAudit): string {
  const issues: string[] = [];
  if (component.inlineStyles) {
    issues.push('Stili inline (classi CSS come bg-, text-, border-, ecc.)');
  }
  if (component.hardcodedColors) {
    issues.push('Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding)');
  }
  return issues.length > 0 ? issues.join('; ') : 'Nessuno';
}

/**
 * Generates recommendations based on the component status.
 * @param component - The component audit entry.
 * @returns A string with recommendations.
 */
function getRecommendations(component: ComponentAudit): string {
  if (component.migrated) {
    return 'Componente già migrato correttamente.';
  }
  if (component.inlineStyles || component.hardcodedColors) {
    return 'Migrare a componenti base M3 (M3SurfaceCard, M3HeroCard, ecc.) e utilizzare design tokens.';
  }
  return 'Nessuna azione richiesta.';
}

/**
 * Generates the Markdown report from the audit data.
 * @param auditData - The parsed audit report data.
 * @returns The Markdown report as a string.
 */
function generateMarkdownReport(auditData: AuditReport): string {
  const currentDate = new Date().toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let report = `# Report Audit Componenti Legacy\n\n`;
  report += `**Data Generazione:** ${currentDate}\n\n`;
  report += `**Timestamp Ultima Esecuzione Script:** ${auditData.timestamp}\n\n`;
  report += `**Descrizione:** Questo report analizza lo stato di migrazione dei componenti React verso il Design System MD3, identificando componenti legacy con stili inline o hardcoded.\n\n`;

  // Summary section
  const totalComponents = auditData.components.length;
  const migratedCount = auditData.components.filter(c => c.migrated).length;
  const legacyCount = auditData.components.filter(c => !c.migrated && (c.inlineStyles || c.hardcodedColors)).length;
  const cleanCount = totalComponents - migratedCount - legacyCount;

  report += `## Riepilogo\n\n`;
  report += `- **Totale Componenti Analizzati:** ${totalComponents}\n`;
  report += `- **Componenti Migrati:** ${migratedCount} (${((migratedCount / totalComponents) * 100).toFixed(1)}%)\n`;
  report += `- **Componenti Legacy:** ${legacyCount} (${((legacyCount / totalComponents) * 100).toFixed(1)}%)\n`;
  report += `- **Componenti Puliti:** ${cleanCount} (${((cleanCount / totalComponents) * 100).toFixed(1)}%)\n\n`;

  // Detailed table
  report += `## Dettagli Componenti\n\n`;
  report += `| Nome Componente | Stato Migrazione | Problemi Stilistici | Note/Raccomandazioni |\n`;
  report += `|-----------------|------------------|---------------------|----------------------|\n`;

  // Sort components alphabetically
  const sortedComponents = auditData.components.sort((a, b) => a.componentName.localeCompare(b.componentName));

  for (const component of sortedComponents) {
    const status = getMigrationStatus(component);
    const issues = getStylisticIssues(component);
    const recommendations = getRecommendations(component);
    const notes = component.notes || recommendations;

    report += `| ${component.componentName} | ${status} | ${issues} | ${notes} |\n`;
  }

  report += `\n## Note Finali\n\n`;
  report += `- **Legacy:** Componenti che richiedono attenzione per migrazione.\n`;
  report += `- **Migrato:** Componenti che utilizzano correttamente i base components M3.\n`;
  report += `- **Puliti:** Componenti senza problemi stilistici rilevati.\n`;
  report += `- Per ulteriori dettagli, consulta il file JSON \`legacy-component-audit.json\`.\n`;

  return report;
}

/**
 * Main function to read the JSON and generate the Markdown report.
 */
async function main() {
  const auditFilePath = path.join(__dirname, 'legacy-component-audit.json');
  const reportFilePath = path.join(__dirname, 'legacy-audit-report.md');

  try {
    const auditDataRaw = await fs.readFile(auditFilePath, 'utf-8');
    const auditData: AuditReport = JSON.parse(auditDataRaw);

    // Validate data structure
    if (!auditData.components || !Array.isArray(auditData.components)) {
      throw new Error('Invalid JSON structure: components array not found.');
    }

    const report = generateMarkdownReport(auditData);
    await fs.writeFile(reportFilePath, report, 'utf-8');

    console.log('✅ Report Markdown generato con successo:', reportFilePath);
    console.log(`📊 Analizzati ${auditData.components.length} componenti.`);
  } catch (error) {
    console.error('❌ Errore nella generazione del report:', error.message);
  }
}

// Run the script
main();