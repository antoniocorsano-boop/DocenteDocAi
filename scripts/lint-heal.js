#!/usr/bin/env node

/**
 * Lint Auto-Healing Script
 * 
 * Automatically fixes safe lint violations and reports on critical ones
 * Usage: node scripts/lint-heal.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🔍 DocenteDoc AI - Lint Auto-Healing Script\n');

try {
  // Step 1: Run ESLint with JSON output
  console.log('📊 Generating lint report...');
  const reportJson = execSync(
    'npx eslint . --ext .js,.jsx,.ts,.tsx --format=json',
    { encoding: 'utf8', stdio: 'pipe' }
  ).toString();
  
  const report = JSON.parse(reportJson);
  
  // Step 2: Categorize violations
  const violations = {
    errors: [],
    warnings: [],
    fixable: []
  };
  
  report.forEach(file => {
    file.messages.forEach(msg => {
      if (msg.severity === 2) {
        violations.errors.push({ file: file.filePath, ...msg });
        if (msg.fix) violations.fixable.push({ file: file.filePath, ...msg });
      } else if (msg.severity === 1) {
        violations.warnings.push({ file: file.filePath, ...msg });
      }
    });
  });
  
  // Step 3: Auto-fix violations
  if (violations.fixable.length > 0) {
    console.log(`\n✨ Auto-fixing ${violations.fixable.length} fixable issues...\n`);
    execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --fix', { stdio: 'inherit' });
  }
  
  // Step 4: Re-check after fixes
  console.log('\n🔄 Re-checking after fixes...');
  const reportAfterFix = JSON.parse(
    execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --format=json', { 
      encoding: 'utf8', 
      stdio: 'pipe' 
    }).toString()
  );
  
  const errorsAfter = reportAfterFix.reduce((count, file) => 
    count + file.messages.filter(m => m.severity === 2).length, 0
  );
  
  const warningsAfter = reportAfterFix.reduce((count, file) => 
    count + file.messages.filter(m => m.severity === 1).length, 0
  );
  
  // Step 5: Summary Report
  console.log('\n' + '='.repeat(60));
  console.log('📋 LINT HEAL SUMMARY');
  console.log('='.repeat(60) + '\n');
  
  console.log(`✅ Auto-fixed violations: ${violations.fixable.length}`);
  console.log(`❌ Remaining errors: ${errorsAfter}`);
  console.log(`⚠️ Warnings (non-blocking): ${warningsAfter}`);
  
  if (violations.errors.length > violations.fixable.length) {
    const criticalErrors = violations.errors.filter(
      e => !violations.fixable.some(f => f.file === e.file && f.line === e.line)
    );
    
    console.log('\n🔴 CRITICAL ISSUES (Manual Fix Required):\n');
    criticalErrors.slice(0, 10).forEach(error => {
      console.log(`  📄 ${error.file}:${error.line}`);
      console.log(`     Rule: ${error.ruleId}`);
      console.log(`     Message: ${error.message}\n`);
    });
    
    if (criticalErrors.length > 10) {
      console.log(`  ... and ${criticalErrors.length - 10} more critical issues\n`);
    }
  }
  
  console.log('='.repeat(60));
  console.log('✨ Lint healing complete! Run `npm run lint` to verify.\n');
  
  process.exit(errorsAfter > 0 ? 1 : 0);
  
} catch (error) {
  if (error.status === 1) {
    // ESLint found violations - continue with reporting
    console.log('⚠️ Lint violations detected during analysis\n');
  } else {
    console.error('❌ Error running lint heal:', error.message);
    process.exit(1);
  }
}
