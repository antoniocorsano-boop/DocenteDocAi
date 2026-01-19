const fs = require('fs');
const path = require('path');

/**
 * MD3 Migration Engine
 * Automated conversion of className and Tailwind classes to MD3 native styles
 */

class MD3MigrationEngine {
    constructor() {
        // Token mapping for common conversions
        this.tokenMap = {
            // Spacing
            'p-0': 'padding: \'var(--md-sys-spacing-0)\'',
            'p-1': 'padding: \'var(--md-sys-spacing-1)\'',
            'p-2': 'padding: \'var(--md-sys-spacing-2)\'',
            'p-3': 'padding: \'var(--md-sys-spacing-3)\'',
            'p-4': 'padding: \'var(--md-sys-spacing-4)\'',
            'p-5': 'padding: \'var(--md-sys-spacing-5)\'',
            'p-6': 'padding: \'var(--md-sys-spacing-6)\'',
            'p-8': 'padding: \'var(--md-sys-spacing-8)\'',
            'p-10': 'padding: \'var(--md-sys-spacing-10)\'',
            'p-12': 'padding: \'var(--md-sys-spacing-12)\'',

            // Colors
            'bg-primary': 'backgroundColor: \'var(--md-sys-color-primary)\'',
            'bg-primary-container': 'backgroundColor: \'var(--md-sys-color-primary-container)\'',
            'bg-secondary': 'backgroundColor: \'var(--md-sys-color-secondary)\'',
            'bg-secondary-container': 'backgroundColor: \'var(--md-sys-color-secondary-container)\'',
            'bg-tertiary': 'backgroundColor: \'var(--md-sys-color-tertiary)\'',
            'bg-tertiary-container': 'backgroundColor: \'var(--md-sys-color-tertiary-container)\'',
            'bg-surface': 'backgroundColor: \'var(--md-sys-color-surface)\'',
            'bg-surface-container': 'backgroundColor: \'var(--md-sys-color-surface-container)\'',
            'bg-error': 'backgroundColor: \'var(--md-sys-color-error)\'',
            'bg-error-container': 'backgroundColor: \'var(--md-sys-color-error-container)\'',
            'text-primary': 'color: \'var(--md-sys-color-primary)\'',
            'text-on-primary': 'color: \'var(--md-sys-color-on-primary)\'',
            'text-secondary': 'color: \'var(--md-sys-color-secondary)\'',
            'text-on-secondary': 'color: \'var(--md-sys-color-on-secondary)\'',
            'text-tertiary': 'color: \'var(--md-sys-color-tertiary)\'',
            'text-on-tertiary': 'color: \'var(--md-sys-color-on-tertiary)\'',
            'text-surface': 'color: \'var(--md-sys-color-surface)\'',
            'text-on-surface': 'color: \'var(--md-sys-color-on-surface)\'',
            'text-error': 'color: \'var(--md-sys-color-error)\'',
            'text-on-error': 'color: \'var(--md-sys-color-on-error)\'',

            // Border radius
            'rounded': 'borderRadius: \'var(--md-sys-shape-corner-medium)\'',
            'rounded-sm': 'borderRadius: \'var(--md-sys-shape-corner-small)\'',
            'rounded-md': 'borderRadius: \'var(--md-sys-shape-corner-medium)\'',
            'rounded-lg': 'borderRadius: \'var(--md-sys-shape-corner-large)\'',
            'rounded-xl': 'borderRadius: \'var(--md-sys-shape-corner-extra-large)\'',
            'rounded-full': 'borderRadius: \'var(--md-sys-shape-corner-full)\'',

            // Shadows/Elevation
            'shadow': 'boxShadow: \'var(--md-sys-elevation-level1)\'',
            'shadow-md': 'boxShadow: \'var(--md-sys-elevation-level2)\'',
            'shadow-lg': 'boxShadow: \'var(--md-sys-elevation-level3)\'',
            'shadow-xl': 'boxShadow: \'var(--md-sys-elevation-level4)\'',
            'shadow-2xl': 'boxShadow: \'var(--md-sys-elevation-level5)\'',

            // Typography (basic mapping)
            'text-xs': 'fontSize: \'var(--md-sys-typescale-body-small-font-size)\', fontWeight: \'var(--md-sys-typescale-body-small-font-weight)\'',
            'text-sm': 'fontSize: \'var(--md-sys-typescale-body-medium-font-size)\', fontWeight: \'var(--md-sys-typescale-body-medium-font-weight)\'',
            'text-base': 'fontSize: \'var(--md-sys-typescale-body-large-font-size)\', fontWeight: \'var(--md-sys-typescale-body-large-font-weight)\'',
            'text-lg': 'fontSize: \'var(--md-sys-typescale-headline-small-font-size)\', fontWeight: \'var(--md-sys-typescale-headline-small-font-weight)\'',
            'text-xl': 'fontSize: \'var(--md-sys-typescale-headline-medium-font-size)\', fontWeight: \'var(--md-sys-typescale-headline-medium-font-weight)\'',
            'text-2xl': 'fontSize: \'var(--md-sys-typescale-headline-large-font-size)\', fontWeight: \'var(--md-sys-typescale-headline-large-font-weight)\'',
            'font-bold': 'fontWeight: \'var(--md-sys-typescale-body-large-font-weight-bold)\'',
            'font-semibold': 'fontWeight: \'var(--md-sys-typescale-body-large-font-weight-semibold)\'',
            'font-medium': 'fontWeight: \'var(--md-sys-typescale-body-large-font-weight-medium)\''
        };

        this.migrationStats = {
            processed: 0,
            migrated: 0,
            errors: 0,
            skipped: 0
        };
    }

