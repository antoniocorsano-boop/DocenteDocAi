/**
 * MD3 Compliance Audit Script
 *
 * Automated audit tool for Material Design 3 compliance in React components.
 * Checks for proper usage of MD3 design tokens and identifies legacy CSS classes.
 *
 * @version 1.0.0
 * @since 2026-01-08
 */

const fs = require('fs');
const path = require('path');

/**
 * MD3 Design Token Patterns
 */
const MD3_PATTERNS = {
  // Color tokens
  colors: [
    /--md-sys-color-[a-z-]+/g,
    /var\(--md-sys-color-[a-z-]+\)/g
  ],

  // Spacing tokens
  spacing: [
    /--md-sys-spacing-\d+/g,
    /var\(--md-sys-spacing-\d+\)/g
  ],

  // Shape tokens
  shapes: [
    /--md-sys-shape-corner-[a-z]+/g,
    /var\(--md-sys-shape-corner-[a-z]+\)/g
  ],

  // Typography tokens
  typography: [
    /--md-sys-typescale-[a-z-]+-[a-z]+/g,
    /var\(--md-sys-typescale-[a-z-]+-[a-z]+\)/g
  ],

  // Elevation tokens
  elevation: [
    /--md-sys-elevation-level\d+/g,
    /var\(--md-sys-elevation-level\d+\)/g
  ]
};

/**
 * Legacy CSS Classes to Avoid
 * Note: MD3 tokens using var(--md-sys-*) are allowed
 */
