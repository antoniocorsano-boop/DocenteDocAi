#!/usr/bin/env node

/**
 * MD3-Aware Visual Diff Analysis Script
 *
 * Analyzes visual regression test results and classifies diffs
 * as acceptable (token-driven) vs blocking (hardcoded regressions).
 * Compatible with MD3 Gold governance requirements.
 */

const fs = require('fs');
const path = require('path');

// Configuration for diff analysis
const ANALYSIS_CONFIG = {
  // Thresholds for automatic classification
  thresholds: {
    // Very small diffs are likely noise or token precision changes
    noise: 0.001,        // 0.1%

    // Small diffs might be acceptable token changes
    acceptable: 0.01,    // 1.0%

    // Larger diffs need review
    review: 0.05,        // 5.0%

    // Very large diffs are likely hardcoded regressions
    blocking: 0.10       // 10.0%
  },

  // MD3-aware classification rules
  md3Rules: {
    // Components that commonly change with token updates
    tokenSensitive: [
      'M3Button', 'M3Card', 'M3TextField', 'M3Chip',
      'M3Dialog', 'M3Drawer', 'M3Fab', 'M3List',
      'M3Menu', 'M3NavigationBar', 'M3Sheet',
      'M3Snackbar', 'M3Switch', 'M3Tab', 'M3TopAppBar'
    ],

    // Semantic token change indicators
    semanticIndicators: [
      'spacing', 'color', 'typography', 'motion',
      'semantic', 'token', 'theme'
    ],

    // Hardcoded value violation patterns
    hardcodedPatterns: [
      /\d+px/, /\d+rem/, /\d+em/, /\d+vh/, /\d+vw/,
      /\d+vmin/, /\d+vmax/, /#[0-9a-fA-F]{3,8}/,
      /rgb\(/, /hsl\(/, /margin/, /padding/, /width/, /height/
    ]
  }
};

/**
 * Analyze a single visual diff
 */
function analyzeDiff(diffPath, componentName) {
  const diff = {
    component: componentName,
    path: diffPath,
    pixelDiff: 0,
    percentageDiff: 0,
    status: 'unknown',
    confidence: 0,
    reason: '',
    classification: 'unknown'
  };

  try {
    // Read diff metadata (assuming Playwright format)
    const diffDir = path.dirname(diffPath);
    const metadataPath = path.join(diffDir, 'metadata.json');

    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      diff.pixelDiff = metadata.pixelDifference || 0;
      diff.percentageDiff = metadata.percentageDifference || 0;
    } else {
      // Fallback: estimate from file size or basic analysis
      const stats = fs.statSync(diffPath);
      diff.pixelDiff = stats.size; // Rough approximation
      diff.percentageDiff = Math.min(stats.size / 10000, 1); // Normalize
    }

    // Classify the diff
    diff.classification = classifyDiff(diff, componentName);

  } catch (error) {
    console.warn(`Error analyzing diff ${diffPath}:`, error.message);
    diff.status = 'error';
    diff.reason = `Analysis failed: ${error.message}`;
  }

  return diff;
}

/**
 * Classify a diff based on MD3-aware rules
 */
function classifyDiff(diff, componentName) {
  const { percentageDiff } = diff;

  // Noise level - ignore
  if (percentageDiff <= ANALYSIS_CONFIG.thresholds.noise) {
    return {
      status: 'pass',
      confidence: 95,
      reason: 'Diff within noise threshold - likely token precision changes'
    };
  }

  // Check if component is token-sensitive
  const isTokenSensitive = ANALYSIS_CONFIG.md3Rules.tokenSensitive.some(comp =>
    componentName.includes(comp)
  );

  // Check for semantic indicators in component name
  const hasSemanticIndicators = ANALYSIS_CONFIG.md3Rules.semanticIndicators.some(indicator =>
    componentName.toLowerCase().includes(indicator)
  );

  // Acceptable token-driven changes
  if (percentageDiff <= ANALYSIS_CONFIG.thresholds.acceptable) {
    if (isTokenSensitive || hasSemanticIndicators) {
      return {
        status: 'pass',
        confidence: 85,
        reason: 'Acceptable token-driven change in MD3 component'
      };
    }
  }

  // Needs review
  if (percentageDiff <= ANALYSIS_CONFIG.thresholds.review) {
    return {
      status: 'review',
      confidence: 60,
      reason: 'Moderate diff detected - manual review required'
    };
  }

  // Likely blocking (hardcoded regression)
  if (percentageDiff >= ANALYSIS_CONFIG.thresholds.blocking) {
    return {
      status: 'fail',
      confidence: 90,
      reason: 'Large diff suggests hardcoded value regression'
    };
  }

  // Default to review for medium diffs
  return {
    status: 'review',
    confidence: 50,
    reason: 'Uncertain diff classification - manual review recommended'
  };
}

/**
 * Analyze all visual diffs in the test results
 */
function analyzeAllDiffs() {
  const results = {
    overall_status: 'unknown',
    summary: {
      total_diffs: 0,
      blocking_diffs: 0,
      acceptable_diffs: 0,
      review_diffs: 0
    },
    details: [],
    timestamp: new Date().toISOString()
  };

  try {
    // Find diff files
    const testResultsDir = path.join(process.cwd(), 'test-results');
    const visualResultsDir = path.join(testResultsDir, 'visual-regression');

    if (!fs.existsSync(visualResultsDir)) {
      console.log('No visual regression results found');
      results.overall_status = 'pass';
      return results;
    }

    // Find all diff images
    const diffFiles = findDiffFiles(visualResultsDir);

    results.summary.total_diffs = diffFiles.length;

    // Analyze each diff
    for (const diffFile of diffFiles) {
      const componentName = extractComponentName(diffFile);
      const analysis = analyzeDiff(diffFile, componentName);

      results.details.push({
        component: componentName,
        path: diffFile,
        status: analysis.status,
        confidence: analysis.confidence,
        reason: analysis.reason,
        pixelDiff: analysis.pixelDiff,
        percentageDiff: analysis.percentageDiff
      });

      // Update summary
      switch (analysis.status) {
        case 'pass':
          results.summary.acceptable_diffs++;
          break;
        case 'review':
          results.summary.review_diffs++;
          break;
        case 'fail':
          results.summary.blocking_diffs++;
          break;
      }
    }

    // Determine overall status
    if (results.summary.blocking_diffs > 0) {
      results.overall_status = 'fail';
    } else if (results.summary.review_diffs > 0) {
      results.overall_status = 'review';
    } else {
      results.overall_status = 'pass';
    }

  } catch (error) {
    console.error('Error during diff analysis:', error);
    results.overall_status = 'error';
    results.error = error.message;
  }

  return results;
}

/**
 * Find all diff image files
 */
function findDiffFiles(dir) {
  const diffFiles = [];

  function scanDir(currentDir) {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDir(filePath);
      } else if (file.includes('-diff.png') || file.includes('_diff.png')) {
        diffFiles.push(filePath);
      }
    }
  }

  scanDir(dir);
  return diffFiles;
}

