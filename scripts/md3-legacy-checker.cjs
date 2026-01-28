#!/usr/bin/env node
/**
 * MD3 LEGACY FILE CHECKER
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Purpose: Check if a file is marked as legacy or exempt from MD3 enforcement
 * Used by audit scripts to distinguish warnings from blocking violations
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const fs = require('fs');
const path = require('path');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOAD LEGACY REGISTRY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let legacyRegistry = null;

function loadLegacyRegistry() {
  if (legacyRegistry) return legacyRegistry;

  const registryPath = path.join(process.cwd(), 'md3-legacy-registry.json');
  
  if (!fs.existsSync(registryPath)) {
    console.warn('⚠️  md3-legacy-registry.json not found — treating all violations as blocking');
    return {
      legacyFiles: [],
      legacyPatterns: [],
      exemptions: [],
      monitoring: {
        reportWarnings: true,
        blockOnNewViolations: true,
        allowLegacyExpansion: false,
      },
    };
  }

  try {
    legacyRegistry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    return legacyRegistry;
  } catch (error) {
    console.error('❌ Failed to parse md3-legacy-registry.json:', error.message);
    process.exit(1);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILE CLASSIFICATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function isLegacyFile(filePath) {
  const registry = loadLegacyRegistry();
  const normalizedPath = filePath.replace(/\\/g, '/');

  // Check exemptions (permanent exceptions)
  for (const exemption of registry.exemptions || []) {
    const exemptPath = exemption.file.replace(/\\/g, '/');
    if (normalizedPath.includes(exemptPath) || normalizedPath.endsWith(exemptPath)) {
      return {
        isLegacy: false,
        isExempt: true,
        reason: exemption.reason,
        permanent: exemption.permanent,
      };
    }
  }

  // Check legacy files (warnings only) - exact match first
  for (const legacy of registry.legacyFiles || []) {
    const legacyPath = legacy.path.replace(/\\/g, '/');
    
    // Exact file match (higher priority)
    if (normalizedPath.includes(legacyPath) || normalizedPath.endsWith(legacyPath)) {
      return {
        isLegacy: true,
        isExempt: false,
        reason: legacy.reason,
        tracked: legacy.tracked,
        migrationPlan: legacy.migrationPlan,
        remainingViolations: legacy.remainingViolations,
        violationType: legacy.violationType,
      };
    }
    
    // Pattern match (wildcard support)
    const pattern = legacyPath.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*');
    const regex = new RegExp(pattern);
    
    if (regex.test(normalizedPath)) {
      return {
        isLegacy: true,
        isExempt: false,
        reason: legacy.reason,
        tracked: legacy.tracked,
        migrationPlan: legacy.migrationPlan,
      };
    }
  }

  // Check legacy patterns (regex)
  for (const pattern of registry.legacyPatterns || []) {
    const regex = new RegExp(pattern.pattern);
    
    if (regex.test(normalizedPath)) {
      return {
        isLegacy: true,
        isExempt: false,
        reason: pattern.reason,
      };
    }
  }

  // Not legacy, not exempt → BLOCKING violation
  return {
    isLegacy: false,
    isExempt: false,
    reason: null,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VIOLATION CLASSIFICATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function classifyViolation(filePath, violation) {
  const fileStatus = isLegacyFile(filePath);

  if (fileStatus.isExempt) {
    return {
      type: 'exempt',
      blocking: false,
      severity: 'info',
      message: `Exempt: ${fileStatus.reason}`,
    };
  }

  if (fileStatus.isLegacy) {
    return {
      type: 'legacy-warning',
      blocking: false,
      severity: 'warning',
      message: `Legacy file: ${fileStatus.reason}`,
      tracked: fileStatus.tracked,
      migrationPlan: fileStatus.migrationPlan,
    };
  }

  return {
    type: 'blocking-violation',
    blocking: true,
    severity: 'error',
    message: 'New violation — blocks CI/CD',
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATS & REPORTING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function generateStats(violations) {
  const stats = {
    total: violations.length,
    blocking: 0,
    warnings: 0,
    exempt: 0,
    byFile: {},
  };

  for (const v of violations) {
    const classification = classifyViolation(v.file, v);
    
    if (classification.blocking) {
      stats.blocking++;
    } else if (classification.type === 'legacy-warning') {
      stats.warnings++;
    } else if (classification.type === 'exempt') {
      stats.exempt++;
    }

    if (!stats.byFile[v.file]) {
      stats.byFile[v.file] = { blocking: 0, warnings: 0, exempt: 0 };
    }
    
    if (classification.blocking) {
      stats.byFile[v.file].blocking++;
    } else if (classification.type === 'legacy-warning') {
      stats.byFile[v.file].warnings++;
    } else if (classification.type === 'exempt') {
      stats.byFile[v.file].exempt++;
    }
  }

  return stats;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports = {
  loadLegacyRegistry,
  isLegacyFile,
  classifyViolation,
  generateStats,
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLI USAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node md3-legacy-checker.cjs <file-path>');
    console.log('');
    console.log('Example:');
    console.log('  node md3-legacy-checker.cjs src/components/MyComponent.tsx');
    process.exit(1);
  }

  const filePath = args[0];
  const result = isLegacyFile(filePath);

  console.log(`File: ${filePath}`);
  console.log(`Legacy: ${result.isLegacy}`);
  console.log(`Exempt: ${result.isExempt}`);
  console.log(`Reason: ${result.reason || 'N/A'}`);
  
  if (result.tracked) {
    console.log(`Tracked: Yes`);
    console.log(`Migration Plan: ${result.migrationPlan}`);
  }
}
