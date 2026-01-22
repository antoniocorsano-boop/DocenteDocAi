#!/usr/bin/env python3
"""
Complete migration of NotificationsPopover.tsx to MD3
"""

import re

def migrate_notifications_popover():
    file_path = r"c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\src\components\NotificationsPopover.tsx"

    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove useTheme import
    content = re.sub(r"import \{ useTheme \} from '\.\./theme/theme';\n", "", content)

    # Remove const { layers } = useTheme(); line
    content = re.sub(r"    const \{ layers \} = useTheme\(\);\n", "", content)

    # Update header comment
    content = content.replace("// LEGACY - MD3 Non-compliant", "// ✅ MD3 Compliant")

    # Replace spacing references
    content = re.sub(r'layers\.ref\.spacing\[\'(\d+)\'\]', r"'var(--md-sys-spacing-\1)'", content)

    # Replace color references - quoted ones
    def color_replacer_quoted(match):
        color_name = match.group(1)
        # Convert camelCase to kebab-case
        kebab = re.sub(r'([a-z0-9])([A-Z])', r'\1-\2', color_name).lower()
        return f"'var(--md-sys-color-{kebab})'"

    content = re.sub(r"'layers\.sys\.color\.([a-zA-Z0-9-]+)'", color_replacer_quoted, content)

    # Replace color references - unquoted ones
    def color_replacer_unquoted(match):
        color_name = match.group(1)
        # Convert camelCase to kebab-case
        kebab = re.sub(r'([a-z0-9])([A-Z])', r'\1-\2', color_name).lower()
        return f"'var(--md-sys-color-{kebab})'"

    content = re.sub(r'layers\.sys\.color\.([a-zA-Z0-9-]+)(?![a-zA-Z0-9-])', color_replacer_unquoted, content)

    # Replace shape references - quoted
    content = re.sub(r"'layers\.ref\.shape\.corner\.([a-zA-Z]+)'", r"'var(--md-sys-shape-corner-\1)'", content)

    # Replace shape references - unquoted
    content = re.sub(r'layers\.ref\.shape\.corner\.([a-zA-Z]+)(?![a-zA-Z])', r"'var(--md-sys-shape-corner-\1)'", content)

    # Replace motion references (remove template literal interpolation)
    content = re.sub(r'\$\{layers\.motion\.duration\.short2\}', "var(--md-sys-motion-duration-short2)", content)
    content = re.sub(r'\$\{layers\.motion\.easing\.standard\}', "var(--md-sys-motion-easing-standard)", content)

    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("✅ NotificationsPopover.tsx migrated to MD3")

if __name__ == "__main__":
    migrate_notifications_popover()