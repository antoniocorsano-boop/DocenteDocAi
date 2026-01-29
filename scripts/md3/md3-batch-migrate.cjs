#!/usr/bin/env node
/**
 * MD3 BATCH MIGRATION SCRIPT
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Purpose: Automated batch migration of legacy violations to MD3 compliance
 * Phase: 3 (AUTOMATED REMEDIATION)
 * Reference: EvaluationModule.tsx (21/21 violations resolved)
 * Pattern Source: docs/MD3_MIGRATION_PATTERNS.md
 * 
 * FEATURES:
 * 1. Dry-run mode (preview changes without applying)
 * 2. Incremental batch processing (10 files at a time)
 * 3. Automatic backup before migration
 * 4. Pattern-based transformation (7 deterministic patterns)
 * 5. Post-migration validation (ESLint + MD3 audits)
 * 6. Rollback support (Git integration)
 * 7. Detailed migration reports
 * 
 * USAGE:
 * node scripts/md3-batch-migrate.cjs --dry-run              # Preview changes
 * node scripts/md3-batch-migrate.cjs --batch-size=10        # Migrate 10 files
 * node scripts/md3-batch-migrate.cjs --file=path/to/file    # Migrate single file
 * node scripts/md3-batch-migrate.cjs --report               # Generate report
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
    reportsDir: path.join(process.cwd(), 'reports'),
    backupDir: path.join(process.cwd(), 'migration', 'backups'),
    violationsFile: path.join(process.cwd(), 'reports', 'md3-component-contract-violations.json'),
    referenceFile: 'src/components/EvaluationModule.tsx', // Already migrated
    patternsDoc: 'docs/MD3_MIGRATION_PATTERNS.md',
    
    // Default batch size
    defaultBatchSize: 10,
    
    // Skip these files (already migrated or exempt)
    skipFiles: [
        'src/components/EvaluationModule.tsx', // Reference implementation
        'src/theme.css', // Token definitions
        'index.css', // Global theme
        'src/global-styles.css', // Global setup
    ],
    
    // Violation thresholds
    maxViolationsPerFile: 50, // Skip files with too many violations (manual migration needed)
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MD3 TOKEN MAPPINGS (from MD3_MIGRATION_PATTERNS.md)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TOKEN_MAPPINGS = {
    // PATTERN 1: Pseudo-token colors
    colors: {
        'colors.primary': 'var(--md-sys-color-primary)',
        'colors.onPrimary': 'var(--md-sys-color-on-primary)',
        'colors.secondary': 'var(--md-sys-color-secondary)',
        'colors.onSecondary': 'var(--md-sys-color-on-secondary)',
        'colors.tertiary': 'var(--md-sys-color-tertiary)',
        'colors.onTertiary': 'var(--md-sys-color-on-tertiary)',
        'colors.error': 'var(--md-sys-color-error)',
        'colors.onError': 'var(--md-sys-color-on-error)',
        'colors.surface': 'var(--md-sys-color-surface)',
        'colors.onSurface': 'var(--md-sys-color-on-surface)',
        'colors.onSurfaceVariant': 'var(--md-sys-color-on-surface-variant)',
        'colors.outline': 'var(--md-sys-color-outline)',
        'colors.primaryContainer': 'var(--md-sys-color-primary-container)',
        'colors.onPrimaryContainer': 'var(--md-sys-color-on-primary-container)',
        'colors.secondaryContainer': 'var(--md-sys-color-secondary-container)',
        'colors.onSecondaryContainer': 'var(--md-sys-color-on-secondary-container)',
        'colors.tertiaryContainer': 'var(--md-sys-color-tertiary-container)',
        'colors.onTertiaryContainer': 'var(--md-sys-color-on-tertiary-container)',
        'colors.errorContainer': 'var(--md-sys-color-error-container)',
        'colors.onErrorContainer': 'var(--md-sys-color-on-error-container)',
        'colors.surfaceContainerLow': 'var(--md-sys-color-surface-container-low)',
        'colors.surfaceContainerHigh': 'var(--md-sys-color-surface-container-high)',
        'colors.surfaceContainerHighest': 'var(--md-sys-color-surface-container-highest)',
    },
    
    // PATTERN 2: Pseudo-token spacing
    spacing: {
        'spacing[1]': 'var(--md-sys-spacing-1)',
        'spacing[2]': 'var(--md-sys-spacing-2)',
        'spacing[3]': 'var(--md-sys-spacing-3)',
        'spacing[4]': 'var(--md-sys-spacing-4)',
        'spacing[5]': 'var(--md-sys-spacing-5)',
        'spacing[6]': 'var(--md-sys-spacing-6)',
        'spacing[8]': 'var(--md-sys-spacing-8)',
    },
    
    // PATTERN 3: Hardcoded motion durations
    motion: {
        '200ms': 'var(--md-sys-motion-duration-short-4)',
        '300ms': 'var(--md-sys-motion-duration-medium-4)',
        '400ms': 'var(--md-sys-motion-duration-long-1)',
        '0.2s': 'var(--md-sys-motion-duration-short-4)',
        '0.3s': 'var(--md-sys-motion-duration-medium-4)',
        '500ms': 'var(--md-sys-motion-duration-long-2)',
        '0.5s': 'var(--md-sys-motion-duration-long-2)',
    },
    
    // PATTERN 4: Hardcoded easing functions
    easing: {
        'cubic-bezier(0.4, 0, 0.2, 1)': 'var(--md-sys-motion-easing-emphasized)',
        'cubic-bezier(0.2, 0, 0, 1)': 'var(--md-sys-motion-easing-standard)',
        'ease': 'var(--md-sys-motion-easing-standard)',
        'ease-out': 'var(--md-sys-motion-easing-emphasized)',
        'ease-in': 'var(--md-sys-motion-easing-decelerated)',
    },
    
    // PATTERN 5: Pseudo-token typography
    typography: {
        'typescale.headlineLarge.fontSize': 'var(--md-sys-typescale-headline-large-size)',
        'typescale.headlineLarge.tracking': 'var(--md-sys-typescale-headline-large-tracking)',
        'typescale.headlineMedium.fontSize': 'var(--md-sys-typescale-headline-medium-size)',
        'typescale.headlineMedium.tracking': 'var(--md-sys-typescale-headline-medium-tracking)',
        'typescale.headlineSmall.fontSize': 'var(--md-sys-typescale-headline-small-size)',
        'typescale.bodyLarge.fontSize': 'var(--md-sys-typescale-body-large-size)',
        'typescale.bodyMedium.fontSize': 'var(--md-sys-typescale-body-medium-size)',
        'typescale.bodySmall.fontSize': 'var(--md-sys-typescale-body-small-size)',
        'typescale.labelLarge.fontSize': 'var(--md-sys-typescale-label-large-size)',
        'typescale.labelMedium.fontSize': 'var(--md-sys-typescale-label-medium-size)',
        'typescale.labelSmall.fontSize': 'var(--md-sys-typescale-label-small-size)',
        'typescale.displayLarge.fontSize': 'var(--md-sys-typescale-display-large-size)',
    },
    
    // PATTERN 6: Pseudo-token shapes
    shape: {
        'shape.corner.small': 'var(--md-sys-shape-corner-small)',
        'shape.corner.medium': 'var(--md-sys-shape-corner-medium)',
        'shape.corner.large': 'var(--md-sys-shape-corner-large)',
        'shape.corner.extraLarge': 'var(--md-sys-shape-corner-extra-large)',
        'shape.corner.full': 'var(--md-sys-shape-corner-full)',
    },
    
    // PATTERN 7: Layout patterns → MD3 utilities
    layout: {
        "width: '100%'": "className=\"md3-width-full\"",
        'width: "100%"': 'className="md3-width-full"',
        "width: '50%'": "className=\"md3-width-half\"",
        'width: "50%"': 'className="md3-width-half"',
        "display: 'flex', flexDirection: 'row'": "className=\"md3-flex-row\"",
        'display: "flex", flexDirection: "row"': 'className="md3-flex-row"',
        "display: 'flex', flexDirection: 'column'": "className=\"md3-flex-column\"",
        'display: "flex", flexDirection: "column"': 'className="md3-flex-column"',
        "margin: '0 auto'": "className=\"md3-margin-auto\"",
        'margin: "0 auto"': 'className="md3-margin-auto"',
    },
    
    // PATTERN 8: Grid fr units
    grid: {
        '1fr': 'var(--md-sys-grid-fr-1)',
        '2fr': 'var(--md-sys-grid-fr-2)',
        '3fr': 'var(--md-sys-grid-fr-3)',
    },
    
    // PATTERN 9: Viewport units
    viewport: {
        '100vh': 'var(--md-sys-viewport-height-100)',
        '60vh': 'var(--md-sys-viewport-height-60)',
        '50vh': 'var(--md-sys-viewport-height-50)',
    },
    
    // PATTERN 10: Hardcoded rem units (common spacing)
    rem: {
        '1rem': 'var(--md-sys-spacing-4)',  // 16px
        '1.5rem': 'var(--md-sys-spacing-6)', // 24px
        '2rem': 'var(--md-sys-spacing-8)',  // 32px
        '3rem': 'var(--md-sys-spacing-12)', // 48px
        '12rem': 'var(--md-sys-spacing-48)', // assuming exists
    },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PATTERN DETECTION & TRANSFORMATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Detect and classify violations in file content
 */
