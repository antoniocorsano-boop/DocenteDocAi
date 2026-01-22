#!/usr/bin/env node

/**
 * MD3 Compliance Report Generator
 * Generates comprehensive MD3 pervasiveness report with component-by-component scores
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Violation {
  file: string;
  line: number;
  type: 'className' | 'hardcoded-color' | 'hardcoded-spacing' | 'tailwind-class' | 'missing-useTheme' | 'runtime-mutation' | 'css-variable';
  description: string;
  suggestion: string;
}

interface ComponentScore {
  name: string;
  file: string;
  violations: Violation[];
  score: number;
  status: 'compliant' | 'partial' | 'non-compliant';
  totalViolations: number;
  criticalViolations: number;
}

function scanFileForViolations(filePath: string): Violation[] {
  const violations: Violation[] = [];
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Check for missing useTheme
  const hasUseTheme = content.includes('useTheme');
  if (!hasUseTheme && content.includes('export') && content.includes('function') || content.includes('const') && content.includes('=') && content.includes('(')) {
    violations.push({
      file: filePath,
      line: 1,
      type: 'missing-useTheme',
      description: 'Component does not use useTheme hook',
      suggestion: 'Import and use useTheme hook for MD3 tokens'
    });
  }

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Check for className usage
    if (line.includes('className=')) {
      violations.push({
        file: filePath,
        line: lineNumber,
        type: 'className',
        description: 'Uses className attribute',
        suggestion: 'Replace with inline style using MD3 tokens'
      });
    }

    // Check for Tailwind classes
    const tailwindClasses = ['flex', 'grid', 'block', 'inline', 'hidden', 'p-', 'm-', 'w-', 'h-', 'bg-', 'text-', 'border-', 'rounded-', 'shadow-'];
    if (tailwindClasses.some(cls => line.includes(cls) && line.includes('className'))) {
      violations.push({
        file: filePath,
        line: lineNumber,
        type: 'tailwind-class',
        description: 'Uses Tailwind utility classes',
        suggestion: 'Replace with inline style using MD3 tokens'
      });
    }

    // Check for hardcoded spacing
    if (/\d+(px|rem|em|vh|vw|%)[^a-zA-Z]/.test(line) && !line.includes('var(--md-sys-')) {
      violations.push({
        file: filePath,
        line: lineNumber,
        type: 'hardcoded-spacing',
        description: 'Uses hardcoded spacing units',
        suggestion: 'Use var(--md-sys-spacing-*) tokens'
      });
    }

    // Check for CSS variables (should use token destructuring instead)
    if (line.includes('var(--md-sys-') && !line.includes('useTheme')) {
      violations.push({
        file: filePath,
        line: lineNumber,
        type: 'css-variable',
        description: 'Uses raw CSS variables instead of token destructuring',
        suggestion: 'Use useTheme hook and token destructuring'
      });
    }

    // Check for runtime style mutations
    if (line.includes('.style.') && (line.includes('=') || line.includes('setProperty'))) {
      violations.push({
        file: filePath,
        line: lineNumber,
        type: 'runtime-mutation',
        description: 'Uses runtime DOM style mutations',
        suggestion: 'Use declarative state management with useState'
      });
    }
  });

  return violations;
}

function scanDirectory(dirPath: string): Violation[] {
  const violations: Violation[] = [];

  function scanDir(currentPath: string) {
    const items = readdirSync(currentPath);

    for (const item of items) {
      const fullPath = join(currentPath, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist' && item !== '__tests__') {
        scanDir(fullPath);
      } else if (stat.isFile() && extname(item) === '.tsx') {
        violations.push(...scanFileForViolations(fullPath));
      }
    }
  }

  scanDir(dirPath);
  return violations;
}

function calculateComponentScore(violations: Violation[], componentName: string): ComponentScore {
  const componentViolations = violations.filter(v => v.file.includes(componentName));

  const criticalViolations = componentViolations.filter(v =>
    v.type === 'runtime-mutation' || v.type === 'css-variable' || v.type === 'missing-useTheme'
  ).length;

  const totalViolations = componentViolations.length;

  let score = 100;
  score -= totalViolations * 5; // -5 points per violation
  score -= criticalViolations * 10; // -10 points for critical violations
  score = Math.max(0, Math.min(100, score));

  let status: 'compliant' | 'partial' | 'non-compliant';
  if (score >= 90) status = 'compliant';
  else if (score >= 70) status = 'partial';
  else status = 'non-compliant';

  return {
    name: componentName,
    file: componentViolations[0]?.file || '',
    violations: componentViolations,
    score,
    status,
    totalViolations,
    criticalViolations
  };
}

function generateReport() {
  const srcPath = join(__dirname, 'src');
  const violations = scanDirectory(srcPath);

  // Group violations by component
  const componentFiles = [...new Set(violations.map(v => basename(v.file, '.tsx')))];

  const componentScores: ComponentScore[] = componentFiles.map(componentName =>
    calculateComponentScore(violations, componentName)
  );

  // Sort by score (worst first)
  componentScores.sort((a, b) => a.score - b.score);

  // Calculate overall statistics
  const totalComponents = componentScores.length;
  const compliantComponents = componentScores.filter(c => c.status === 'compliant').length;
  const partialComponents = componentScores.filter(c => c.status === 'partial').length;
  const nonCompliantComponents = componentScores.filter(c => c.status === 'non-compliant').length;

  const overallScore = componentScores.reduce((sum, c) => sum + c.score, 0) / totalComponents;
  const totalViolations = violations.length;

  // Generate report
  const report = `# MD3 Compliance Report - ${new Date().toISOString().split('T')[0]}

## Executive Summary

**Overall MD3 Compliance Score: ${overallScore.toFixed(1)}%**

- **Total Components Analyzed:** ${totalComponents}
- **Fully Compliant:** ${compliantComponents} (${((compliantComponents/totalComponents)*100).toFixed(1)}%)
- **Partially Compliant:** ${partialComponents} (${((partialComponents/totalComponents)*100).toFixed(1)}%)
- **Non-Compliant:** ${nonCompliantComponents} (${((nonCompliantComponents/totalComponents)*100).toFixed(1)}%)
- **Total Violations:** ${totalViolations}

## Compliance Status Distribution

${'█'.repeat(Math.round(overallScore/10))}${'░'.repeat(10 - Math.round(overallScore/10))} ${overallScore.toFixed(1)}%

## Component-by-Component Analysis

| Component | Score | Status | Violations | Critical |
|-----------|-------|--------|------------|----------|
${componentScores.map(c => `| ${c.name} | ${c.score.toFixed(1)}% | ${c.status} | ${c.totalViolations} | ${c.criticalViolations} |`).join('\n')}

## Top Violation Types

${Object.entries(
  violations.reduce((acc, v) => {
    acc[v.type] = (acc[v.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
).sort(([,a], [,b]) => b - a).map(([type, count]) => `- **${type}:** ${count} violations`).join('\n')}

## Critical Issues Requiring Immediate Attention

${violations.filter(v => v.type === 'runtime-mutation' || v.type === 'css-variable' || v.type === 'missing-useTheme')
  .slice(0, 10)
  .map(v => `- **${basename(v.file)}:${v.line}** - ${v.description}`)
  .join('\n')}

## Recommendations

1. **Priority 1 (Critical):** Fix all runtime mutations and CSS variable usage
2. **Priority 2 (High):** Implement useTheme hook in all components
3. **Priority 3 (Medium):** Replace className attributes with inline styles
4. **Priority 4 (Low):** Convert hardcoded spacing to token-based spacing

## MD3 Governance Status

${overallScore >= 95 ? '✅ **FULLY COMPLIANT** - All components use MD3 tokens exclusively' :
  overallScore >= 85 ? '⚠️ **MOSTLY COMPLIANT** - Minor violations remain, core architecture solid' :
  overallScore >= 70 ? '🔄 **PARTIALLY COMPLIANT** - Significant work needed on remaining components' :
  '❌ **NON-COMPLIANT** - Major architectural changes required'}

---
*Report generated by MD3 Compliance Scanner*
*Date: ${new Date().toISOString()}*
`;

  console.log(report);
}

// Run the report generation
generateReport();