const LEGACY_CLASSES = [
  // Tailwind color/utility classes (but allow MD3 tokens)
  /\bbg-(?!\[var\(--md-sys-)/g,
  /\btext-(?!\[var\(--md-sys-)/g,
  /\bborder-(?!\[var\(--md-sys-)/g,
  /\bshadow-(?!\[var\(--md-sys-)/g,

  // Spacing classes (allow MD3 spacing tokens)
  /\bp-(?!\[var\(--md-sys-)\d+/g,
  /\bpx-(?!\[var\(--md-sys-)\d+/g,
  /\bpy-(?!\[var\(--md-sys-)\d+/g,
  /\bm-(?!\[var\(--md-sys-)\d+/g,
  /\bmx-(?!\[var\(--md-sys-)\d+/g,
  /\bmy-(?!\[var\(--md-sys-)\d+/g,
  /\bgap-(?!\[var\(--md-sys-)\d+/g,

  // Layout classes - allow essential ones
  /\bflex-(?!shrink-0|1|auto|none|initial)\w+/g,
  /\bjustify-(?!center|start|end|between|around)\w+/g,
  /\bitems-(?!center|start|end|baseline)\w+/g,
  /\brounded-(?!full|\[var\(--md-sys-)\w+/g,

  // Legacy component classes
  /\bop-tile(?!-)/g,
  /\bop-tile-\w+/g,
  /\bm3-interactive-card/g,
  /\bglass-\w+/g,
  // Only match sys- in className contexts, not CSS variable names
  /className="[^"]*\bsys-\w+/g,
  /className='[^']*\bsys-\w+/g,
  /className={`[^`]*\bsys-\w+/g,

  // State classes (allow MD3 state tokens)
  /\bopacity-(?!\[var\(--md-sys-)\d+/g,
  /\bcursor-(?!pointer|not-allowed)\w+/g
];

/**
 * MD3 Component Requirements
 */
const MD3_REQUIREMENTS = {
  // Components that should use M3Typography
  typographyComponents: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

  // Required imports for MD3 compliance
  requiredImports: [
    'M3Typography',
    '--md-sys-color-',
    '--md-sys-spacing-',
    '--md-sys-shape-'
  ]
};

/**
 * Audit Result Interface
 */
class AuditResult {
  constructor(filePath) {
    this.filePath = filePath;
    this.issues = [];
    this.md3Compliance = {
      colors: false,
      spacing: false,
      shapes: false,
      typography: false,
      elevation: false
    };
    this.score = 0;
  }

  addIssue(severity, message, line, code) {
    this.issues.push({
      severity,
      message,
      line,
      code: code?.trim()
    });
  }

  calculateScore() {
    const totalChecks = Object.keys(this.md3Compliance).length;
    const passedChecks = Object.values(this.md3Compliance).filter(Boolean).length;
    this.score = Math.round((passedChecks / totalChecks) * 100);
  }
}

/**
 * MD3 Compliance Auditor
 */
class MD3Auditor {
  constructor() {
    this.results = [];
    this.summary = {
      totalFiles: 0,
      compliantFiles: 0,
      issues: {
        critical: 0,
        warning: 0,
        info: 0
      }
    };
  }

  /**
   * Audit a single file
   */
  auditFile(filePath) {
    const result = new AuditResult(filePath);
    this.results.push(result);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      // Check for MD3 token usage
      this.checkMD3Tokens(content, result);

      // Check for legacy CSS classes
      this.checkLegacyClasses(content, lines, result);

      // Check component structure
      this.checkComponentStructure(content, lines, result);

      // Check imports
      this.checkImports(content, result);

      result.calculateScore();

    } catch (error) {
      result.addIssue('critical', `Failed to read file: ${error.message}`, 0);
    }

    return result;
  }

  /**
   * Check MD3 design token usage
   */
  checkMD3Tokens(content, result) {
    // Check colors
    const hasColorTokens = MD3_PATTERNS.colors.some(pattern => pattern.test(content));
    result.md3Compliance.colors = hasColorTokens;

    // Check spacing
    const hasSpacingTokens = MD3_PATTERNS.spacing.some(pattern => pattern.test(content));
    result.md3Compliance.spacing = hasSpacingTokens;

    // Check shapes
    const hasShapeTokens = MD3_PATTERNS.shapes.some(pattern => pattern.test(content));
    result.md3Compliance.shapes = hasShapeTokens;

    // Check typography
    const hasTypographyTokens = MD3_PATTERNS.typography.some(pattern => pattern.test(content));
    result.md3Compliance.typography = hasTypographyTokens;

    // Check elevation
    const hasElevationTokens = MD3_PATTERNS.elevation.some(pattern => pattern.test(content));
    result.md3Compliance.elevation = hasElevationTokens;
  }

  /**
   * Check for legacy CSS classes
   */
  checkLegacyClasses(content, lines, result) {
    LEGACY_CLASSES.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const lineNumber = this.getLineNumber(content, match.index);
        const line = lines[lineNumber - 1];

        result.addIssue(
          'warning',
          `Legacy CSS class detected: ${match[0]}`,
          lineNumber,
          line
        );
      }
    });
  }

  /**
   * Check component structure compliance
   */
  checkComponentStructure(content, lines, result) {
    // Check for hardcoded text without M3Typography - but skip code patterns
    const textWithoutTypography = content.match(/>([^<>{}]+)</g);
    if (textWithoutTypography) {
      textWithoutTypography.forEach(match => {
        const text = match.slice(1, -1).trim();
        // Skip if it's code-like (contains parentheses, semicolons, brackets, etc)
        // Skip if it's very short (likely not user-facing text)
        // Only report if it looks like actual user-facing text
        const isCodeLike = /[();=\[\]{}]/.test(text) || text.includes('const ') || text.includes('function') || text.includes('=>');
        const isVeryShort = text.length < 3;
        const isUserFacingText = text.length > 15 && /[a-zA-Z]{3,}/.test(text);
        
        if (!isCodeLike && !isVeryShort && isUserFacingText && !text.includes('{') && !text.includes('}')) {
          const lineNumber = this.getLineNumber(content, content.indexOf(match));
          result.addIssue(
            'info',
            `Consider using M3Typography for text: "${text}"`,
            lineNumber,
            lines[lineNumber - 1]
          );
        }
      });
    }

    // Check for inline styles without MD3 tokens
    const inlineStyles = content.match(/style=\{[^}]*\}/g);
    if (inlineStyles) {
      inlineStyles.forEach(style => {
        if (!MD3_PATTERNS.colors.some(p => p.test(style)) &&
            !MD3_PATTERNS.spacing.some(p => p.test(style)) &&
            !MD3_PATTERNS.shapes.some(p => p.test(style))) {
          const lineNumber = this.getLineNumber(content, content.indexOf(style));
          result.addIssue(
            'info',
            'Inline style without MD3 tokens detected',
            lineNumber,
            lines[lineNumber - 1]
          );
        }
      });
    }
  }

  /**
   * Check imports for MD3 compliance
   */
  checkImports(content, result) {
    const hasM3Typography = /import.*M3Typography/.test(content);
    if (!hasM3Typography && content.includes('M3Typography')) {
      result.addIssue(
        'warning',
        'M3Typography used but not imported',
        1,
        'Missing import statement'
      );
    }
  }

  /**
   * Get line number from character index
   */
  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }

  /**
   * Audit directory recursively
   */
  auditDirectory(dirPath, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
    const files = this.getFilesRecursively(dirPath, extensions);

    files.forEach(file => {
      if (!file.includes('node_modules') && !file.includes('dist') && !file.includes('.git')) {
        this.auditFile(file);
      }
    });

    this.generateSummary();
  }

  /**
   * Get files recursively
   */
  getFilesRecursively(dirPath, extensions) {
    const files = [];

    function traverse(currentPath) {
      const items = fs.readdirSync(currentPath);

      items.forEach(item => {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      });
    }

    traverse(dirPath);
    return files;
  }

  /**
   * Generate audit summary
   */
  generateSummary() {
    this.summary.totalFiles = this.results.length;
    this.summary.compliantFiles = this.results.filter(r => r.score === 100).length;

    this.results.forEach(result => {
      result.issues.forEach(issue => {
        this.summary.issues[issue.severity]++;
      });
    });
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport() {
    const date = new Date().toLocaleDateString('it-IT');
    let report = `# MD3 Compliance Audit Report\n\n`;
    report += `**Data Generazione:** ${date}\n\n`;

    // Summary
    report += `## Riepilogo\n\n`;
    report += `- **File Totali:** ${this.summary.totalFiles}\n`;
    report += `- **File Compliant (100%):** ${this.summary.compliantFiles}\n`;
    report += `- **Tasso Compliance:** ${Math.round((this.summary.compliantFiles / this.summary.totalFiles) * 100)}%\n\n`;

    // Issues Summary
    report += `## Issues Rilevati\n\n`;
    report += `- **Critici:** ${this.summary.issues.critical}\n`;
    report += `- **Warning:** ${this.summary.issues.warning}\n`;
    report += `- **Info:** ${this.summary.issues.info}\n\n`;

    // Detailed Results
    report += `## Risultati Dettagliati\n\n`;

    this.results.forEach(result => {
      const status = result.score === 100 ? '✅' : result.score >= 70 ? '⚠️' : '❌';
      report += `### ${status} ${path.basename(result.filePath)}\n\n`;
      report += `- **Score MD3:** ${result.score}%\n`;
      report += `- **Colors:** ${result.md3Compliance.colors ? '✅' : '❌'}\n`;
      report += `- **Spacing:** ${result.md3Compliance.spacing ? '✅' : '❌'}\n`;
      report += `- **Shapes:** ${result.md3Compliance.shapes ? '✅' : '❌'}\n`;
      report += `- **Typography:** ${result.md3Compliance.typography ? '✅' : '❌'}\n`;
      report += `- **Elevation:** ${result.md3Compliance.elevation ? '✅' : '❌'}\n\n`;

      if (result.issues.length > 0) {
        report += `**Issues:**\n`;
        result.issues.forEach(issue => {
          const icon = issue.severity === 'critical' ? '🔴' :
                      issue.severity === 'warning' ? '🟡' : '🔵';
          report += `${icon} **${issue.severity.toUpperCase()}:** ${issue.message}\n`;
          if (issue.code) {
            report += `   \`${issue.code.trim()}\`\n`;
          }
        });
        report += '\n';
      }
    });

    return report;
  }

  /**
   * Save report to file
   */
  saveReport(outputPath = 'audit/md3-compliance-report.md') {
    const report = this.generateMarkdownReport();
    const dir = path.dirname(outputPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, report, 'utf8');
    console.log(`MD3 Compliance report generated: ${outputPath}`);
  }

  /**
   * Check if project passes audit (for CI/CD)
   */
  checkCompliance(threshold = 80) {
    const failedFiles = this.results.filter(r => r.score < threshold);

    if (failedFiles.length > 0) {
      console.error(`❌ MD3 Compliance failed! ${failedFiles.length} files below ${threshold}% threshold:`);
      failedFiles.forEach(file => {
        console.error(`   - ${file.filePath}: ${file.score}%`);
      });
      process.exit(1);
    } else {
      console.log(`✅ MD3 Compliance passed! All files meet ${threshold}% threshold.`);
    }
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'audit':
      const auditor = new MD3Auditor();
      const targetPath = args[1] || './src';
      console.log(`🔍 Auditing MD3 compliance in: ${targetPath}`);
      auditor.auditDirectory(targetPath);
      auditor.saveReport();
      break;

    case 'check':
      const checkAuditor = new MD3Auditor();
      const checkPath = args[1] || './src';
      const threshold = parseInt(args[2]) || 80;
      console.log(`🔍 Checking MD3 compliance in: ${checkPath} (threshold: ${threshold}%)`);
      checkAuditor.auditDirectory(checkPath);
      checkAuditor.checkCompliance(threshold);
      break;

    default:
      console.log(`
MD3 Compliance Audit Tool

Usage:
  node md3-audit.js audit [path]     - Generate full audit report
  node md3-audit.js check [path] [threshold] - Check compliance for CI/CD

Examples:
  node md3-audit.js audit ./src
  node md3-audit.js check ./src/components 90

Default path: ./src
Default threshold: 80%
      `);
  }
}

module.exports = { MD3Auditor, AuditResult };