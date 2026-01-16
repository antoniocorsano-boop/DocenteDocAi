#!/usr/bin/env node

import fs from 'fs';

let content = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf-8');

// Replace theme colors with var(--md-sys-color-*)
content = content.replace(/\b(surfaceContainerLow|outline|tertiary|secondary|primary|onSurface|onSurfaceVariant|surface|onTertiaryContainer|error)\b/g, (match) => {
  const mapping = {
    surfaceContainerLow: 'surface-container-low',
    outline: 'outline',
    tertiary: 'tertiary',
    secondary: 'secondary',
    primary: 'primary',
    onSurface: 'on-surface',
    onSurfaceVariant: 'on-surface-variant',
    surface: 'surface',
    onTertiaryContainer: 'on-tertiary-container',
    error: 'error'
  };
  return `var(--md-sys-color-${mapping[match]})`;
});

// Replace layers.ref.spacing['*'] with var(--md-sys-spacing-*)
content = content.replace(/layers\.ref\.spacing\['(\d+)'\]/g, "var(--md-sys-spacing-$1)");

// Replace layers.ref.shape.corner.* with var(--md-sys-shape-corner-*)
content = content.replace(/'layers\.ref\.shape\.corner\.([a-z-]+)'/g, "var(--md-sys-shape-corner-$1)");

// Replace <p> with M3Typography for body-small
content = content.replace(/<p style=\{ \{fontSize: var\(--md-sys-typescale-body-small-font\),?\s*color:\s*([^,]+),\s*lineHeight:\s*var\(--md-sys-typescale-body-small-line-height\)\} \}>([^<]+)<\/p>/g, '<M3Typography variant="body-small" style={{color: $1}}>$2</M3Typography>');

// Replace <p> with M3Typography for headline-small
content = content.replace(/<p style=\{ \{fontSize: var\(--md-sys-typescale-headline-small-font\),?\s*fontWeight:\s*'900',\s*color:\s*([^,]+)\} \}>([^<]+)<\/p>/g, '<M3Typography variant="headline-small" style={{color: $1}}>$2</M3Typography>');

// Replace <p> with M3Typography for body-medium
content = content.replace(/<p style=\{ \{fontSize: var\(--md-sys-typescale-body-medium-font\),?\s*color:\s*([^,]+),\s*lineHeight:\s*var\(--md-sys-typescale-body-medium-line-height\),\s*fontStyle:\s*'italic'\} \}>([^<]+)<\/p>/g, '<M3Typography variant="body-medium" style={{color: $1, fontStyle: \'italic\'}}>$2</M3Typography>');

// Other replacements...

fs.writeFileSync('src/components/AnalyticsDashboard.tsx', content);
console.log('Replaced token references');