    /**
     * Migrate a single component
     */
    migrateComponent(componentPath, options = {}) {
        const {
            dryRun = false,
            complexity = 'simple',
            backup = true
        } = options;

        console.log(`🔄 Migrating ${componentPath} (complexity: ${complexity})`);

        try {
            let content = fs.readFileSync(componentPath, 'utf8');

            // Create backup
            if (backup && !dryRun) {
                const backupPath = `${componentPath}.backup`;
                fs.writeFileSync(backupPath, content);
                console.log(`💾 Backup created: ${backupPath}`);
            }

            // Apply migrations based on complexity
            const originalContent = content;

            if (complexity === 'simple') {
                content = this.migrateSimple(content);
            } else if (complexity === 'medium') {
                content = this.migrateSimple(content);
                content = this.migrateMedium(content);
            } else if (complexity === 'complex') {
                content = this.migrateSimple(content);
                content = this.migrateMedium(content);
                content = this.migrateComplex(content);
            }

            // Write changes
            if (!dryRun && content !== originalContent) {
                fs.writeFileSync(componentPath, content);
                console.log(`✅ Migration completed for ${componentPath}`);
                this.migrationStats.migrated++;
            } else if (dryRun) {
                console.log(`🔍 Dry run completed for ${componentPath}`);
            }

            this.migrationStats.processed++;

        } catch (error) {
            console.error(`❌ Error migrating ${componentPath}:`, error.message);
            this.migrationStats.errors++;
        }
    }