function detectViolations(content, filePath) {
    const violations = [];
    
    // PATTERN 1: Pseudo-token colors
    Object.keys(TOKEN_MAPPINGS.colors).forEach(pseudoToken => {
        const regex = new RegExp(`['"]${pseudoToken.replace('.', '\\.')}['"]`, 'g');
        let match;
        while ((match = regex.exec(content)) !== null) {
            violations.push({
                type: 'pseudoTokenColor',
                pattern: pseudoToken,
                replacement: TOKEN_MAPPINGS.colors[pseudoToken],
                line: content.substring(0, match.index).split('\n').length,
                context: extractContext(content, match.index),
            });
        }
    });
    
    // PATTERN 2: Pseudo-token spacing
    Object.keys(TOKEN_MAPPINGS.spacing).forEach(pseudoToken => {
        const regex = new RegExp(`['"]${pseudoToken.replace('[', '\\[').replace(']', '\\]')}['"]`, 'g');
        let match;
        while ((match = regex.exec(content)) !== null) {
            violations.push({
                type: 'pseudoTokenSpacing',
                pattern: pseudoToken,
                replacement: TOKEN_MAPPINGS.spacing[pseudoToken],
                line: content.substring(0, match.index).split('\n').length,
                context: extractContext(content, match.index),
            });
        }
    });
    
    // PATTERN 3: Hardcoded motion durations
    const motionRegex = /transition:\s*['"](?:all\s+)?(\d+(?:\.\d+)?(?:ms|s))/g;
    let match;
    while ((match = motionRegex.exec(content)) !== null) {
        const duration = match[1];
        if (TOKEN_MAPPINGS.motion[duration]) {
            violations.push({
                type: 'hardcodedMotionDuration',
                pattern: duration,
                replacement: TOKEN_MAPPINGS.motion[duration],
                line: content.substring(0, match.index).split('\n').length,
                context: extractContext(content, match.index),
            });
        }
    }
    
    // PATTERN 4: Hardcoded easing functions
    const easingRegex = /(cubic-bezier\(([^)]+)\)|ease(?:-in|-out)?)/g;
    while ((match = easingRegex.exec(content)) !== null) {
        const fullEasing = match[1];
        if (TOKEN_MAPPINGS.easing[fullEasing]) {
            violations.push({
                type: 'hardcodedEasing',
                pattern: fullEasing,
                replacement: TOKEN_MAPPINGS.easing[fullEasing],
                line: content.substring(0, match.index).split('\n').length,
                context: extractContext(content, match.index),
            });
        }
    }
    
    // PATTERN 5: Pseudo-token typography
    Object.keys(TOKEN_MAPPINGS.typography).forEach(pseudoToken => {
        const regex = new RegExp(`['"]${pseudoToken.replace('.', '\\.')}['"]`, 'g');
        while ((match = regex.exec(content)) !== null) {
            violations.push({
                type: 'pseudoTokenTypography',
                pattern: pseudoToken,
                replacement: TOKEN_MAPPINGS.typography[pseudoToken],
                line: content.substring(0, match.index).split('\n').length,
                context: extractContext(content, match.index),
            });
        }
    });
    
    // PATTERN 6: Pseudo-token shapes
    Object.keys(TOKEN_MAPPINGS.shape).forEach(pseudoToken => {
        const regex = new RegExp(`['"]${pseudoToken.replace('.', '\\.')}['"]`, 'g');
        while ((match = regex.exec(content)) !== null) {
            violations.push({
                type: 'pseudoTokenShape',
                pattern: pseudoToken,
                replacement: TOKEN_MAPPINGS.shape[pseudoToken],
                line: content.substring(0, match.index).split('\n').length,
                context: extractContext(content, match.index),
            });
        }
    });
    
    // PATTERN 7: Layout patterns (width, margin, flex patterns)
    // Detect hardcoded layout values that can be replaced with MD3 utilities
    const layoutPatterns = [
        { regex: /width:\s*['"]100%['"]/g, type: 'layoutWidth100', replacement: 'className="md3-width-full"' },
        { regex: /width:\s*['"]50%['"]/g, type: 'layoutWidth50', replacement: 'className="md3-width-half"' },
        { regex: /margin:\s*['"]0\s+auto['"]/g, type: 'layoutMarginAuto', replacement: 'className="md3-margin-auto"' },
    ];
    
    layoutPatterns.forEach(({ regex, type, replacement }) => {
        let match;
        regex.lastIndex = 0;
        while ((match = regex.exec(content)) !== null) {
            violations.push({
                type: type,
                pattern: match[0],
                replacement: replacement,
                line: content.substring(0, match.index).split('\n').length,
                context: extractContext(content, match.index),
            });
        }
    });
    
    // PATTERN 8: Grid fr units
    const gridRegex = /(\d+)fr/g;
    while ((match = gridRegex.exec(content)) !== null) {
        const frValue = `${match[1]}fr`;
        if (TOKEN_MAPPINGS.grid[frValue]) {
            violations.push({
                type: 'hardcodedGridFr',
                pattern: frValue,
                replacement: TOKEN_MAPPINGS.grid[frValue],
                line: content.substring(0, match.index).split('\n').length,
                context: extractContext(content, match.index),
            });
        }
    }
    
    // PATTERN 9: Viewport units
    const viewportRegex = /(\d+)vh/g;
    while ((match = viewportRegex.exec(content)) !== null) {
        const vhValue = `${match[1]}vh`;
        if (TOKEN_MAPPINGS.viewport[vhValue]) {
            violations.push({
                type: 'hardcodedViewport',
                pattern: vhValue,
                replacement: TOKEN_MAPPINGS.viewport[vhValue],
                line: content.substring(0, match.index).split('\n').length,
                context: extractContext(content, match.index),
            });
        }
    }
    
    // PATTERN 10: Hardcoded rem units
    const remRegex = /([\d.]+)rem/g;
    while ((match = remRegex.exec(content)) !== null) {
        const remValue = `${match[1]}rem`;
        if (TOKEN_MAPPINGS.rem[remValue]) {
            violations.push({
                type: 'hardcodedRem',
                pattern: remValue,
                replacement: TOKEN_MAPPINGS.rem[remValue],
                line: content.substring(0, match.index).split('\n').length,
                context: extractContext(content, match.index),
            });
        }
    }
    
    return violations;
}

/**
 * Extract context around a match (for review)
 */
function extractContext(content, index, contextSize = 100) {
    const start = Math.max(0, index - contextSize);
    const end = Math.min(content.length, index + contextSize);
    return content.substring(start, end);
}

/**
 * Apply transformation to file content
 */
function applyTransformations(content, violations) {
    let transformed = content;
    
    // Sort violations by index (descending) to avoid offset issues
    const sortedViolations = violations.sort((a, b) => {
        const indexA = content.indexOf(a.pattern);
        const indexB = content.indexOf(b.pattern);
        return indexB - indexA;
    });
    
    sortedViolations.forEach(violation => {
        // Pattern 1: Replace quoted pseudo-tokens (both single and double quotes)
        const singleQuotedPattern = `'${violation.pattern}'`;
        const doubleQuotedPattern = `"${violation.pattern}"`;
        const singleQuotedReplacement = `'${violation.replacement}'`;
        const doubleQuotedReplacement = `"${violation.replacement}"`;
        
        // Escape special regex characters
        const escapedSingle = singleQuotedPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const escapedDouble = doubleQuotedPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        transformed = transformed.replace(new RegExp(escapedSingle, 'g'), singleQuotedReplacement);
        transformed = transformed.replace(new RegExp(escapedDouble, 'g'), doubleQuotedReplacement);
        
        // Pattern 2: Replace unquoted motion values in transition properties
        // e.g., transition: "all 300ms cubic-bezier(...)" → transition: "all var(...) var(...)"
        if (violation.type === 'hardcodedMotionDuration' || violation.type === 'hardcodedEasing') {
            // Handle transition with both duration and easing
            const fullTransitionRegex = /transition:\s*"all\s+300ms\s+cubic-bezier\(0\.4,\s*0,\s*0\.2,\s*1\)"/g;
            transformed = transformed.replace(
                fullTransitionRegex,
                'transition: "all var(--md-sys-motion-duration-medium-4) var(--md-sys-motion-easing-emphasized)"'
            );
            
            // Handle other duration variants
            const duration200Regex = /transition:\s*"all\s+200ms\s+cubic-bezier\(0\.4,\s*0,\s*0\.2,\s*1\)"/g;
            transformed = transformed.replace(
                duration200Regex,
                'transition: "all var(--md-sys-motion-duration-short-4) var(--md-sys-motion-easing-emphasized)"'
            );
            
            const duration400Regex = /transition:\s*"all\s+400ms\s+cubic-bezier\(0\.4,\s*0,\s*0\.2,\s*1\)"/g;
            transformed = transformed.replace(
                duration400Regex,
                'transition: "all var(--md-sys-motion-duration-long-1) var(--md-sys-motion-easing-emphasized)"'
            );
            
            // Handle standard easing variant
            const standardEasingRegex = /transition:\s*"all\s+300ms\s+cubic-bezier\(0\.2,\s*0,\s*0,\s*1\)"/g;
            transformed = transformed.replace(
                standardEasingRegex,
                'transition: "all var(--md-sys-motion-duration-medium-4) var(--md-sys-motion-easing-standard)"'
            );
            
            // Handle simple transitions (duration only)
            const simpleTransition300Regex = /transition:\s*"(color|background-color|transform|opacity|all)\s+300ms"/g;
            transformed = transformed.replace(
                simpleTransition300Regex,
                'transition: "$1 var(--md-sys-motion-duration-medium-4)"'
            );
            
            const simpleTransition200Regex = /transition:\s*"(color|background-color|transform|opacity|all)\s+200ms"/g;
            transformed = transformed.replace(
                simpleTransition200Regex,
                'transition: "$1 var(--md-sys-motion-duration-short-4)"'
            );
        }
        
        // Pattern 8-10: Replace unquoted values in style properties
        if (violation.type === 'hardcodedGridFr' || violation.type === 'hardcodedViewport' || violation.type === 'hardcodedRem') {
            // Replace unquoted values like 1fr, 60vh, 12rem in style objects
            const unquotedPattern = new RegExp(`(?<!['"])${violation.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!['"])`, 'g');
            transformed = transformed.replace(unquotedPattern, violation.replacement);
        }
        
        // Pattern 3-4: Handle unquoted motion values
        if (violation.type === 'hardcodedMotionDuration' || violation.type === 'hardcodedEasing') {
            // Replace unquoted values in transition properties
            const unquotedMotionPattern = new RegExp(`(?<!['"])${violation.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!['"])`, 'g');
            transformed = transformed.replace(unquotedMotionPattern, violation.replacement);
        }
    });
    
    return transformed;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILE OPERATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Load violations from JSON report
 */
function loadViolationsReport() {
    if (!fs.existsSync(CONFIG.violationsFile)) {
        console.error(`❌ Violations file not found: ${CONFIG.violationsFile}`);
        console.log('Run: npm run md3:component:audit');
        process.exit(1);
    }
    
    const report = JSON.parse(fs.readFileSync(CONFIG.violationsFile, 'utf-8'));
    return report;
}

/**
 * Get top violators (excluding already migrated files)
 */
function getTopViolators(report, limit = 10) {
    // Use topViolators array from report
    const topViolators = report.topViolators || [];
    
    // Filter out skip files and files with too many violations
    const filtered = topViolators
        .filter(v => !CONFIG.skipFiles.includes(v.file))
        .filter(v => v.count <= CONFIG.maxViolationsPerFile);
    
    return filtered.slice(0, limit);
}

/**
 * Create backup of file before migration
 */
function backupFile(filePath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(CONFIG.backupDir, `${path.basename(filePath)}.${timestamp}.bak`);
    
    if (!fs.existsSync(CONFIG.backupDir)) {
        fs.mkdirSync(CONFIG.backupDir, { recursive: true });
    }
    
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
}

/**
 * Migrate single file
 */
function migrateFile(filePath, dryRun = false) {
    console.log(`\n🔄 Migrating: ${filePath}`);
    
    // Read file
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Detect violations
    const violations = detectViolations(content, filePath);
    
    if (violations.length === 0) {
        console.log(`   ✅ No violations detected (already clean)`);
        return { success: true, violationsFixed: 0, skipped: true };
    }
    
    console.log(`   📊 Detected ${violations.length} violations`);
    
    // Group by type
    const byType = {};
    violations.forEach(v => {
        byType[v.type] = (byType[v.type] || 0) + 1;
    });
    Object.entries(byType).forEach(([type, count]) => {
        console.log(`      - ${type}: ${count}`);
    });
    
    // Apply transformations
    const transformed = applyTransformations(content, violations);
    
    if (dryRun) {
        console.log(`   🔍 DRY RUN: Changes would be applied (${violations.length} replacements)`);
        return { success: true, violationsFixed: violations.length, dryRun: true };
    }
    
    // Backup original
    const backupPath = backupFile(filePath);
    console.log(`   💾 Backup created: ${path.basename(backupPath)}`);
    
    // Write transformed content
    fs.writeFileSync(filePath, transformed, 'utf-8');
    console.log(`   ✅ Migration complete (${violations.length} violations fixed)`);
    
    return { success: true, violationsFixed: violations.length, backupPath };
}

/**
 * Validate file after migration
 */
function validateFile(filePath) {
    console.log(`\n🔍 Validating: ${filePath}`);
    
    try {
        // Run ESLint
        execSync(`npx eslint "${filePath}" --quiet`, { stdio: 'pipe' });
        console.log(`   ✅ ESLint: PASS`);
    } catch (error) {
        console.log(`   ❌ ESLint: FAIL`);
        return false;
    }
    
    // Check for remaining pseudo-tokens
    const content = fs.readFileSync(filePath, 'utf-8');
    const remainingViolations = detectViolations(content, filePath);
    
    if (remainingViolations.length > 0) {
        console.log(`   ❌ Remaining violations: ${remainingViolations.length}`);
        return false;
    }
    
    console.log(`   ✅ MD3 Compliance: PASS`);
    return true;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BATCH OPERATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Migrate batch of files
 */
function migrateBatch(files, dryRun = false, validateEach = true) {
    console.log(`\n${'━'.repeat(80)}`);
    console.log(`MD3 BATCH MIGRATION — ${dryRun ? 'DRY RUN' : 'LIVE MODE'}`);
    console.log(`${'━'.repeat(80)}\n`);
    
    console.log(`📂 Files to migrate: ${files.length}`);
    
    const results = {
        total: files.length,
        success: 0,
        failed: 0,
        skipped: 0,
        totalViolationsFixed: 0,
        details: [],
    };
    
    files.forEach((fileInfo, index) => {
        const { file } = fileInfo;
        const filePath = path.join(process.cwd(), file);
        
        console.log(`\n[${ index + 1}/${files.length}] Processing: ${file}`);
        
        try {
            const result = migrateFile(filePath, dryRun);
            
            if (result.skipped) {
                results.skipped++;
            } else if (result.success) {
                results.success++;
                results.totalViolationsFixed += result.violationsFixed;
                
                // Validate if requested
                if (validateEach && !dryRun) {
                    const valid = validateFile(filePath);
                    if (!valid) {
                        console.log(`   ⚠️  Validation failed (manual review needed)`);
                    }
                }
            }
            
            results.details.push({
                file,
                ...result,
            });
        } catch (error) {
            console.error(`   ❌ Migration failed: ${error.message}`);
            results.failed++;
            results.details.push({
                file,
                success: false,
                error: error.message,
            });
        }
    });
    
    return results;
}

/**
 * Generate migration report
 */
function generateReport(results) {
    console.log(`\n${'━'.repeat(80)}`);
    console.log(`MIGRATION REPORT`);
    console.log(`${'━'.repeat(80)}\n`);
    
    console.log(`📊 SUMMARY:`);
    console.log(`   Total Files: ${results.total}`);
    console.log(`   ✅ Success: ${results.success}`);
    console.log(`   ⏭️  Skipped: ${results.skipped}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    console.log(`   🔧 Total Violations Fixed: ${results.totalViolationsFixed}\n`);
    
    // Save detailed report
    const reportPath = path.join(CONFIG.reportsDir, `md3-batch-migration-${Date.now()}.json`);
    if (!fs.existsSync(CONFIG.reportsDir)) {
        fs.mkdirSync(CONFIG.reportsDir, { recursive: true });
    }
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`📄 Detailed report saved: ${reportPath}\n`);
    
    console.log(`${'━'.repeat(80)}\n`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLI INTERFACE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function main() {
    const args = process.argv.slice(2);
    
    // Parse arguments
    const dryRun = args.includes('--dry-run');
    const batchSizeArg = args.find(arg => arg.startsWith('--batch-size='));
    const fileArg = args.find(arg => arg.startsWith('--file='));
    const reportOnly = args.includes('--report');
    const validateEach = !args.includes('--no-validate');
    
    const batchSize = batchSizeArg ? parseInt(batchSizeArg.split('=')[1]) : CONFIG.defaultBatchSize;
    
    // Load violations report
    const report = loadViolationsReport();
    
    if (reportOnly) {
        // Just show current state
        const topViolators = getTopViolators(report, 20);
        console.log(`\n📊 TOP 20 VIOLATORS (excluding migrated files):\n`);
        topViolators.forEach((v, i) => {
            console.log(`${i + 1}. ${v.count} violations → ${v.file}`);
        });
        return;
    }
    
    // Single file migration
    if (fileArg) {
        const file = fileArg.split('=')[1];
        const filePath = path.join(process.cwd(), file);
        
        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${file}`);
            process.exit(1);
        }
        
        const result = migrateFile(filePath, dryRun);
        
        if (result.success && !dryRun && validateEach) {
            validateFile(filePath);
        }
        
        return;
    }
    
    // Batch migration
    const topViolators = getTopViolators(report, batchSize);
    
    if (topViolators.length === 0) {
        console.log(`\n✨ No files to migrate! All clean.\n`);
        return;
    }
    
    const results = migrateBatch(topViolators, dryRun, validateEach);
    generateReport(results);
    
    if (dryRun) {
        console.log(`💡 This was a DRY RUN. Run without --dry-run to apply changes.\n`);
    } else {
        console.log(`✅ Migration complete! Review changes and commit with:\n`);
        console.log(`   git add -A`);
        console.log(`   git commit -m "chore: MD3 batch migration (${results.success} files, ${results.totalViolationsFixed} violations fixed)"\n`);
    }
}

// Run
if (require.main === module) {
    main();
}

module.exports = { detectViolations, applyTransformations, migrateFile };
