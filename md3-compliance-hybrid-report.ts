import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

// --- Helper Functions ---

function scanFileForViolations(filePath: string) {
  const violations: { file: string; line: number; type: string }[] = [];
  const content = readFileSync(filePath, 'utf-8');

  // Skip legacy-marked files
  if (content.includes('// LEGACY - MD3 Non-compliant')) return [];

  const lines = content.split('\n');
  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (line.includes('.style.') && (line.includes('=') || line.includes('setProperty'))) {
      violations.push({ file: filePath, line: lineNumber, type: 'runtime-mutation' });
    }

    if (line.includes('var(--md-sys-') && !line.includes('useTheme')) {
      violations.push({ file: filePath, line: lineNumber, type: 'css-variable' });
    }

    if (line.includes('className=') && !filePath.includes('stories') && !filePath.includes('test')) {
      violations.push({ file: filePath, line: lineNumber, type: 'className' });
    }

    if (line.match(/['"`]\d+(px|rem|em)['"`]/) || line.match(/['"`]#[0-9a-fA-F]{3,6}['"`]/)) {
      violations.push({ file: filePath, line: lineNumber, type: 'hardcoded-value' });
    }
  });

  return violations;
}

function scanDirectory(dirPath: string) {
  const violations: { file: string; line: number; type: string }[] = [];

  function scanDir(currentPath: string) {
    const items = readdirSync(currentPath);

    for (const item of items) {
      const fullPath = join(currentPath, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && !['node_modules', 'dist', '__tests__'].includes(item)) {
        scanDir(fullPath);
      } else if (stat.isFile() && extname(item) === '.tsx') {
        violations.push(...scanFileForViolations(fullPath));
      }
    }
  }

  scanDir(dirPath);
  return violations;
}

// --- Main Processing ---

const allViolations = scanDirectory('src');

// Group by component
const grouped: Record<string, any[]> = {};
allViolations.forEach(v => {
  const component = v.file.split('/').pop()?.replace('.tsx', '') || v.file;
  if (!grouped[component]) grouped[component] = [];
  grouped[component].push(v);
});

// Generate Markdown report
let mdReport = `# MD3 Full Compliance Report\n\n`;
mdReport += `Generated: ${new Date().toISOString()}\n\n`;
mdReport += `| Component | Total Violations | Runtime | CSS Var | className | Hardcoded | MD3 Score | Status |\n`;
mdReport += `|-----------|----------------|--------|--------|-----------|-----------|-----------|--------|\n`;

let totalComponents = 0;
let fullyCompliant = 0;
let hybridComponents = 0;

for (const [component, violations] of Object.entries(grouped)) {
  totalComponents += 1;

  const typesCount = violations.reduce(
    (acc, v) => {
      acc[v.type] = (acc[v.type] || 0) + 1;
      return acc;
    },
    { 'runtime-mutation': 0, 'css-variable': 0, 'className': 0, 'hardcoded-value': 0 }
  );

  const total = violations.length;
  let score = Math.max(0, 100 - total * 10); // 10 pt deduction per violation
  let status = '';

  if (score === 100) {
    status = '✅ Fully MD3';
    fullyCompliant += 1;
  } else if (score >= 60) {
    status = '⚠️ Hybrid';
    hybridComponents += 1;
  } else {
    status = '❌ Non-governed';
  }

  mdReport += `| ${component} | ${total} | ${typesCount['runtime-mutation']} | ${typesCount['css-variable']} | ${typesCount['className']} | ${typesCount['hardcoded-value']} | ${score}% | ${status} |\n`;
}

// Global Summary
mdReport += `\n## Summary\n`;
mdReport += `- Total components scanned: ${totalComponents}\n`;
mdReport += `- Fully MD3-compliant: ${fullyCompliant} (${((fullyCompliant / totalComponents) * 100).toFixed(1)}%)\n`;
mdReport += `- Hybrid components: ${hybridComponents} (${((hybridComponents / totalComponents) * 100).toFixed(1)}%)\n`;
mdReport += `- Non-governed components: ${totalComponents - fullyCompliant - hybridComponents} (${(((totalComponents - fullyCompliant - hybridComponents) / totalComponents) * 100).toFixed(1)}%)\n`;

writeFileSync('MD3_FullCompliance_Report.md', mdReport, 'utf-8');
console.log('✅ MD3_FullCompliance_Report.md generated successfully!');
