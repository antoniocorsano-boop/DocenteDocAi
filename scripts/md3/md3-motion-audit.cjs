#!/usr/bin/env node
/**
 * MD3 MOTION GOVERNANCE AUDIT SCRIPT
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Purpose: Detect ALL hardcoded motion/animation values violating MD3 governance
 * Phase: 5 (MOTION & DURATION)
 * Enforcement: BLOCKING (exit 1 on violations)
 * 
 * VIOLATIONS DETECTED:
 * 1. Hardcoded duration values (ms, s)
 * 2. Hardcoded easing (ease, linear, cubic-bezier)
 * 3. transition: all (non-performant)
 * 4. animation-duration with numeric values
 * 5. Non-MD3 motion variable usage
 * 6. Delay values (animation-delay, transition-delay)
 * 
 * EXIT CODES:
 * 0 = Clean (no violations)
 * 1 = Violations detected (blocks commit)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const fs = require('fs');
const path = require('path');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VIOLATION PATTERNS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const VIOLATIONS = {
  // Numeric duration values (100ms, 0.3s, etc.)
  hardcodedDuration: /(?:transition|animation)(?:-duration)?[:\s]+[^;]*?(\d+(?:\.\d+)?(?:ms|s))/gi,
  
  // Hardcoded easing functions
  hardcodedEasing: /(?:transition|animation)(?:-timing-function)?[:\s]+[^;]*?(ease(?:-in-out|-in|-out)?|linear|cubic-bezier\([^)]+\))/gi,
  
  // Forbidden "transition: all"
  transitionAll: /transition\s*:\s*all\b/gi,
  
  // Inline style temporal values (style={{transition: "200ms"}})
  inlineStyleTemporal: /style\s*=\s*\{\{[^}]*(?:transition|animation)[^}]*?(\d+(?:ms|s))[^}]*\}\}/gi,
  
  // Non-MD3 motion variables (--motion-* instead of --md-sys-motion-*)
  nonMD3MotionVar: /var\(--motion-(?!easing-standard|easing-decelerate|easing-accelerate|easing-emphasized|easing-expressive|duration-short\d|duration-medium\d|duration-long\d)[a-zA-Z0-9-]+\)/gi,
  
  // delay values (animation-delay, transition-delay)
  hardcodedDelay: /(?:animation|transition)-delay\s*:\s*(\d+(?:ms|s))/gi,
  
  // JS/TS style objects with numeric duration
  jsStyleDuration: /(?:transition|animation)Duration\s*:\s*['"]\d+(?:ms|s)['"]/gi,
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
  /scripts\/md3-.*-audit\.cjs/, // Skip audit scripts themselves
];

// Allowed exceptions (token definitions in theme.css)
const ALLOWED_FILES = [
  'src/theme.css', // Token definition file
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
// VIOLATION SCANNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Skip allowed files (token definitions)
  if (ALLOWED_FILES.some(allowed => relativePath.includes(allowed))) {
    // But still check for violations outside token definition blocks
    const tokenBlockRegex = /--md-sys-motion-[\s\S]*?;/g;
    const contentWithoutTokens = content.replace(tokenBlockRegex, '');
    return scanContent(contentWithoutTokens, relativePath);
  }
  
  return scanContent(content, relativePath);
}

function scanContent(content, relativePath) {
  const violations = [];
  const lines = content.split('\n');

  for (const [violationType, pattern] of Object.entries(VIOLATIONS)) {
    let match;
    const globalPattern = new RegExp(pattern.source, pattern.flags);
    
    while ((match = globalPattern.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length;
      const lineContent = lines[lineNumber - 1]?.trim() || '';
      
      violations.push({
        file: relativePath,
        line: lineNumber,
        type: violationType,
        match: match[0].substring(0, 100), // Truncate long matches
        context: lineContent.substring(0, 150),
      });
    }
  }

  return violations;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUDIT EXECUTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function runAudit() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  MD3 MOTION GOVERNANCE AUDIT — PHASE 5');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const srcDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    console.error('❌ ERROR: src/ directory not found');
    process.exit(1);
  }

  const files = findFiles(srcDir);
  console.log(`📂 Scanning ${files.length} files...\n`);

  const allViolations = [];
  for (const file of files) {
    const fileViolations = scanFile(file);
    allViolations.push(...fileViolations);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // REPORT GENERATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (allViolations.length === 0) {
    console.log('✅ CLEAN — No motion governance violations detected\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  }

  console.log(`❌ VIOLATIONS DETECTED: ${allViolations.length}\n`);

  // Group by file
  const violationsByFile = {};
  for (const v of allViolations) {
    if (!violationsByFile[v.file]) {
      violationsByFile[v.file] = [];
    }
    violationsByFile[v.file].push(v);
  }

  // Sort by file (most violations first)
  const sortedFiles = Object.entries(violationsByFile)
    .sort(([, a], [, b]) => b.length - a.length);

  // Print top 20 violators
  console.log('📊 TOP VIOLATORS:\n');
  sortedFiles.slice(0, 20).forEach(([file, violations]) => {
    console.log(`  ${violations.length.toString().padStart(3)} violations → ${file}`);
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  DETAILED VIOLATIONS (First 50)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  allViolations.slice(0, 50).forEach((v, idx) => {
    console.log(`${(idx + 1).toString().padStart(3)}. [${v.type}]`);
    console.log(`     File: ${v.file}:${v.line}`);
    console.log(`     Code: ${v.context}`);
    console.log('');
  });

  // Breakdown by violation type
  const typeBreakdown = {};
  for (const v of allViolations) {
    typeBreakdown[v.type] = (typeBreakdown[v.type] || 0) + 1;
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  VIOLATION TYPE BREAKDOWN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  for (const [type, count] of Object.entries(typeBreakdown).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type.padEnd(25)} → ${count} violations`);
  }
  // Generate JSON report
  const reportPath = path.join(process.cwd(), 'audit', 'motion-violations.json');
  const reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const report = {
    timestamp: new Date().toISOString(),
    totalViolations: allViolations.length,
    totalFiles: Object.keys(violationsByFile).length,
    scannedFiles: files.length,
    typeBreakdown,
    topViolators: sortedFiles.slice(0, 20).map(([file, violations]) => ({
      file,
      count: violations.length,
    })),
    violations: allViolations,
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed JSON report saved: ${reportPath}\n`);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  REMEDIATION GUIDE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('  Replace hardcoded values with MD3 motion tokens:');
  console.log('');
  console.log('  ❌ transition: all 200ms ease-in-out');
  console.log('  ✅ transition: transform var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)');
  console.log('');
  console.log('  ❌ animation-duration: 300ms');
  console.log('  ✅ animation-duration: var(--md-sys-motion-duration-long)');
  console.log('');
  console.log('  See docs/MD3_MOTION_GOVERNANCE.md for complete guide.');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(1); // Exit with error to block commit
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXECUTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

runAudit();
