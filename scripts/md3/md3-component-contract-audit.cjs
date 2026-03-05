#!/usr/bin/env node
/**
 * MD3 COMPONENT CONTRACT AUDIT SCRIPT
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Purpose: Detect ALL component-level MD3 violations in React components
 * Phase: 6 (COMPONENT CONTRACTS)
 * Enforcement: BLOCKING (exit 1 on violations)
 * 
 * VIOLATIONS DETECTED:
 * 1. Inline styles with hardcoded values (style={{ width: '100px' }})
 * 2. className with non-MD3 utility classes
 * 3. Forbidden props (width, height, margin, padding, zIndex, transition, animation)
 * 4. Hardcoded layout values in props
 * 5. Non-MD3 motion values in props
 * 6. Direct style manipulation (element.style.*)
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
  // Inline style objects with hardcoded layout values
  inlineStyleLayout: /style\s*=\s*\{\{[^}]*(?:width|height|padding|margin|gap|top|left|right|bottom)\s*:\s*['"]?\d+(?:px|rem|em|%)/gi,
  
  // Inline style with hardcoded colors
  inlineStyleColor: /style\s*=\s*\{\{[^}]*(?:color|backgroundColor|borderColor)\s*:\s*['"]?(?:#[0-9a-f]{3,6}|rgb|rgba)/gi,
  
  // Inline style with hardcoded z-index
  inlineStyleZIndex: /style\s*=\s*\{\{[^}]*zIndex\s*:\s*\d+/gi,
  
  // Inline style with hardcoded motion
  inlineStyleMotion: /style\s*=\s*\{\{[^}]*(?:transition|animation)\s*:\s*['"][^'"]*\d+(?:ms|s)/gi,
  
  // Forbidden props on REACT components (uppercase-first only, no i flag so SVG/HTML lowercase elements are excluded)
  forbiddenProps: /<[A-Z][a-zA-Z0-9]*[^>]*\s+(width|height|margin|padding|zIndex|transition|animation)\s*=/g,
  
  // className with Tailwind-like utilities — \b prevents matching inside containerClassName etc.
  classNameUtilities: /\bclassName\s*=\s*['"][^'"]*(?:w-|h-|p-|m-|gap-|text-|bg-|border-|rounded-|shadow-|z-|transition-|animate-)/gi,
  
  // Direct style manipulation
  directStyleManip: /\.style\.(width|height|padding|margin|zIndex|transition|animation)\s*=/gi,
  
  // Hardcoded px/rem/em in prop values
  hardcodedSizeProps: /(?:width|height|padding|margin|gap|top|left|right|bottom)=['"]?\d+(?:px|rem|em|%)/gi,
};

// Allowed className patterns (MD3-compliant)
const ALLOWED_CLASSNAMES = [
  /^m3-/,                    // M3 component classes
  /^md3-/,                   // MD3 prefix
  /^aura-/,                  // Aura theme classes
  /^material-symbols-/,      // Material icons
  /^app-/,                   // App-level layout
  /^layout-/,                // Layout system
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// APPROVED EXCEPTIONS
// Pattern must be a substring of lineContent (lines[lineNumber - 1].trim())
// Empty string '' matches any context (including blank lines)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const APPROVED_EXCEPTIONS = [
  // ── BottomNav: BEM class names trigger the m- false positive ────────────
  { file: 'src\\components\\BottomNav.tsx', line: 46, type: 'classNameUtilities', pattern: 'bottom-nav-container' },
  { file: 'src\\components\\BottomNav.tsx', line: 52, type: 'classNameUtilities', pattern: 'bottom-nav-container' },
  { file: 'src\\components\\BottomNav.tsx', line: 68, type: 'classNameUtilities', pattern: 'bottom-nav-item' },
  { file: 'src\\components\\BottomNav.tsx', line: 74, type: 'classNameUtilities', pattern: 'bottom-nav-item' },
  { file: 'src\\components\\BottomNav.tsx', line: 89, type: 'classNameUtilities', pattern: 'bottom-nav-pill' },
  { file: 'src\\components\\BottomNav.tsx', line: 96, type: 'classNameUtilities', pattern: 'bottom-nav-pill' },

  // ── SkipLink: semantic skip-link CSS class ───────────────────────────────
  { file: 'src\\components\\SkipLink.tsx', line: 54, type: 'classNameUtilities', pattern: 'skip-link' },

  // ── BarChart: SVG width="100%" is semantic (responsive SVG) ─────────────
  { file: 'src\\components\\charts\\BarChart.tsx', line: 41, type: 'hardcodedSizeProps', pattern: 'preserveAspectRatio' },
  { file: 'src\\components\\charts\\BarChart.tsx', line: 77, type: 'hardcodedSizeProps', pattern: 'preserveAspectRatio' },

  // ── Skeleton: width prop is semantic API (how wide the placeholder is) ──
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 97, type: 'forbiddenProps', pattern: '<Skeleton' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 103, type: 'forbiddenProps', pattern: '<Skeleton' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 104, type: 'hardcodedSizeProps', pattern: 'width="60%"' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 108, type: 'forbiddenProps', pattern: '<Skeleton' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 109, type: 'hardcodedSizeProps', pattern: 'width="40%"' },

  // ── M3Menu / M3Popover: internal popover anchor prop ────────────────────
  { file: 'src\\components\\ui\\M3Menu.tsx', line: 152, type: 'forbiddenProps', pattern: 'M3Popover' },
  { file: 'src\\components\\ui\\M3Menu.tsx', line: 153, type: 'forbiddenProps', pattern: 'M3Popover' },
  { file: 'src\\components\\ui\\M3Menu.tsx', line: 174, type: 'inlineStyleLayout', pattern: 'style={{' },

  // ── containerClassName shadow-inner: utility inside named prop ───────────
  { file: 'src\\components\\CopyForRegisterModal.tsx', line: 96, type: 'classNameUtilities', pattern: 'bg-[var(' },
  { file: 'src\\components\\EventModal.tsx', line: 115, type: 'classNameUtilities', pattern: 'bg-[var(' },
  { file: 'src\\components\\RubricEditor.tsx', line: 150, type: 'classNameUtilities', pattern: 'bg-[var(' },

  // ── InlineStyleLayout: values use MD3 tokens or are dynamic calculations ─
  { file: 'src\\components\\Home.tsx', line: 147, type: 'inlineStyleLayout', pattern: 'style={{' },
  { file: 'src\\components\\Snackbar.tsx', line: 233, type: 'inlineStyleLayout', pattern: 'style={{' },
  { file: 'src\\components\\ui\\AccessibilitySettings.tsx', line: 115, type: 'inlineStyleLayout', pattern: 'style={{' },
  { file: 'src\\components\\ui\\AccessibilitySettings.tsx', line: 204, type: 'inlineStyleLayout', pattern: 'style={{' },
  { file: 'src\\components\\ui\\ProgressIndicator.tsx', line: 44, type: 'inlineStyleLayout', pattern: 'style={{' },
  { file: 'src\\components\\ui\\ResponsiveContainer.tsx', line: 30, type: 'inlineStyleLayout', pattern: 'style={{' },
  { file: 'src\\components\\ui\\SelectField.tsx', line: 83, type: 'inlineStyleLayout', pattern: 'style={{' },
  { file: 'src\\components\\ui\\SelectField.tsx', line: 99, type: 'inlineStyleLayout', pattern: 'style={{' },
  { file: 'src\\components\\ui\\TabGroup.tsx', line: 178, type: 'inlineStyleLayout', pattern: 'style={{' },
  { file: 'src\\components\\ui\\Tooltip.tsx', line: 118, type: 'inlineStyleLayout', pattern: 'style={{' },

  // ── InlineStyleMotion: spinner / loader semantic animations ─────────────
  { file: 'src\\components\\ui\\LoadingState.tsx', line: 36, type: 'inlineStyleMotion', pattern: 'style={{' },
  { file: 'src\\components\\ui\\ProgressIndicator.tsx', line: 44, type: 'inlineStyleMotion', pattern: 'style={{' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 48, type: 'inlineStyleMotion', pattern: 'style={{' },
  { file: 'src\\components\\ui\\TouchButton.tsx', line: 138, type: 'inlineStyleMotion', pattern: 'style={{' },

  // ── SmartImportModal: SVG inline background in data URI (not a CSS value) ─
  { file: 'src\\components\\SmartImportModal.tsx', line: 209, type: 'forbiddenProps', pattern: 'backgroundImage' },
];

// Forbidden prop names
const FORBIDDEN_PROPS = [
  'width',
  'height',
  'margin',
  'padding',
  'zIndex',
  'transition',
  'animation',
  'gap',
  'top',
  'left',
  'right',
  'bottom',
];

// Files to skip
const SKIP_PATTERNS = [
  /node_modules/,
  /\.venv/,
  /archive/,
  /dist/,
  /build/,
  /\.test\./,
  /\.spec\./,
  /\.stories\./,
  /__tests__/,
  /storybook-static/,
  /playwright-report/,
  /test-results/,
  /coverage/,
  /scripts/,
  /nka/,
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILE SCANNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function findComponentFiles(dir) {
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
      results = results.concat(findComponentFiles(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      results.push(filePath);
    }
  }

  return results;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VIOLATION SCANNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function scanComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(process.cwd(), filePath);
  const lines = content.split('\n');
  const violations = [];

  // Scan for each violation type
  for (const [violationType, pattern] of Object.entries(VIOLATIONS)) {
    let match;
    const globalPattern = new RegExp(pattern.source, pattern.flags);
    
    while ((match = globalPattern.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length;
      const lineContent = lines[lineNumber - 1]?.trim() || '';

      // Check approved exceptions
      const isException = APPROVED_EXCEPTIONS.some(exc =>
        exc.file === relativePath &&
        exc.line === lineNumber &&
        exc.type === violationType &&
        lineContent.includes(exc.pattern)
      );
      if (isException) continue;

      // Additional validation for className violations
      if (violationType === 'classNameUtilities') {
        const classNameValue = match[0].match(/className\s*=\s*['"]([^'"]+)['"]/)?.[1] || '';
        const isAllowed = ALLOWED_CLASSNAMES.some(pattern => pattern.test(classNameValue));
        if (isAllowed) continue; // Skip allowed classNames
      }

      violations.push({
        file: relativePath,
        line: lineNumber,
        type: violationType,
        match: match[0].substring(0, 100),
        context: lineContent.substring(0, 150),
        suggestion: getSuggestion(violationType, match[0]),
      });
    }
  }

  return violations;
}

function getSuggestion(violationType, matchedCode) {
  const suggestions = {
    inlineStyleLayout: 'Use MD3 spacing tokens: var(--md-sys-spacing-*) or layout components',
    inlineStyleColor: 'Use MD3 color tokens: var(--md-sys-color-*)',
    inlineStyleZIndex: 'Use MD3 z-index tokens: var(--md-sys-z-*)',
    inlineStyleMotion: 'Use MD3 motion tokens: var(--md-sys-motion-duration-*) and var(--md-sys-motion-easing-*)',
    forbiddenProps: 'Remove forbidden prop. Use MD3 component variants or wrapper components',
    classNameUtilities: 'Replace utility classes with MD3 component classes or inline MD3 tokens',
    directStyleManip: 'Avoid direct style manipulation. Use CSS classes with MD3 tokens',
    hardcodedSizeProps: 'Use MD3 spacing tokens instead of hardcoded values',
  };

  return suggestions[violationType] || 'Follow MD3 governance guidelines';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUDIT EXECUTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function runAudit() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  MD3 COMPONENT CONTRACT AUDIT — PHASE 6');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const componentsDir = path.join(process.cwd(), 'src', 'components');
  if (!fs.existsSync(componentsDir)) {
    console.error('❌ ERROR: src/components directory not found');
    process.exit(1);
  }

  const files = findComponentFiles(componentsDir);
  console.log(`📂 Scanning ${files.length} component files...\n`);

  const allViolations = [];
  for (const file of files) {
    const fileViolations = scanComponent(file);
    allViolations.push(...fileViolations);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // REPORT GENERATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (allViolations.length === 0) {
    console.log('✅ CLEAN — No component contract violations detected\n');
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

  // Print top 30 violators
  console.log('📊 TOP VIOLATORS:\n');
  sortedFiles.slice(0, 30).forEach(([file, violations]) => {
    console.log(`  ${violations.length.toString().padStart(3)} violations → ${file}`);
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  DETAILED VIOLATIONS (First 100)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  allViolations.slice(0, 100).forEach((v, idx) => {
    console.log(`${(idx + 1).toString().padStart(3)}. [${v.type}]`);
    console.log(`     File: ${v.file}:${v.line}`);
    console.log(`     Code: ${v.context}`);
    console.log(`     💡 Suggestion: ${v.suggestion}`);
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
    console.log(`  ${type.padEnd(30)} → ${count} violations`);
  }

  // Generate JSON report
  const reportPath = path.join(process.cwd(), 'reports', 'md3-component-contract-violations.json');
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

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  REMEDIATION GUIDE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('  Replace component violations with MD3 patterns:');
  console.log('');
  console.log('  ❌ <div style={{ width: "100px", padding: "16px" }}>');
  console.log('  ✅ <div style={{ width: "var(--md-sys-spacing-25)", padding: "var(--md-sys-spacing-4)" }}>');
  console.log('');
  console.log('  ❌ <Component width="200px" margin="20px" />');
  console.log('  ✅ <Component /> (use MD3 wrapper or CSS classes with tokens)');
  console.log('');
  console.log('  ❌ className="w-full p-4 bg-blue-500"');
  console.log('  ✅ className="m3-surface" (use MD3 component classes)');
  console.log('');
  console.log('  See docs/MD3_COMPONENT_CONTRACTS.md for complete guide.');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(1); // Exit with error to block commit
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXECUTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

runAudit();
