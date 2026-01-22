#!/usr/bin/env python3
"""
Fix motion tokens in NotificationsPopover.tsx
Replace template literal motion references with direct CSS custom property values
"""

import re

def fix_motion_tokens():
    file_path = r"c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\src\components\NotificationsPopover.tsx"

    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match the incorrect template literal motion tokens
    # This matches: ${var(--md-sys-motion-duration-short2)} and ${var(--md-sys-motion-easing-standard)}
    # within transition properties
    pattern = r'transition:\s*`all\s*\$\{var\(--md-sys-motion-duration-short2\)\}\s*\$\{var\(--md-sys-motion-easing-standard\)\}`'

    # Replacement: direct CSS custom properties without template literal interpolation
    replacement = r"transition: `all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`"

    # Apply the fix
    new_content = re.sub(pattern, replacement, content)

    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print("Fixed motion tokens in NotificationsPopover.tsx")

if __name__ == "__main__":
    fix_motion_tokens()