    /**
     * Simple migrations: Basic className → style conversions
     */
    migrateSimple(content) {
        let migratedContent = content;

        // Convert simple className attributes to style objects
        migratedContent = migratedContent.replace(
            /className\s*=\s*["'`]([^"'`]*)["'`]/g,
            (match, classNames) => {
                const styles = this.convertClassNamesToStyles(classNames);
                if (styles.length > 0) {
                    return `style={{${styles.join(', ')}}}`;
                }
                return match; // Keep original if no conversion possible
            }
        );

        return migratedContent;
    }

    /**
     * Medium migrations: Conditional classes and complex patterns
     */
    migrateMedium(content) {
        let migratedContent = content;

        // Handle conditional className patterns
        migratedContent = migratedContent.replace(
            /className\s*=\s*\{\s*`([^`]*)`\s*\}/g,
            (match, template) => {
                // Convert template literals to style objects
                const styles = this.convertTemplateToStyles(template);
                if (styles.length > 0) {
                    return `style={{${styles.join(', ')}}}`;
                }
                return match;
            }
        );

        // Handle ternary className patterns
        migratedContent = migratedContent.replace(
            /className\s*=\s*\{([^}]*)\?\s*["'`]([^"'`]*)["'`]\s*:\s*["'`]([^"'`]*)["'`]\s*\}/g,
            (match, condition, trueClasses, falseClasses) => {
                const trueStyles = this.convertClassNamesToStyles(trueClasses);
                const falseStyles = this.convertClassNamesToStyles(falseClasses);

                if (trueStyles.length > 0 || falseStyles.length > 0) {
                    const trueStyleObj = trueStyles.length > 0 ? `{${trueStyles.join(', ')}}` : '{}';
                    const falseStyleObj = falseStyles.length > 0 ? `{${falseStyles.join(', ')}}` : '{}';
                    return `style={${condition} ? ${trueStyleObj} : ${falseStyleObj}}`;
                }
                return match;
            }
        );

        return migratedContent;
    }

    /**
     * Complex migrations: Custom classes and advanced patterns
     */
    migrateComplex(content) {
        let migratedContent = content;

        // Remove useTheme imports and usage
        migratedContent = migratedContent.replace(
            /import\s*\{\s*useTheme[^}]*\}\s*from\s*["'`][^"'`]*["'`];?\s*/g,
            ''
        );

        migratedContent = migratedContent.replace(
            /const\s*theme\s*=\s*useTheme\(\);?\s*/g,
            ''
        );

        // Convert theme references to MD3 tokens
        migratedContent = migratedContent.replace(
            /theme\.\w+\.\w+/g,
            (match) => {
                // This would need more sophisticated mapping
                console.log(`⚠️  Complex theme reference found: ${match}`);
                return match; // Keep for manual review
            }
        );

        return migratedContent;
    }

    /**
     * Convert className string to style object properties
     */
    convertClassNamesToStyles(classNames) {
        const classes = classNames.trim().split(/\s+/);
        const styles = [];

        for (const cls of classes) {
            if (this.tokenMap[cls]) {
                styles.push(this.tokenMap[cls]);
            } else {
                console.log(`⚠️  Unmapped class: ${cls}`);
            }
        }

        return styles;
    }

    /**
     * Convert template literal className to styles
     */
    convertTemplateToStyles(template) {
        // This is a simplified version - complex templates need manual review
        const classes = template.split(/\s+/).filter(cls => cls.trim());
        const styles = [];

        for (const cls of classes) {
            if (cls.startsWith('${') && cls.endsWith('}')) {
                // Dynamic class - keep for manual review
                console.log(`⚠️  Dynamic class found: ${cls}`);
                continue;
            }

            if (this.tokenMap[cls]) {
                styles.push(this.tokenMap[cls]);
            }
        }

        return styles;
    }

    /**
     * Batch migrate components by complexity level
     */
    migrateBatch(complexity = 'simple', batchSize = 5) {
        const MD3ComplianceScanner = require('./md3-compliance-scanner.cjs');
        const scanner = new MD3ComplianceScanner();
        const results = scanner.scan();

        // Filter components by complexity and violations
        const candidates = results.components.filter(comp => {
            if (complexity === 'simple') {
                return comp.violations.className > 0 && comp.violations.tailwind <= 5;
            } else if (complexity === 'medium') {
                return comp.violations.className > 0 && comp.violations.tailwind <= 15;
            } else {
                return comp.violations.className > 0;
            }
        });

        console.log(`📋 Found ${candidates.length} components for ${complexity} migration`);

        // Process in batches
        for (let i = 0; i < candidates.length; i += batchSize) {
            const batch = candidates.slice(i, i + batchSize);
            console.log(`\n🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(candidates.length/batchSize)}`);

            for (const component of batch) {
                const fullPath = path.join(process.cwd(), component.path);
                this.migrateComponent(fullPath, { complexity, dryRun: false });
            }

            // Validation after each batch
            console.log('🔍 Running validation...');
            try {
                require('child_process').execSync('npm run build', { stdio: 'inherit' });
                console.log('✅ Batch validation passed');
            } catch (error) {
                console.log('❌ Batch validation failed - stopping migration');
                break;
            }
        }

        this.printMigrationSummary();
    }

    /**
     * Print migration statistics
     */
    printMigrationSummary() {
        console.log('\n📊 Migration Summary');
        console.log('='.repeat(30));
        console.log(`Processed: ${this.migrationStats.processed}`);
        console.log(`Migrated: ${this.migrationStats.migrated}`);
        console.log(`Errors: ${this.migrationStats.errors}`);
        console.log(`Skipped: ${this.migrationStats.skipped}`);
    }
}

// CLI interface
if (require.main === module) {
    const engine = new MD3MigrationEngine();
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage:');
        console.log('  node md3-migration-engine.cjs --component <path> --complexity <level>');
        console.log('  node md3-migration-engine.cjs --batch --complexity <level> --size <number>');
        process.exit(1);
    }

    const componentIndex = args.indexOf('--component');
    const batchIndex = args.indexOf('--batch');
    const complexityIndex = args.indexOf('--complexity');
    const sizeIndex = args.indexOf('--size');

    if (componentIndex !== -1 && complexityIndex !== -1) {
        const componentPath = args[componentIndex + 1];
        const complexity = args[complexityIndex + 1] || 'simple';
        engine.migrateComponent(componentPath, { complexity });
    } else if (batchIndex !== -1) {
        const complexity = args[complexityIndex + 1] || 'simple';
        const batchSize = sizeIndex !== -1 ? parseInt(args[sizeIndex + 1]) : 5;
        engine.migrateBatch(complexity, batchSize);
    } else {
        console.log('Invalid arguments');
        process.exit(1);
    }
}

module.exports = MD3MigrationEngine;