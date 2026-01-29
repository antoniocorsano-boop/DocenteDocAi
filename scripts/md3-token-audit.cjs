#!/usr/bin/env node

/**
 * MD3 Design Token Coverage and Usage Audit
 *
 * Analyzes the codebase for MD3 token usage, coverage, and optimization opportunities.
 * Generates comprehensive reports on token utilization and semantic layer adoption.
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Configuration for token analysis
const ANALYSIS_CONFIG = {
  // File patterns to scan
  includePatterns: [
    'src/**/*.{tsx,ts,jsx,js,css,scss}',
    '!src/**/*.test.{tsx,ts,jsx,js}',
    '!src/**/*.spec.{tsx,ts,jsx,js}',
    '!src/**/*.stories.{tsx,ts,jsx,js}',
    '!src/**/*.stories.*.{tsx,ts,jsx,js}', // Exclude .stories.test.tsx etc.
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/**/archive/**',
    '!src/**/src_backup/**',
    '!src/**/migration/**',
    '!src/**/reports/**',
    '!src/**/scripts/**',
    '!src/**/stories/**',
    '!src/**/test/**',
    '!src/**/test-utils/**',
    '!src/**/nka/**',
    '!src/test-utils.tsx',
    '!src/components/ui/test-utils.tsx',
    '!node_modules/**',
    '!dist/**',
    '!build/**',
    '!storybook-static/**',
    '!coverage/**',
    '!playwright-report/**',
    '!test-results/**',
    '!.venv/**'
  ],

  // MD3 token categories
  tokenCategories: {
    spacing: {
      pattern: /--md-sys-spacing-\d+/g,
      semantic: /--app-spacing-[a-z]+/g,
      count: 0,
      used: new Set(),
      semanticUsed: new Set()
    },
    color: {
      pattern: /--md-sys-color-[a-z-]+/g,
      semantic: /--app-[a-z]+-[a-z]+/g, // This might need adjustment
      count: 0,
      used: new Set(),
      semanticUsed: new Set()
    },
    typography: {
      pattern: /--md-sys-typescale-[a-z-]+-[a-z-]+/g,
      semantic: /--app-text-[a-z]+/g,
      count: 0,
      used: new Set(),
      semanticUsed: new Set()
    },
    motion: {
      pattern: /--md-sys-motion-(duration|easing)-[a-z-]+/g,
      semantic: /--app-motion-[a-z]+|--app-easing-[a-z]+/g,
      count: 0,
      used: new Set(),
      semanticUsed: new Set()
    },
    elevation: {
      pattern: /--md-sys-elevation-level\d+/g,
      semantic: null, // No semantic elevation tokens yet
      count: 0,
      used: new Set(),
      semanticUsed: new Set()
    },
    shape: {
      pattern: /--md-sys-shape-corner-[a-z-]+/g,
      semantic: null, // No semantic shape tokens yet
      count: 0,
      used: new Set(),
      semanticUsed: new Set()
    },
    zIndex: {
      pattern: /--md-sys-z-[a-z-]+/g,
      semantic: /--app-z-[a-z]+/g,
      count: 0,
      used: new Set(),
      semanticUsed: new Set()
    },
    layout: {
      pattern: /--md-sys-(percent|margin|grid|flex|viewport)-[a-z0-9-]+/g,
      semantic: /--app-layout-[a-z]+/g,
      count: 0,
      used: new Set(),
      semanticUsed: new Set()
    }
  },

  // Files to analyze for defined tokens
  definitionFiles: [
    'src/theme.css',
    'src/design-system/semantic-tokens.css',
    'src/styles/md3-z-index.css'
  ]
};

/**
 * Extract all defined MD3 tokens from definition files
 */
function extractDefinedTokens() {
  const definedTokens = new Set();

  ANALYSIS_CONFIG.definitionFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const tokenMatches = content.match(/--md-sys-[a-z0-9-]+:/g);
      if (tokenMatches) {
        tokenMatches.forEach(match => {
          definedTokens.add(match.replace(':', ''));
        });
      }
    }
  });

  return definedTokens;
}

/**
 * Extract all defined semantic tokens
 */
function extractDefinedSemanticTokens() {
  const semanticTokens = new Set();

  const semanticFile = path.join(process.cwd(), 'src/design-system/semantic-tokens.css');
  if (fs.existsSync(semanticFile)) {
    const content = fs.readFileSync(semanticFile, 'utf8');
    const tokenMatches = content.match(/--app-[a-z0-9-]+:/g);
    if (tokenMatches) {
      tokenMatches.forEach(match => {
        semanticTokens.add(match.replace(':', ''));
      });
    }
  }

  return semanticTokens;
}

