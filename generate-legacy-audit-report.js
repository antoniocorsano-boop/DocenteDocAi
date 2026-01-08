const fs = require('fs');
const path = require('path');

/**
 * Script per generare un report Markdown dall'audit dei componenti legacy.
 * Legge legacy-audit.json dalla root del progetto e genera un report filtrato.
 */

// Lista dei base components M3 da escludere dal filtro
const M3_BASE_COMPONENTS = [
  'M3SurfaceCard',
  'M3HeroCard',
  'M3SuggestionCard',
  'M3SuggestionItem',
  'M3ActivityItem',
  'M3EmptyStateCard',
  'M3ExpressiveCard'
];

/**
 * Legge il file JSON legacy-audit.json dalla root del progetto
 */
function readAuditData() {
  const auditFilePath = path.join(__dirname, 'legacy-audit.json');
  try {
    const data = fs.readFileSync(auditFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Errore nella lettura del file ${auditFilePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Filtra i componenti che NON usano i nuovi base components M3
 */
function filterLegacyComponents(components) {
  return components.filter(component => {
    return !M3_BASE_COMPONENTS.includes(component.baseComponent);
  });
}

/**
 * Ordina i componenti per numero di issues decrescente
 */
function sortByIssuesDescending(components) {
  return components.sort((a, b) => b.issues.length - a.issues.length);
}

/**
 * Determina se un componente ha priorità alta
 */
function isHighPriority(component) {
  return component.issues.length > 2 || !component.scrollable;
}

/**
 * Genera il contenuto Markdown del report
 */
function generateMarkdownReport(components) {
  let markdown = '# Report Audit Componenti Legacy\n\n';
  markdown += `**Data Generazione:** ${new Date().toLocaleDateString('it-IT')}\n\n`;
  markdown += `**Totale Componenti Filtrati:** ${components.length}\n\n`;

  if (components.length === 0) {
    markdown += 'Nessun componente legacy trovato che richieda attenzione.\n';
    return markdown;
  }

  markdown += '## Componenti da Migrare\n\n';
  markdown += '| Nome Componente | File | Base Component Attuale | Issues | Scrollable | Priorità |\n';
  markdown += '|-----------------|------|-------------------------|--------|------------|----------|\n';

  components.forEach(component => {
    const priority = isHighPriority(component) ? '**ALTA**' : 'Normale';
    const scrollable = component.scrollable ? 'Sì' : 'No';
    const issuesList = component.issues.map(issue => `- ${issue}`).join('<br>');
    const fileName = path.basename(component.file);

    markdown += `| ${component.name} | ${fileName} | ${component.baseComponent} | ${issuesList} | ${scrollable} | ${priority} |\n`;
  });

  markdown += '\n## Note\n\n';
  markdown += '- **Priorità Alta:** Componenti con più di 2 issues o che non supportano scrolling\n';
  markdown += '- Tutti i componenti elencati non utilizzano ancora i base components M3\n';
  markdown += '- Ordinamento: per numero di issues decrescente\n';

  return markdown;
}

/**
 * Crea la cartella audit se non esiste e salva il report
 */
function saveReport(markdown) {
  const auditDir = path.join(__dirname, 'audit');
  const reportPath = path.join(auditDir, 'legacy-audit.md');

  // Crea la cartella audit se non esiste
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  // Salva il file Markdown
  fs.writeFileSync(reportPath, markdown, 'utf8');
  console.log(`Audit Markdown generato: audit/legacy-audit.md`);
}

/**
 * Funzione principale
 */
function main() {
  // 1. Leggi i dati dal JSON
  const auditData = readAuditData();

  // 2. Filtra i componenti legacy
  const legacyComponents = filterLegacyComponents(auditData);

  // 3. Ordina per numero di issues decrescente
  const sortedComponents = sortByIssuesDescending(legacyComponents);

  // 4. Genera il report Markdown
  const markdown = generateMarkdownReport(sortedComponents);

  // 5. Salva il report
  saveReport(markdown);
}

// Esegui lo script
main();