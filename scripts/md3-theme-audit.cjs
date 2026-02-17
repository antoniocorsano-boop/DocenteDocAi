#!/usr/bin/env node
/**
 * MD3 THEME AUDIT SCRIPT
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Purpose: Detect ALL hardcoded theme/color/token values violating MD3 governance
 * Phase: 7 (CI/CD GATE)
 * Enforcement: BLOCKING (exit 1 on violations)
 * 
 * VIOLATIONS DETECTED:
 * 1. Hardcoded color values (#hex, rgb, rgba, hsl)
 * 2. Hardcoded spacing values (px, rem, em, %)
 * 3. Hardcoded typography values (font-size, font-weight, line-height)
 * 4. Non-MD3 CSS variables (--custom-* instead of --md-sys-*)
 * 5. Inline styles with hardcoded values
 * 6. Tailwind/utility classes (deprecated)
 * 
 * EXIT CODES:
 * 0 = Clean (no violations)
 * 1 = Violations detected (blocks commit/build)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const fs = require('fs');
const path = require('path');
const { classifyViolation, generateStats } = require('./md3-legacy-checker.cjs');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VIOLATION PATTERNS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const VIOLATIONS = {
  // Hardcoded hex colors (#fff, #000000, etc.)
  hardcodedHexColor: /#[0-9a-f]{3,6}\b/gi,
  
  // Hardcoded rgb/rgba colors
  hardcodedRgbColor: /rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+/gi,
  
  // Hardcoded hsl/hsla colors
  hardcodedHslColor: /hsla?\s*\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%/gi,
  
  // Hardcoded spacing (padding, margin, gap with px/rem/em/%)
  hardcodedSpacing: /(?:padding|margin|gap|top|left|right|bottom|width|height|min-width|max-width|min-height|max-height)\s*:\s*\d+(?:px|rem|em|%)/gi,
  
  // Hardcoded typography (font-size, font-weight, line-height)
  hardcodedTypography: /(?:font-size|font-weight|line-height|letter-spacing)\s*:\s*(?:\d+(?:px|rem|em)|[1-9]\d{2,})/gi,
  
  // Non-MD3 CSS variables (--custom-*, --legacy-*, etc.)
  nonMD3Var: /var\(--(?!md-sys-|md-ref-|md-source-)[a-zA-Z0-9-]+\)/gi,
  
  // Inline style objects with hardcoded values
  inlineStyleHardcoded: /style\s*=\s*\{\{[^}]*(?:color|backgroundColor|padding|margin|fontSize|width|height)\s*:\s*['"]?(?:#[0-9a-f]{3,6}|\d+(?:px|rem|em|%))/gi,
  
  // Tailwind/utility classes (deprecated in MD3)
  tailwindClasses: /className\s*=\s*['"][^'"]*\b(?:w-|h-|p-|m-|gap-|text-|bg-|border-|rounded-|shadow-|font-|leading-|tracking-)\w+/gi,
  
  // Hardcoded border-radius
  hardcodedBorderRadius: /border-radius\s*:\s*\d+(?:px|rem|em|%)/gi,
  
  // Hardcoded box-shadow
  hardcodedBoxShadow: /box-shadow\s*:\s*[^;]*\d+px/gi,
};

// Files to skip (legacy, backup, generated)
const SKIP_PATTERNS = [
  /node_modules/,
  /\.venv/,
  /archive/,
  /dist/,
  /build/,
  /\.test\./,
  /\.spec\./,
  /__tests__/,
  /storybook-static/,
  /playwright-report/,
  /test-results/,
  /coverage/,
  /\.husky/,
  /scripts\/md3-.*-audit\.cjs/, // Skip audit scripts
];

// Allowed exceptions (token definition files)
const ALLOWED_FILES = [
  'src/theme.css',           // MD3 token definitions
  'src/global-styles.css',   // Global theme setup
  'index.css',               // Root CSS
];

// Legacy files documented for remediation (warnings only)
const LEGACY_FILES = [
  // Add files from migration plan here
  // These will generate warnings but not block CI/CD
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILE SCANNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function findFiles(dir, extensions = ['.tsx', '.ts', '.css', '.jsx', '.js']) {
  let results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // Skip excluded patterns
    if (SKIP_PATTERNS.some(pattern => pattern.test(filePath))) {
      continue;
    }

    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath, extensions));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  }

  return results;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUDIT ENGINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function auditFile(filePath) {
  const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const violations = [];

  // Check each violation pattern
  for (const [violationType, pattern] of Object.entries(VIOLATIONS)) {
    let match;
    const globalPattern = new RegExp(pattern.source, pattern.flags);
    
    while ((match = globalPattern.exec(content)) !== null) {
      const matchText = match[0];
      const matchIndex = match.index;
      
      // Find line number
      let lineNumber = 1;
      let charCount = 0;
      for (let i = 0; i < lines.length; i++) {
        charCount += lines[i].length + 1; // +1 for newline
        if (charCount > matchIndex) {
          lineNumber = i + 1;
          break;
        }
      }

      const violation = {
        file: relativePath,
        type: violationType,
        line: lineNumber,
        match: matchText,
        context: lines[lineNumber - 1]?.substring(0, 100),
      };

      violations.push(violation);
    }
  }

  return violations;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN AUDIT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎨 MD3 THEME AUDIT — PHASE 7 (CI/CD GATE)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const srcDir = path.join(process.cwd(), 'src');
  const files = findFiles(srcDir);

  console.log(`📁 Scanning ${files.length} files...\n`);

  const allViolations = [];

  for (const file of files) {
    const violations = auditFile(file);
    allViolations.push(...violations);
  }

  // Classify violations using legacy checker
  const stats = generateStats(allViolations);

  const blockingViolations = allViolations.filter(v => classifyViolation(v.file, v).blocking);
  const warningViolations = allViolations.filter(v => {
    const c = classifyViolation(v.file, v);
    return c.type === 'legacy-warning';
  });
  const exemptViolations = allViolations.filter(v => {
    const c = classifyViolation(v.file, v);
    return c.type === 'exempt';
  });

  // Generate JSON report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: files.length,
      totalViolations: allViolations.length,
      blockingViolations: stats.blocking,
      warnings: stats.warnings,
      exempt: stats.exempt,
    },
    blocking: blockingViolations.map(v => ({
      ...v,
      classification: classifyViolation(v.file, v),
    })),
    warnings: warningViolations.map(v => ({
      ...v,
      classification: classifyViolation(v.file, v),
    })),
    exempt: exemptViolations.map(v => ({
      ...v,
      classification: classifyViolation(v.file, v),
    })),
  };

  const reportPath = path.join(process.cwd(), 'audit', 'theme-violations.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Console output
  if (stats.blocking > 0) {
    console.log(`❌ BLOCKING VIOLATIONS: ${stats.blocking}\n`);
    
    blockingViolations.slice(0, 50).forEach(v => {
      console.log(`🔴 ${v.file}:${v.line}`);
      console.log(`   Type: ${v.type}`);
      console.log(`   Match: ${v.match}`);
      console.log(`   Context: ${v.context}\n`);
    });
  }

  if (stats.warnings > 0) {
    console.log(`⚠️  LEGACY WARNINGS: ${stats.warnings}\n`);
    
    warningViolations.slice(0, 20).forEach(v => {
      const classification = classifyViolation(v.file, v);
      console.log(`🟡 ${v.file}:${v.line} (${classification.message})`);
    });
    console.log('');
  }

  if (stats.exempt > 0) {
    console.log(`ℹ️  EXEMPT FILES: ${stats.exempt} violations (allowed)\n`);
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 AUDIT SUMMARY`);
  console.log(`   Files scanned: ${files.length}`);
  console.log(`   Blocking violations: ${stats.blocking}`);
  console.log(`   Legacy warnings: ${stats.warnings}`);
  console.log(`   Exempt: ${stats.exempt}`);
  console.log(`   Report: ${reportPath}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (stats.blocking > 0) {
    console.log('🚫 AUDIT FAILED — CI/CD BLOCKED');
    console.log('📋 Fix violations or document as legacy in md3-legacy-registry.json\n');
    process.exit(1);
  }

  console.log('✅ AUDIT PASSED — No blocking violations\n');
  process.exit(0);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXECUTE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if (require.main === module) {
  main();
}

module.exports = { auditFile, findFiles };