/**
 * Analyze token usage in a single file
 */
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const results = {
    file: path.relative(process.cwd(), filePath),
    tokens: new Map(),
    semanticTokens: new Map(),
    hardcodedValues: [],
    totalLines: content.split('\n').length
  };

  // Analyze each token category
  Object.entries(ANALYSIS_CONFIG.tokenCategories).forEach(([category, config]) => {
    // MD3 tokens
    if (config.pattern) {
      const matches = content.match(config.pattern);
      if (matches) {
        matches.forEach(match => {
          if (!results.tokens.has(match)) {
            results.tokens.set(match, 0);
          }
          results.tokens.set(match, results.tokens.get(match) + 1);
        });
      }
    }

    // Semantic tokens
    if (config.semantic) {
      const semanticMatches = content.match(config.semantic);
      if (semanticMatches) {
        semanticMatches.forEach(match => {
          if (!results.semanticTokens.has(match)) {
            results.semanticTokens.set(match, 0);
          }
          results.semanticTokens.set(match, results.semanticTokens.get(match) + 1);
        });
      }
    }
  });

  // Check for hardcoded values (violations)
  const hardcodedPatterns = [
    /\d+px/g, /\d+rem/g, /\d+em/g, /\d+vh/g, /\d+vw/g,
    /\d+vmin/g, /\d+vmax/g, /z-index:\s*\d+/g,
    /font-size:\s*[^v]/g, /line-height:\s*[^v]/g,
    /margin:\s*[^v]/g, /padding:\s*[^v]/g
  ];

  hardcodedPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      results.hardcodedValues.push(...matches);
    }
  });

  return results;
}

/**
 * Generate comprehensive audit report
 */
function generateAuditReport(fileResults, definedTokens, definedSemanticTokens) {
  const report = {
    summary: {
      totalFiles: fileResults.length,
      totalLines: fileResults.reduce((sum, r) => sum + r.totalLines, 0),
      totalTokens: 0,
      totalSemanticTokens: 0,
      hardcodedViolations: 0,
      coverage: {}
    },
    categories: {},
    overusedTokens: [],
    underusedTokens: [],
    missingSemanticTokens: [],
    recommendations: []
  };

  // Aggregate results by category
  const categoryStats = {};

  fileResults.forEach(fileResult => {
    // Count total tokens and semantic tokens
    report.summary.totalTokens += fileResult.tokens.size;
    report.summary.totalSemanticTokens += fileResult.semanticTokens.size;
    report.summary.hardcodedViolations += fileResult.hardcodedValues.length;

    // Aggregate by category
    Object.entries(ANALYSIS_CONFIG.tokenCategories).forEach(([category, config]) => {
      if (!categoryStats[category]) {
        categoryStats[category] = {
          md3Used: new Set(),
          semanticUsed: new Set(),
          totalUsage: 0,
          semanticUsage: 0
        };
      }

      // MD3 tokens
      fileResult.tokens.forEach((count, token) => {
        if (config.pattern && config.pattern.test(token)) {
          categoryStats[category].md3Used.add(token);
          categoryStats[category].totalUsage += count;
        }
      });

      // Semantic tokens
      fileResult.semanticTokens.forEach((count, token) => {
        if (config.semantic && config.semantic.test(token)) {
          categoryStats[category].semanticUsed.add(token);
          categoryStats[category].semanticUsage += count;
        }
      });
    });
  });

  // Calculate coverage and generate insights
  Object.entries(categoryStats).forEach(([category, stats]) => {
    const md3Count = stats.md3Used.size;
    const semanticCount = stats.semanticUsed.size;
    const totalUsage = stats.totalUsage;
    const semanticUsage = stats.semanticUsage;

    report.categories[category] = {
      md3TokensUsed: md3Count,
      semanticTokensUsed: semanticCount,
      totalUsage,
      semanticUsage,
      semanticAdoption: totalUsage > 0 ? (semanticUsage / (totalUsage + semanticUsage)) * 100 : 0,
      mostUsedMd3: Array.from(stats.md3Used).slice(0, 5),
      mostUsedSemantic: Array.from(stats.semanticUsed).slice(0, 5)
    };

    // Identify overused tokens (used in >50% of files)
    if (md3Count > fileResults.length * 0.5) {
      report.overusedTokens.push({
        category,
        token: Array.from(stats.md3Used)[0], // Most used
        usageCount: totalUsage,
        fileCoverage: (md3Count / fileResults.length) * 100
      });
    }
  });

  // Identify unused defined tokens
  const usedTokens = new Set();
  fileResults.forEach(result => {
    result.tokens.forEach((count, token) => usedTokens.add(token));
    result.semanticTokens.forEach((count, token) => usedTokens.add(token));
  });

  report.summary.unusedDefinedTokens = Array.from(definedTokens).filter(token => !usedTokens.has(token));
  report.summary.unusedSemanticTokens = Array.from(definedSemanticTokens).filter(token => !usedTokens.has(token));

  // Generate recommendations
  report.recommendations = generateRecommendations(report, categoryStats);

  return report;
}

