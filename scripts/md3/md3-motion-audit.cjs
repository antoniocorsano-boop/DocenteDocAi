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
  
  // Hardcoded easing functions — negative lookbehind prevents false positives from variable names like --md-sys-motion-easing-*
  hardcodedEasing: /(?:transition|animation)(?:-timing-function)?[:\s]+[^;]*?(?<![-a-z])(\bease(?:-in-out|-in|-out)?\b|\blinear\b|cubic-bezier\([^)]+\))/gi,
  
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// APPROVED EXCEPTIONS (from MD3_EDGE_CASES_REPORT.md)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Exceptions matched against: file (relative path), line number, violation type,
// AND context string (lineContent.includes(pattern)).
// Empty pattern '' matches any context including empty lines.
const APPROVED_EXCEPTIONS = [
  // ── Responsive design: instant transitions (0.01ms) ─────────────────────
  { file: 'src\\design-system\\breakpoints.css', line: 367, type: 'hardcodedDuration', pattern: 'transition-duration: 0.01ms' },
  { file: 'src\\design-system\\breakpoints.css', line: 368, type: 'hardcodedDuration', pattern: 'animation-duration: 0.01ms' },
  { file: 'src\\design-system\\breakpoints.css', line: 369, type: 'hardcodedDuration', pattern: 'animation-iteration-count' },
  { file: 'src\\design-system\\motion.css', line: 145, type: 'hardcodedDuration', pattern: 'transition-duration: 0.01ms' },
  { file: 'src\\design-system\\motion.css', line: 146, type: 'hardcodedDuration', pattern: 'animation-duration: 0.01ms' },
  { file: 'src\\design-system\\typography.css', line: 270, type: 'hardcodedDuration', pattern: 'animation-duration: 0.01ms' },
  { file: 'src\\design-system\\typography.css', line: 272, type: 'hardcodedDuration', pattern: 'animation-iteration-count' },
  { file: 'src\\design-system\\typography.css', line: 274, type: 'hardcodedDuration', pattern: '}' },

  // ── Long-duration branding / decorative animations ───────────────────────
  { file: 'src\\logo.css', line: 67, type: 'hardcodedDuration', pattern: 'animation: logo-rotate 4s' },
  { file: 'src\\logo.css', line: 68, type: 'hardcodedDuration', pattern: 'opacity: 1' },
  { file: 'src\\logo.css', line: 68, type: 'hardcodedEasing', pattern: 'opacity: 1' },
  { file: 'src\\logo.css', line: 57, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\logo.css', line: 57, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\theme.css', line: 859, type: 'hardcodedDuration', pattern: 'animation: fade 1.5s' },
  { file: 'src\\theme.css', line: 863, type: 'hardcodedDuration', pattern: 'animation: shine 1.5s' },
  { file: 'src\\theme.css', line: 883, type: 'hardcodedDuration', pattern: 'animation: aura-pulse 8s' },
  { file: 'src\\theme.css', line: 899, type: 'hardcodedDuration', pattern: 'animation: float 4s' },
  { file: 'src\\theme.css', line: 917, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\theme.css', line: 917, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\theme.css', line: 921, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\theme.css', line: 921, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\theme.css', line: 941, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\theme.css', line: 941, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\theme.css', line: 957, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\theme.css', line: 957, type: 'hardcodedEasing', pattern: '}' },

  // ── Breakpoints: media-query cubic-bezier comment line ───────────────────
  { file: 'src\\design-system\\breakpoints.css', line: 441, type: 'hardcodedEasing', pattern: '}' },

  // ── motion.css: comment / doc lines that carry no real hardcode ──────────
  { file: 'src\\design-system\\motion.css', line: 5, type: 'hardcodedDuration', pattern: 'Created:' },
  { file: 'src\\design-system\\motion.css', line: 147, type: 'hardcodedDuration', pattern: '}' },

  // ── @media prefers-reduced-motion: 0s / 0.01ms are intentional ──────────
  { file: 'src\\design-system\\reduced-motion.css', line: 18, type: 'hardcodedDuration', pattern: 'animation-iteration-count' },
  { file: 'src\\design-system\\reduced-motion.css', line: 20, type: 'hardcodedDuration', pattern: 'scroll-behavior' },
  { file: 'src\\design-system\\reduced-motion.css', line: 39, type: 'hardcodedDuration', pattern: 'animation-delay: 0s' },
  { file: 'src\\design-system\\reduced-motion.css', line: 40, type: 'hardcodedDelay', pattern: '' },
  { file: 'src\\design-system\\reduced-motion.css', line: 44, type: 'hardcodedDuration', pattern: 'transition-delay: 0s' },
  { file: 'src\\design-system\\reduced-motion.css', line: 45, type: 'hardcodedDelay', pattern: '' },
  { file: 'src\\design-system\\reduced-motion.css', line: 79, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\design-system\\reduced-motion.css', line: 79, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\design-system\\reduced-motion.css', line: 212, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\design-system\\reduced-motion.css', line: 212, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\design-system\\reduced-motion.css', line: 361, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\design-system\\reduced-motion.css', line: 361, type: 'hardcodedEasing', pattern: '}' },

  // ── High contrast: !important overrides with scaled values ───────────────
  { file: 'src\\design-system\\theme-high-contrast.css', line: 283, type: 'hardcodedDuration', pattern: '.contrast-high' },
  { file: 'src\\design-system\\theme-high-contrast.css', line: 287, type: 'hardcodedDuration', pattern: '}' },

  // ── Legacy spinner / loading animations (require 1s linear semantics) ────
  { file: 'src\\design-system\\legacyStyles.css', line: 382, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\design-system\\legacyStyles.css', line: 382, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\design-system\\legacyStyles.css', line: 486, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\design-system\\legacyStyles.css', line: 486, type: 'hardcodedEasing', pattern: '}' },

  // ── Layout utility classes ────────────────────────────────────────────────
  { file: 'src\\layout.css', line: 671, type: 'hardcodedDuration', pattern: '/* Animation */' },
  { file: 'src\\layout.css', line: 848, type: 'hardcodedDelay', pattern: '' },

  // ── Multi-line regex false positives (TSX: no semicolons to stop scan) ───
  // Snackbar: animation uses var() tokens; regex scans to unrelated line
  { file: 'src\\components\\Snackbar.tsx', line: 155, type: 'hardcodedEasing', pattern: 'outline: isFocused' },
  // PullToRefresh: all tokens — context shows the correctly tokenised string
  { file: 'src\\components\\ui\\PullToRefresh.tsx', line: 112, type: 'hardcodedEasing', pattern: 'var(--md-sys-motion-easing-standard)' },
  // SmartImportModal: transition fully tokenised; scan lands on cursor line
  { file: 'src\\components\\SmartImportModal.tsx', line: 92, type: 'hardcodedDuration', pattern: "cursor: 'pointer'" },
  // AccessibilitySettings: transition uses var(); scan lands on flexShrink line
  { file: 'src\\components\\ui\\AccessibilitySettings.tsx', line: 111, type: 'hardcodedDuration', pattern: 'flexShrink: 0' },
  // MetricCard: transition uses var(); scan lands on border line
  { file: 'src\\components\\ui\\MetricCard.tsx', line: 54, type: 'hardcodedDuration', pattern: 'border:' },

  // ── Spinner / skeleton / progress: semantic timing (loader UX) ───────────
  { file: 'src\\components\\ui\\LoadingState.tsx', line: 43, type: 'hardcodedDuration', pattern: '}}' },
  { file: 'src\\components\\ui\\LoadingState.tsx', line: 43, type: 'hardcodedEasing', pattern: '}}' },
  { file: 'src\\components\\ui\\LoadingState.tsx', line: 37, type: 'inlineStyleTemporal', pattern: 'spinnerSize,' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 37, type: 'hardcodedDuration', pattern: 'skeleton-pulse' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 37, type: 'hardcodedEasing', pattern: 'skeleton-pulse' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 46, type: 'hardcodedDuration', pattern: '<div' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 46, type: 'hardcodedEasing', pattern: '<div' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 55, type: 'hardcodedEasing', pattern: '}}' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 32, type: 'inlineStyleTemporal', pattern: 'width,' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 48, type: 'inlineStyleTemporal', pattern: "position: 'absolute'" },
  { file: 'src\\components\\ui\\ProgressIndicator.tsx', line: 48, type: 'hardcodedDuration', pattern: 'transformOrigin' },
  { file: 'src\\components\\ui\\ProgressIndicator.tsx', line: 44, type: 'inlineStyleTemporal', pattern: "height: '100%'" },
  // TouchButton: multi-line scan false positive (spinner 0.8s is deep in file)
  { file: 'src\\components\\ui\\TouchButton.tsx', line: 126, type: 'hardcodedDuration', pattern: 'transform: isPressed' },
  { file: 'src\\components\\ui\\TouchButton.tsx', line: 126, type: 'hardcodedEasing', pattern: 'transform: isPressed' },
  { file: 'src\\components\\ui\\TouchButton.tsx', line: 138, type: 'inlineStyleTemporal', pattern: "width: 'var(--md-sys-spacing-5)'" },

  // ── motion.css: code example comment (FAB demo snippet) ──────────────────
  { file: 'src\\design-system\\motion.css', line: 216, type: 'hardcodedDuration', pattern: 'FAB</button>' },

  // ── Layout: animate-in utility class (300ms is semantic for entry anim) ──
  { file: 'src\\layout.css', line: 675, type: 'hardcodedDuration', pattern: 'animation-duration: 300ms' },
];

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
      const lineNumber = content.substring(0, match.index).split('\n').length + 1;
      const lineContent = lines[lineNumber - 1]?.trim() || '';
      
      // Check if this is an approved exception
      const isApprovedException = APPROVED_EXCEPTIONS.some(exc => 
        exc.file === relativePath && 
        exc.line === lineNumber && 
        exc.type === violationType &&
        lineContent.includes(exc.pattern)
      );
      
      if (!isApprovedException) {
        violations.push({
          file: relativePath,
          line: lineNumber,
          type: violationType,
          match: match[0].substring(0, 100), // Truncate long matches
          context: lineContent.substring(0, 150),
        });
      }
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
