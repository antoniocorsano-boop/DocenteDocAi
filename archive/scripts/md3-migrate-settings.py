#!/usr/bin/env python3
"""
MD3 Expressive CSS Variable Migration Tool
Converts all var(--md-sys-*) usages in Settings.tsx to use theme tokens
"""

import re
import sys

# Mapping of CSS variables to theme token paths
VAR_TO_TOKEN_MAP = {
    # Colors
    r'var\(--md-sys-color-surface-container-low\)': 'theme.layers.sys.colors.surfaceContainerLow',
    r'var\(--md-sys-color-surface-container-high\)': 'theme.layers.sys.colors.surfaceContainerHigh',
    r'var\(--md-sys-color-surface-container-highest\)': 'theme.layers.sys.colors.surfaceContainerHighest',
    r'var\(--md-sys-color-surface-container\)': 'theme.layers.sys.colors.surfaceContainer',
    r'var\(--md-sys-color-outline-variant\)': 'theme.layers.sys.colors.outlineVariant',
    r'var\(--md-sys-color-primary-container\)': 'theme.layers.sys.colors.primaryContainer',
    r'var\(--md-sys-color-secondary-container\)': 'theme.layers.sys.colors.secondaryContainer',
    r'var\(--md-sys-color-tertiary-container\)': 'theme.layers.sys.colors.tertiaryContainer',
    r'var\(--md-sys-color-on-primary-container\)': 'theme.layers.sys.colors.onPrimaryContainer',
    r'var\(--md-sys-color-on-secondary-container\)': 'theme.layers.sys.colors.onSecondaryContainer',
    r'var\(--md-sys-color-on-tertiary-container\)': 'theme.layers.sys.colors.onTertiaryContainer',
    r'var\(--md-sys-color-on-surface\)': 'theme.layers.sys.colors.onSurface',
    r'var\(--md-sys-color-on-surface-variant\)': 'theme.layers.sys.colors.onSurfaceVariant',
    r'var\(--md-sys-color-surface\)': 'theme.layers.sys.colors.surface',
    r'var\(--md-sys-color-primary\)': 'theme.layers.sys.colors.primary',
    r'var\(--md-sys-color-secondary\)': 'theme.layers.sys.colors.secondary',
    r'var\(--md-sys-color-tertiary\)': 'theme.layers.sys.colors.tertiary',
    r'var\(--md-sys-color-error\)': 'theme.layers.sys.colors.error',
    r'var\(--md-sys-color-error-container\)': 'theme.layers.sys.colors.errorContainer',
    r'var\(--md-sys-color-on-error\)': 'theme.layers.sys.colors.onError',
    r'var\(--md-sys-color-on-error-container\)': 'theme.layers.sys.colors.onErrorContainer',
    r'var\(--md-sys-color-outline\)': 'theme.layers.sys.colors.outline',
    
    # Spacing
    r'var\(--md-sys-spacing-2\)': 'theme.layers.ref.spacing[2]',
    r'var\(--md-sys-spacing-3\)': 'theme.layers.ref.spacing[3]',
    r'var\(--md-sys-spacing-4\)': 'theme.layers.ref.spacing[4]',
    r'var\(--md-sys-spacing-5\)': 'theme.layers.ref.spacing[5]',
    r'var\(--md-sys-spacing-6\)': 'theme.layers.ref.spacing[6]',
    r'var\(--md-sys-spacing-8\)': 'theme.layers.ref.spacing[8]',
    r'var\(--md-sys-spacing-12\)': 'theme.layers.ref.spacing[12]',
    r'var\(--md-sys-spacing-14\)': 'theme.layers.ref.spacing[14]',
    r'var\(--md-sys-spacing-16\)': 'theme.layers.ref.spacing[16]',
    r'var\(--md-sys-spacing-32\)': 'theme.layers.ref.spacing[32]',
    
    # Shape
    r'var\(--md-sys-shape-corner-small\)': 'theme.layers.ref.shape.small',
    r'var\(--md-sys-shape-corner-medium\)': 'theme.layers.ref.shape.medium',
    r'var\(--md-sys-shape-corner-large\)': 'theme.layers.ref.shape.large',
    r'var\(--md-sys-shape-corner-extra-large\)': 'theme.layers.ref.shape.extraLarge',
    r'var\(--md-sys-shape-corner-full\)': 'theme.layers.ref.shape.full',
    
    # Motion - easing
    r'var\(--md-sys-motion-easing-standard\)': 'theme.layers.motion.easing.standard',
    r'var\(--md-sys-motion-easing-emphasized\)': 'theme.layers.motion.easing.emphasized',
    
    # Motion - duration
    r'var\(--md-sys-motion-duration-short\)': 'theme.layers.motion.duration.short',
    r'var\(--md-sys-motion-duration-short1\)': 'theme.layers.motion.duration.short1',
    r'var\(--md-sys-motion-duration-short2\)': 'theme.layers.motion.duration.short2',
    r'var\(--md-sys-motion-duration-short3\)': 'theme.layers.motion.duration.short3',
    r'var\(--md-sys-motion-duration-short4\)': 'theme.layers.motion.duration.short4',
    r'var\(--md-sys-motion-duration-medium\)': 'theme.layers.motion.duration.medium',
    r'var\(--md-sys-motion-duration-medium1\)': 'theme.layers.motion.duration.medium1',
    r'var\(--md-sys-motion-duration-medium2\)': 'theme.layers.motion.duration.medium2',
    r'var\(--md-sys-motion-duration-medium3\)': 'theme.layers.motion.duration.medium3',
    r'var\(--md-sys-motion-duration-medium4\)': 'theme.layers.motion.duration.medium4',
    
    # Elevation
    r'var\(--md-sys-elevation-level0\)': 'theme.layers.elevation.level0',
    r'var\(--md-sys-elevation-level1\)': 'theme.layers.elevation.level1',
    r'var\(--md-sys-elevation-level2\)': 'theme.layers.elevation.level2',
    r'var\(--md-sys-elevation-level3\)': 'theme.layers.elevation.level3',
    r'var\(--md-sys-elevation-level4\)': 'theme.layers.elevation.level4',
    r'var\(--md-sys-elevation-level5\)': 'theme.layers.elevation.level5',
}

def migrate_file(filepath):
    """Migrate a file from CSS variables to token usage"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Replace all var() calls with token references
    for var_pattern, token_path in VAR_TO_TOKEN_MAP.items():
        # Use regex to replace within template strings (backticks)
        # Pattern: ${`...${...var(...)...}...`}
        content = re.sub(
            f'`([^`]*){{[^}}]*{var_pattern}[^}}]*}}([^`]*)`',
            lambda m: f'${{{token_path}}}' if var_pattern in m.group(0) else m.group(0),
            content
        )
        
        # Also replace in plain string concatenations
        content = re.sub(
            f"'([^']*)\\${{\\s*{var_pattern}\\s*}}([^']*)'",
            lambda m: f"${{{token_path}}}",
            content
        )
        
        # Replace direct var() calls in style objects
        content = content.replace(var_pattern, f'${{{token_path}}}')
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Migrated: {filepath}")
        return True
    else:
        print(f"⏭️  No changes needed: {filepath}")
        return False

if __name__ == '__main__':
    filepath = sys.argv[1] if len(sys.argv) > 1 else 'src/components/Settings.tsx'
    migrate_file(filepath)