/**
 * Generate optimization recommendations
 */
function generateRecommendations(report, categoryStats) {
  const recommendations = [];

  // Semantic adoption recommendations
  Object.entries(report.categories).forEach(([category, stats]) => {
    if (stats.semanticAdoption < 50) {
      recommendations.push({
        priority: stats.totalUsage > 100 ? 'HIGH' : 'MEDIUM',
        category: 'SEMANTIC_ADOPTION',
        title: `Increase semantic token adoption in ${category}`,
        description: `Only ${stats.semanticAdoption.toFixed(1)}% of ${category} usage uses semantic tokens`,
        impact: `${stats.totalUsage - stats.semanticUsage} direct MD3 tokens could be abstracted`,
        effort: 'MEDIUM'
      });
    }
  });

  // Overused token recommendations
  report.overusedTokens.forEach(overused => {
    recommendations.push({
      priority: overused.usageCount > 200 ? 'HIGH' : 'MEDIUM',
      category: 'TOKEN_CONSOLIDATION',
      title: `Consider semantic abstraction for overused ${overused.category} token`,
      description: `${overused.token} used in ${overused.fileCoverage.toFixed(1)}% of files`,
      impact: `Could reduce direct token references by ${overused.usageCount} instances`,
      effort: 'LOW'
    });
  });

  // Missing semantic tokens
  const missingCategories = ['elevation', 'shape'];
  missingCategories.forEach(category => {
    if (report.categories[category] && report.categories[category].semanticTokensUsed === 0) {
      recommendations.push({
        priority: 'LOW',
        category: 'SEMANTIC_EXPANSION',
        title: `Consider adding semantic tokens for ${category}`,
        description: `No semantic ${category} tokens defined, all usage is direct MD3`,
        impact: `Could improve consistency for ${report.categories[category].totalUsage} usages`,
        effort: 'MEDIUM'
      });
    }
  });

  // Hardcoded value violations
  if (report.summary.hardcodedViolations > 0) {
    recommendations.push({
      priority: 'CRITICAL',
      category: 'MD3_COMPLIANCE',
      title: 'Address hardcoded value violations',
      description: `${report.summary.hardcodedViolations} hardcoded values found (px, rem, z-index, etc.)`,
      impact: 'Critical MD3 Gold compliance violations',
      effort: 'HIGH'
    });
  }

  // Sort by priority
  const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
}

/**
 * Generate human-readable report
 */
