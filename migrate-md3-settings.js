#!/usr/bin/env node
/**
 * MD3 Expressive CSS Variable Migration - Settings.tsx
 * Converts all var(--md-sys-*) usages to theme token references
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Settings.tsx');

// Mapping of CSS variables to token paths
const tokenMap = {
  // Colors - surface containers
  "'var(--md-sys-color-surface-container-low)'": "theme.layers.sys.colors.surfaceContainerLow",
  "'var(--md-sys-color-surface-container-high)'": "theme.layers.sys.colors.surfaceContainerHigh",
  "'var(--md-sys-color-surface-container-highest)'": "theme.layers.sys.colors.surfaceContainerHighest",
  "'var(--md-sys-color-surface-container)'": "theme.layers.sys.colors.surfaceContainer",
  
  // Colors - outlines
  "'var(--md-sys-color-outline-variant)'": "theme.layers.sys.colors.outlineVariant",
  "'var(--md-sys-color-outline)'": "theme.layers.sys.colors.outline",
  
  // Colors - containers
  "'var(--md-sys-color-primary-container)'": "theme.layers.sys.colors.primaryContainer",
  "'var(--md-sys-color-secondary-container)'": "theme.layers.sys.colors.secondaryContainer",
  "'var(--md-sys-color-tertiary-container)'": "theme.layers.sys.colors.tertiaryContainer",
  "'var(--md-sys-color-error-container)'": "theme.layers.sys.colors.errorContainer",
  
  // Colors - on containers
  "'var(--md-sys-color-on-primary-container)'": "theme.layers.sys.colors.onPrimaryContainer",
  "'var(--md-sys-color-on-secondary-container)'": "theme.layers.sys.colors.onSecondaryContainer",
  "'var(--md-sys-color-on-tertiary-container)'": "theme.layers.sys.colors.onTertiaryContainer",
  "'var(--md-sys-color-on-error-container)'": "theme.layers.sys.colors.onErrorContainer",
  
  // Colors - surface/on-surface
  "'var(--md-sys-color-surface)'": "theme.layers.sys.colors.surface",
  "'var(--md-sys-color-on-surface)'": "theme.layers.sys.colors.onSurface",
  "'var(--md-sys-color-on-surface-variant)'": "theme.layers.sys.colors.onSurfaceVariant",
  
  // Colors - hues
  "'var(--md-sys-color-primary)'": "theme.layers.sys.colors.primary",
  "'var(--md-sys-color-secondary)'": "theme.layers.sys.colors.secondary",
  "'var(--md-sys-color-tertiary)'": "theme.layers.sys.colors.tertiary",
  "'var(--md-sys-color-error)'": "theme.layers.sys.colors.error",
  
  // Spacing
  "'var(--md-sys-spacing-2)'": "theme.layers.ref.spacing['2']",
  "'var(--md-sys-spacing-3)'": "theme.layers.ref.spacing['3']",
  "'var(--md-sys-spacing-4)'": "theme.layers.ref.spacing['4']",
  "'var(--md-sys-spacing-5)'": "theme.layers.ref.spacing['5']",
  "'var(--md-sys-spacing-6)'": "theme.layers.ref.spacing['6']",
  "'var(--md-sys-spacing-8)'": "theme.layers.ref.spacing['8']",
  "'var(--md-sys-spacing-12)'": "theme.layers.ref.spacing['12']",
  
  // Shape
  "'var(--md-sys-shape-corner-small)'": "theme.layers.ref.shape.small",
  "'var(--md-sys-shape-corner-medium)'": "theme.layers.ref.shape.medium",
  "'var(--md-sys-shape-corner-large)'": "theme.layers.ref.shape.large",
  "'var(--md-sys-shape-corner-extra-large)'": "theme.layers.ref.shape.extraLarge",
  "'var(--md-sys-shape-corner-full)'": "theme.layers.ref.shape.full",
  
  // Motion - easing
  "'var(--md-sys-motion-easing-standard)'": "theme.layers.motion.easing.standard",
  "'var(--md-sys-motion-easing-emphasized)'": "theme.layers.motion.easing.emphasized",
  
  // Motion - duration
  "'var(--md-sys-motion-duration-short)'": "theme.layers.motion.duration.short",
  "'var(--md-sys-motion-duration-medium)'": "theme.layers.motion.duration.medium",
  "'var(--md-sys-motion-duration-short1)'": "theme.layers.motion.duration.short1",
  "'var(--md-sys-motion-duration-short2)'": "theme.layers.motion.duration.short2",
  "'var(--md-sys-motion-duration-medium1)'": "theme.layers.motion.duration.medium1",
  "'var(--md-sys-motion-duration-medium2)'": "theme.layers.motion.duration.medium2",
  
  // Elevation
  "'var(--md-sys-elevation-level0)'": "theme.layers.elevation.level0",
  "'var(--md-sys-elevation-level1)'": "theme.layers.elevation.level1",
  "'var(--md-sys-elevation-level2)'": "theme.layers.elevation.level2",
  "'var(--md-sys-elevation-level3)'": "theme.layers.elevation.level3",
  "'var(--md-sys-elevation-level4)'": "theme.layers.elevation.level4",
  "'var(--md-sys-elevation-level5)'": "theme.layers.elevation.level5",
};

try {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalSize = content.length;
  
  // Replace each token
  Object.entries(tokenMap).forEach(([varCall, tokenPath]) => {
    const regex = new RegExp(varCall.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    content = content.replace(regex, `\${${tokenPath}}`);
  });
  
  // Also handle template strings with var()
  content = content.replace(/`([^`]*)\${?'?var\(--md-sys-([^)]+)\)'?}?([^`]*)`/g, (match, pre, varName, post) => {
    return match; // Already handled above
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
  
  const newSize = content.length;
  const diff = originalSize - newSize;
  
  console.log('✅ Migration complete!');
  console.log(`  File: ${filePath}`);
  console.log(`  Original size: ${originalSize} bytes`);
  console.log(`  New size: ${newSize} bytes`);
  console.log(`  Reduction: ${diff} bytes`);
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
