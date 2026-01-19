const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * MD3 Compliance Scanner
 * Scans the codebase for MD3 violations and generates compliance reports
 */

class MD3ComplianceScanner {
    constructor() {
        this.results = {
            compliance: 0,
            totalComponents: 0,
            compliantComponents: 0,
            violations: {
                className: 0,
                tailwind: 0,
                hardcoded: 0,
                useTheme: 0,
                legacyStyles: 0
            },
            components: [],
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Scan all TSX/TS files in src directory or specific files
     */
    scan(fileListPath = null) {
        console.log('🔍 Starting MD3 Compliance Scan...');

        let files = [];

        if (fileListPath) {
            // Read file list from provided path
            if (fs.existsSync(fileListPath)) {
                const fileContent = fs.readFileSync(fileListPath, 'utf8');
                files = fileContent.split('\n')
                    .map(line => line.trim())
                    .filter(line => line && (line.endsWith('.tsx') || line.endsWith('.ts') || line.endsWith('.jsx') || line.endsWith('.js')))
                    .map(file => path.resolve(__dirname, file));
            } else {
                console.error(`❌ File list not found: ${fileListPath}`);
                return;
            }
        } else {
            // Default behavior: scan all files in src
            const srcDir = path.join(__dirname, 'src');
            files = this.findTsxFiles(srcDir);
        }

        this.results.totalComponents = files.length;

        for (const file of files) {
            const componentResult = this.scanComponent(file);
            this.results.components.push(componentResult);

            if (componentResult.compliant) {
                this.results.compliantComponents++;
            }

            // Aggregate violations
            Object.keys(componentResult.violations).forEach(violation => {
                this.results.violations[violation] += componentResult.violations[violation];
            });
        }

        // Calculate compliance percentage
        this.results.compliance = this.results.totalComponents > 0
            ? Math.round((this.results.compliantComponents / this.results.totalComponents) * 100 * 10) / 10
            : 0;

        console.log(`✅ Scan completed: ${this.results.compliance}% MD3 compliant`);
        return this.results;
    }

    /**
     * Find all .tsx and .ts files recursively
     */
    findTsxFiles(dir) {
        const files = [];

        function traverse(currentDir) {
            const items = fs.readdirSync(currentDir);

            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    traverse(fullPath);
                } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
                    files.push(fullPath);
                }
            }
        }

        traverse(dir);
        return files;
    }

    /**
     * Scan a single component for MD3 violations
     */
    scanComponent(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const componentName = path.basename(filePath, path.extname(filePath));

        const violations = {
            className: 0,
            tailwind: 0,
            hardcoded: 0,
            useTheme: 0,
            legacyStyles: 0
        };

        // Scan for className usage
        const classNameMatches = content.match(/className\s*=\s*["'`][^"'`]*["'`]/g);
        if (classNameMatches) {
            violations.className = classNameMatches.length;
        }

        // Scan for Tailwind classes (common patterns)
        const tailwindPatterns = [
            /\b(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml)-\d+\b/g,
            /\b(bg|text|border)-\w+/g,
            /\b(rounded|shadow|flex|grid|items|justify)-\w*/g,
            /\b(w|h)-\d+|full|screen\b/g,
            /\bduration-\d+|delay-\d+|ease-\w+\b/g
        ];

        tailwindPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                violations.tailwind += matches.length;
            }
        });

        // Scan for hardcoded values
        const hardcodedPatterns = [
            /\b\d+px\b/g,  // px values
            /\b\d+rem\b/g, // rem values
            /\b\d+%\b/g,   // percentage values
            /#[0-9a-fA-F]{3,8}\b/g, // hex colors
            /rgb\([^)]+\)/g, // rgb colors
            /rgba\([^)]+\)/g // rgba colors
        ];

        hardcodedPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                violations.hardcoded += matches.length;
            }
        });

        // Scan for useTheme imports
        if (content.includes('useTheme')) {
            violations.useTheme++;
        }

        // Scan for legacy style patterns
        const legacyPatterns = [
            /style\s*=\s*\{[^}]*[^}]*\}/g, // style without proper MD3 tokens
        ];

        legacyPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                // Check if they contain MD3 tokens
                const md3Tokens = matches.filter(match =>
                    match.includes('var(--md-sys-') ||
                    match.includes('var(--md-ref-')
                );
                violations.legacyStyles += (matches.length - md3Tokens.length);
            }
        });

        // Determine if component is compliant
        const totalViolations = Object.values(violations).reduce((sum, count) => sum + count, 0);
        const compliant = totalViolations === 0;

        return {
            name: componentName,
            path: path.relative(process.cwd(), filePath),
            compliant,
            violations,
            totalViolations
        };
    }

    /**
     * Generate JSON report
     */
    generateReport(outputPath = 'md3-compliance-report.json') {
        const reportPath = path.join(__dirname, outputPath);
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`📊 Report generated: ${reportPath}`);
        return reportPath;
    }

    /**
     * Generate human-readable summary
     */
    generateSummary() {
        const { compliance, totalComponents, compliantComponents, violations } = this.results;

        console.log('\n📊 MD3 Compliance Summary');
        console.log('='.repeat(50));
        console.log(`Compliance Level: ${compliance}%`);
        console.log(`Components: ${compliantComponents}/${totalComponents} compliant`);
        console.log('\n🚫 Violations:');
        console.log(`  className: ${violations.className}`);
        console.log(`  Tailwind: ${violations.tailwind}`);
        console.log(`  Hardcoded: ${violations.hardcoded}`);
        console.log(`  useTheme: ${violations.useTheme}`);
        console.log(`  Legacy Styles: ${violations.legacyStyles}`);

        if (compliance < 100) {
            console.log('\n🎯 Next Steps:');
            console.log('  Run migration scripts to fix violations');
            console.log('  Focus on high-impact components first');
        } else {
            console.log('\n🎉 Full MD3 Compliance Achieved!');
        }
    }

    /**
     * Check if violations exceed threshold (for CI/CD)
     */
    checkThreshold(maxViolations = 0) {
        const totalViolations = Object.values(this.results.violations)
            .reduce((sum, count) => sum + count, 0);

        if (totalViolations > maxViolations) {
            console.error(`❌ MD3 violations exceed threshold: ${totalViolations} > ${maxViolations}`);
            process.exit(1);
        } else {
            console.log(`✅ MD3 compliance check passed: ${totalViolations} violations`);
        }
    }
}

// CLI interface
if (require.main === module) {
    const scanner = new MD3ComplianceScanner();

    // Parse command line arguments
    const args = process.argv.slice(2);
    const failOnViolations = args.includes('--fail-on-violations');

    // Check for --files option
    let fileListPath = null;
    const filesIndex = args.indexOf('--files');
    if (filesIndex !== -1 && filesIndex + 1 < args.length) {
        fileListPath = args[filesIndex + 1];
    }

    scanner.scan(fileListPath);
    scanner.generateReport();
    scanner.generateSummary();

    if (failOnViolations) {
        scanner.checkThreshold(0);
    }
}

module.exports = MD3ComplianceScanner;