function generateHumanReport(auditReport) {
  const report = [];

  report.push('# MD3 Design Token Coverage and Usage Audit');
  report.push('');
  report.push('**Generated:** ' + new Date().toISOString());
  report.push('**MD3 Gold Compliance:** Analysis Only (No Changes Made)');
  report.push('');

  // Summary
  report.push('## 📊 Summary');
  report.push('');
  report.push(`- **Files Analyzed:** ${auditReport.summary.totalFiles}`);
  report.push(`- **Lines of Code:** ${auditReport.summary.totalLines.toLocaleString()}`);
  report.push(`- **MD3 Tokens Used:** ${auditReport.summary.totalTokens}`);
  report.push(`- **Semantic Tokens Used:** ${auditReport.summary.totalSemanticTokens}`);
  report.push(`- **Hardcoded Violations:** ${auditReport.summary.hardcodedViolations}`);
  report.push(`- **Semantic Adoption Rate:** ${((auditReport.summary.totalSemanticTokens / (auditReport.summary.totalTokens + auditReport.summary.totalSemanticTokens)) * 100).toFixed(1)}%`);
  report.push('');

  // Category breakdown
  report.push('## 📈 Token Usage by Category');
  report.push('');
  report.push('| Category | MD3 Used | Semantic Used | Total Usage | Semantic % |');
  report.push('|----------|----------|---------------|-------------|------------|');

  Object.entries(auditReport.categories).forEach(([category, stats]) => {
    report.push(`| ${category} | ${stats.md3TokensUsed} | ${stats.semanticTokensUsed} | ${stats.totalUsage + stats.semanticUsage} | ${stats.semanticAdoption.toFixed(1)}% |`);
  });
  report.push('');

  // Overused tokens
  if (auditReport.overusedTokens.length > 0) {
    report.push('## 🎯 Overused Tokens');
    report.push('');
    auditReport.overusedTokens.forEach(token => {
      report.push(`- **${token.token}** (${token.category}): Used in ${token.fileCoverage.toFixed(1)}% of files (${token.usageCount} total usages)`);
    });
    report.push('');
  }

  // Unused tokens
  if (auditReport.summary.unusedDefinedTokens.length > 0) {
    report.push('## 📦 Unused Defined Tokens');
    report.push('');
    auditReport.summary.unusedDefinedTokens.forEach(token => {
      report.push(`- \`${token}\``);
    });
    report.push('');
  }

  // Recommendations
  report.push('## 💡 Recommendations');
  report.push('');
  auditReport.recommendations.forEach((rec, index) => {
    report.push(`### ${index + 1}. ${rec.title} [${rec.priority}]`);
    report.push(`**Category:** ${rec.category}`);
    report.push(`**Description:** ${rec.description}`);
    report.push(`**Impact:** ${rec.impact}`);
    report.push(`**Effort:** ${rec.effort}`);
    report.push('');
  });

  return report.join('\n');
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Starting MD3 Design Token Audit...');

  try {
    // Extract defined tokens
    console.log('📋 Extracting defined tokens...');
    const definedTokens = extractDefinedTokens();
    const definedSemanticTokens = extractDefinedSemanticTokens();

    console.log(`Found ${definedTokens.size} defined MD3 tokens`);
    console.log(`Found ${definedSemanticTokens.size} defined semantic tokens`);

    // Find files to analyze
    console.log('🔍 Scanning codebase...');
    const files = await glob(ANALYSIS_CONFIG.includePatterns, { cwd: process.cwd() });
    console.log(`Found ${files.length} files to analyze`);
    
    // Log first 10 files for verification
    console.log('Sample files being analyzed:');
    files.slice(0, 10).forEach(file => console.log(`  - ${file}`));
    if (files.length > 10) console.log(`  ... and ${files.length - 10} more`);

    // Analyze each file
    console.log('📊 Analyzing token usage...');
    const fileResults = [];
    for (const file of files) {
      try {
        const result = analyzeFile(file);
        fileResults.push(result);
      } catch (error) {
        console.warn(`Warning: Could not analyze ${file}:`, error.message);
      }
    }

    // Generate audit report
    console.log('📈 Generating audit report...');
    const auditReport = generateAuditReport(fileResults, definedTokens, definedSemanticTokens);

    // Generate human-readable report
    const humanReport = generateHumanReport(auditReport);

    // Write reports
    const auditPath = path.join(process.cwd(), 'md3-token-audit.json');
    const reportPath = path.join(process.cwd(), 'MD3_TOKEN_AUDIT_REPORT.md');

    fs.writeFileSync(auditPath, JSON.stringify(auditReport, null, 2));
    fs.writeFileSync(reportPath, humanReport);

    console.log('✅ Audit complete!');
    console.log(`📄 JSON Report: ${auditPath}`);
    console.log(`📖 Markdown Report: ${reportPath}`);

    // Print key metrics
    console.log('\n📊 Key Metrics:');
    console.log(`Total MD3 tokens used: ${auditReport.summary.totalTokens}`);
    console.log(`Total semantic tokens used: ${auditReport.summary.totalSemanticTokens}`);
    console.log(`Semantic adoption rate: ${((auditReport.summary.totalSemanticTokens / (auditReport.summary.totalTokens + auditReport.summary.totalSemanticTokens)) * 100).toFixed(1)}%`);
    console.log(`Hardcoded violations: ${auditReport.summary.hardcodedViolations}`);
    console.log(`Recommendations: ${auditReport.recommendations.length}`);

  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  extractDefinedTokens,
  extractDefinedSemanticTokens,
  analyzeFile,
  generateAuditReport,
  generateHumanReport
};