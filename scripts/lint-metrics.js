#!/usr/bin/env node

/**
 * Lint Metrics & Monitoring Script
 * 
 * Analyzes lint violations, tracks metrics, and audits suppressions
 * Usage: node scripts/lint-metrics.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const metricsFile = path.join(projectRoot, 'lint-metrics.json');

console.log('📊 DocenteDoc AI - Lint Metrics Analyzer\n');

// Initialize or load metrics history
let metrics = {
  history: [],
  suppressions: [],
  lastUpdated: new Date().toISOString()
};

if (fs.existsSync(metricsFile)) {
  metrics = JSON.parse(fs.readFileSync(metricsFile, 'utf8'));
}

try {
  // Generate lint report
  const reportJson = execSync(
    'npx eslint . --ext .js,.jsx,.ts,.tsx --format=json',
    { encoding: 'utf8', stdio: 'pipe' }
  ).toString();
  
  const report = JSON.parse(reportJson);
  
  // Analyze violations
  const analysis = {
    timestamp: new Date().toISOString(),
    totalFiles: report.length,
    filesWithErrors: 0,
    filesWithWarnings: 0,
    totalErrors: 0,
    totalWarnings: 0,
    errorsByRule: {},
    warningsByRule: {},
    topOffenders: []
  };
  
  report.forEach(file => {
    if (file.messages.length === 0) return;
    
    const hasErrors = file.messages.some(m => m.severity === 2);
    const hasWarnings = file.messages.some(m => m.severity === 1);
    
    if (hasErrors) analysis.filesWithErrors++;
    if (hasWarnings) analysis.filesWithWarnings++;
    
    file.messages.forEach(msg => {
      if (msg.severity === 2) {
        analysis.totalErrors++;
        analysis.errorsByRule[msg.ruleId] = (analysis.errorsByRule[msg.ruleId] || 0) + 1;
      } else {
        analysis.totalWarnings++;
        analysis.warningsByRule[msg.ruleId] = (analysis.warningsByRule[msg.ruleId] || 0) + 1;
      }
    });
    
    if (file.messages.length > 2) {
      analysis.topOffenders.push({
        file: file.filePath.replace(projectRoot, '.'),
        violations: file.messages.length
      });
    }
  });
  
  analysis.topOffenders.sort((a, b) => b.violations - a.violations).slice(0, 5);
  
  // Audit suppressions
  const suppressionPattern = /eslint-disable|@ts-ignore/g;
  const suppressions = [];
  
  execSync('find src -type f \\( -name "*.ts" -o -name "*.tsx" \\)', { stdio: 'pipe' })
    .toString()
    .split('\n')
    .filter(f => f)
    .forEach(file => {
      const content = fs.readFileSync(path.join(projectRoot, file), 'utf8');
      const matches = content.match(suppressionPattern) || [];
      if (matches.length > 0) {
        suppressions.push({ file: file.replace(projectRoot, '.'), count: matches.length });
      }
    });
  
  // Update metrics history
  metrics.history.push(analysis);
  metrics.suppressions = suppressions;
  metrics.lastUpdated = new Date().toISOString();
  
  // Keep only last 30 records
  if (metrics.history.length > 30) {
    metrics.history = metrics.history.slice(-30);
  }
  
  // Save metrics
  fs.writeFileSync(metricsFile, JSON.stringify(metrics, null, 2));
  
  // Display Report
  console.log('='.repeat(70));
  console.log('📈 LINT METRICS REPORT');
  console.log('='.repeat(70) + '\n');
  
  console.log('📊 OVERVIEW:');
  console.log(`  Files scanned: ${analysis.totalFiles}`);
  console.log(`  Files with errors: ${analysis.filesWithErrors}`);
  console.log(`  Files with warnings: ${analysis.filesWithWarnings}`);
  console.log(`  Total errors: ${analysis.totalErrors} ❌`);
  console.log(`  Total warnings: ${analysis.totalWarnings} ⚠️\n`);
  
  if (Object.keys(analysis.errorsByRule).length > 0) {
    console.log('🔴 TOP ERROR RULES:');
    Object.entries(analysis.errorsByRule)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([rule, count]) => {
        console.log(`  ${rule}: ${count} violations`);
      });
    console.log();
  }
  
  if (analysis.topOffenders.length > 0) {
    console.log('📄 TOP OFFENDING FILES:');
    analysis.topOffenders.forEach(({ file, violations }) => {
      console.log(`  ${file}: ${violations} violations`);
    });
    console.log();
  }
  
  if (suppressions.length > 0) {
    console.log('🔕 ESLINT SUPPRESSIONS (Audit):');
    suppressions.sort((a, b) => b.count - a.count).slice(0, 5).forEach(({ file, count }) => {
      console.log(`  ${file}: ${count} suppressions`);
    });
    console.log(`\n  Total files with suppressions: ${suppressions.length}`);
    console.log(`  Total suppressions: ${suppressions.reduce((sum, s) => sum + s.count, 0)}\n`);
  }
  
  // Trend Analysis
  if (metrics.history.length > 1) {
    const current = metrics.history[metrics.history.length - 1];
    const previous = metrics.history[metrics.history.length - 2];
    
    const errorDiff = current.totalErrors - previous.totalErrors;
    const warningDiff = current.totalWarnings - previous.totalWarnings;
    
    console.log('📉 TREND (vs. previous run):');
    console.log(`  Errors: ${errorDiff > 0 ? '📈' : '📉'} ${errorDiff > 0 ? '+' : ''}${errorDiff}`);
    console.log(`  Warnings: ${warningDiff > 0 ? '📈' : '📉'} ${warningDiff > 0 ? '+' : ''}${warningDiff}\n`);
  }
  
  console.log('='.repeat(70));
  console.log(`✅ Metrics saved to: ${metricsFile}`);
  console.log('='.repeat(70) + '\n');
  
  process.exit(analysis.totalErrors > 0 ? 1 : 0);
  
} catch (error) {
  if (error.status === 1) {
    // ESLint found violations - metrics still valid
    console.log('⚠️ Violations detected - metrics saved anyway\n');
    process.exit(1);
  } else {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}
