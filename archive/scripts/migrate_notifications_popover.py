#!/usr/bin/env python3
"""
Migration script for NotificationsPopover.tsx
"""

import re

def migrate_notifications_popover():
    """Migrate NotificationsPopover.tsx from layers.* to MD3 tokens"""

    # Read the file
    with open('src/components/NotificationsPopover.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Count layers.* references before migration
    layers_refs = len(re.findall(r'layers\.', content))
    print(f'Found {layers_refs} layers.* references in NotificationsPopover.tsx')

    original_content = content

    # Remove useTheme import
    content = re.sub(r'import\s*\{\s*useTheme\s*\}\s*from\s*[\'"][^\'"]*[\'"]\s*;?', '', content)

    # Replace layers.ref.spacing['X'] with var(--md-sys-spacing-X)
    content = re.sub(r'layers\.ref\.spacing\[\'(\d+)\'\]', r'var(--md-sys-spacing-\1)', content)

    # Replace layers.sys.color.X with var(--md-sys-color-X)
    def color_replacer(match):
        color_name = match.group(1)
        # Convert camelCase to kebab-case
        color_name = re.sub(r'([a-z0-9])([A-Z])', r'\1-\2', color_name).lower()
        return f'var(--md-sys-color-{color_name})'

    content = re.sub(r'layers\.sys\.color\.([a-zA-Z][a-zA-Z0-9]*(?:[A-Z][a-zA-Z0-9]*)*)', color_replacer, content)

    # Replace layers.ref.shape.corner.X with var(--md-sys-shape-corner-X)
    content = re.sub(r'layers\.ref\.shape\.corner\.([a-zA-Z]+)', lambda m: f'var(--md-sys-shape-corner-{m.group(1).lower()})', content)

    # Update header comment
    content = re.sub(r'//.*', '// MD3 Compliant - Migrated on January 18, 2026', content, count=1)

    # Write back if changed
    if content != original_content:
        with open('src/components/NotificationsPopover.tsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print('Successfully migrated NotificationsPopover.tsx')

        # Count remaining layers.* references
        remaining_refs = len(re.findall(r'layers\.', content))
        migrated_refs = layers_refs - remaining_refs
        print(f'Migrated {migrated_refs} layers.* references')
        return migrated_refs
    else:
        print('No changes needed')
        return 0

if __name__ == '__main__':
    migrate_notifications_popover()