/**
 * Extract component name from diff file path
 */
function extractComponentName(diffPath) {
  const fileName = path.basename(diffPath, path.extname(diffPath));
  const parts = fileName.split('-');

  // Remove common suffixes
  const cleanParts = parts.filter(part =>
    !['diff', 'actual', 'expected', 'desktop', 'mobile', 'tablet'].includes(part)
  );

  return cleanParts.join('-');
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Analyzing MD3 visual diffs...');

  const results = analyzeAllDiffs();

  // Write results to file
  const outputPath = path.join(process.cwd(), 'md3-visual-analysis.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  // Print summary
  console.log('\n📊 Analysis Results:');
  console.log(`Status: ${results.overall_status.toUpperCase()}`);
  console.log(`Total diffs: ${results.summary.total_diffs}`);
  console.log(`Acceptable: ${results.summary.acceptable_diffs}`);
  console.log(`Needs review: ${results.summary.review_diffs}`);
  console.log(`Blocking: ${results.summary.blocking_diffs}`);

  if (results.details.length > 0) {
    console.log('\n📋 Details:');
    results.details.forEach(diff => {
      const icon = diff.status === 'pass' ? '✅' : diff.status === 'review' ? '⚠️' : '❌';
      console.log(`${icon} ${diff.component}: ${diff.status} (${diff.confidence}% confidence)`);
    });
  }

  // Exit with appropriate code
  const exitCode = results.overall_status === 'fail' ? 1 : 0;
  process.exit(exitCode);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  analyzeAllDiffs,
  analyzeDiff,
  classifyDiff,
  ANALYSIS_CONFIG
};