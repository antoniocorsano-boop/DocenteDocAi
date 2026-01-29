#!/usr/bin/env node
/**
 * MD3 Z-INDEX GOVERNANCE - Static Analysis Script
 * 
 * PHASE 4 - STEP 4: Anti-Regression Protection
 * 
 * Scans all TSX/TS/CSS files for numeric z-index violations
 * Enforces exclusive use of MD3 z-index tokens: var(--md-sys-z-*)
 * 
 * EXIT CODES:
 * - 0: No violations found (clean)
 * - 1: Violations detected (BLOCKS COMMIT)
 */

const fs = require('fs');
const path = require('path');

// CONFIGURATION
const SRC_DIR = path.join(__dirname, '../../src');
const EXTENSIONS = ['.tsx', '.ts', '.css', '.module.css'];
const MD3_Z_INDEX_TOKEN_PREFIX = '--md-sys-z-';

// VIOLATION PATTERNS
const VIOLATIONS = {
  // Inline numeric zIndex in React/TSX
  numericZIndex: /zIndex\s*:\s*(\d+)/g,
  
  // CSS numeric z-index
  cssZIndex: /z-index\s*:\s*(\d+)/g,
  
  // JavaScript z-index constants (e.g., Z_INDEX.modal)
  jsConstantZIndex: /Z_INDEX\.[a-zA-Z_]+/g,
  
  // z-index using non-MD3 variables
  nonMD3Variable: /z-index\s*:\s*var\((?!--md-sys-z-)/g,
  
  // Direct zIndex property assignment with number
  directAssignment: /\.zIndex\s*=\s*(\d+)/g,
};

// ALLOWED PATTERNS (whitelist)
const ALLOWED = {
  md3Token: /var\(--md-sys-z-[a-z-]+\)/,
  cssVariable: /var\(--md-sys-z-/,
};

/**
 * Recursively find all files with matching extensions
 */
function findFiles(dir, extensions, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, dist, build directories
      if (!['node_modules', 'dist', 'build', '__tests__'].includes(file)) {
        findFiles(filePath, extensions, fileList);
      }
    } else {
      if (extensions.some(ext => file.endsWith(ext))) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Scan a single file for z-index violations
 */
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const violations = [];
  const lines = content.split('\n');

  // Check each violation pattern
  Object.entries(VIOLATIONS).forEach(([type, regex]) => {
    let match;
    
    // Reset regex state
    regex.lastIndex = 0;
    
    while ((match = regex.exec(content)) !== null) {
      // Find line number
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;
      const lineContent = lines[lineNumber - 1].trim();

      // Skip if it's a comment or in a string literal
      if (lineContent.startsWith('//') || lineContent.startsWith('/*') || lineContent.startsWith('*')) {
        continue;
      }

      // Check if it's using an allowed pattern (MD3 token)
      const contextStart = Math.max(0, match.index - 50);
      const contextEnd = Math.min(content.length, match.index + match[0].length + 50);
      const context = content.substring(contextStart, contextEnd);

      if (ALLOWED.md3Token.test(context)) {
        // This is a valid MD3 token usage
        continue;
      }

      violations.push({
        type,
        file: path.relative(process.cwd(), filePath),
        line: lineNumber,
        column: match.index - beforeMatch.lastIndexOf('\n'),
        match: match[0],
        snippet: lineContent,
        severity: 'ERROR',
      });
    }
  });

  return violations;
}

/**
 * Main audit function
 */
function runAudit() {
  console.log('🔍 MD3 Z-INDEX GOVERNANCE AUDIT\n');
  console.log('Scanning src/ directory for z-index violations...\n');

  const files = findFiles(SRC_DIR, EXTENSIONS);
  console.log(`📂 Found ${files.length} files to scan\n`);

  const allViolations = [];

  files.forEach(file => {
    const violations = scanFile(file);
    if (violations.length > 0) {
      allViolations.push(...violations);
    }
  });

  // REPORT RESULTS
  if (allViolations.length === 0) {
    console.log('✅ Z-INDEX AUDIT PASSED');
    console.log('✓ No numeric z-index violations detected');
    console.log('✓ All z-index values use MD3 tokens (var(--md-sys-z-*))\n');
    return 0; // EXIT SUCCESS
  }

  // VIOLATIONS DETECTED
  console.log('❌ Z-INDEX AUDIT FAILED\n');
  console.log(`🚫 Found ${allViolations.length} violations:\n`);

  // Group by file
  const byFile = allViolations.reduce((acc, v) => {
    if (!acc[v.file]) acc[v.file] = [];
    acc[v.file].push(v);
    return acc;
  }, {});

  Object.entries(byFile).forEach(([file, violations]) => {
    console.log(`📄 ${file}`);
    violations.forEach(v => {
      console.log(`   Line ${v.line}: ${v.type}`);
      console.log(`   ${v.snippet}`);
      console.log(`   → Found: ${v.match}`);
      console.log('');
    });
  });

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('❌ COMMIT BLOCKED - MD3 Z-INDEX VIOLATIONS DETECTED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📋 TO FIX:');
  console.log('   1. Replace numeric z-index with MD3 tokens:');
  console.log('      zIndex: 1000  →  zIndex: "var(--md-sys-z-modal)"');
  console.log('      z-index: 100  →  z-index: var(--md-sys-z-content)');
  console.log('');
  console.log('   2. Available MD3 z-index tokens:');
  console.log('      --md-sys-z-base      (0)');
  console.log('      --md-sys-z-content   (100)');
  console.log('      --md-sys-z-overlay   (200)');
  console.log('      --md-sys-z-modal     (300)');
  console.log('      --md-sys-z-tooltip   (400)');
  console.log('      --md-sys-z-snackbar  (500)');
  console.log('');
  console.log('   3. See: src/design-system/tokens/md3-z-index.css');
  console.log('   4. See: docs/MD3_Z_INDEX_GOVERNANCE.md\n');

  return 1; // EXIT FAILURE
}

// EXECUTE AUDIT
const exitCode = runAudit();
process.exit(exitCode);
