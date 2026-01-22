#!/usr/bin/env python3
"""
Fix template literals in NotificationsPopover.tsx
"""

import re

def fix_template_literals():
    """Fix template literals with unquoted var() calls"""

    # Read the file
    with open('src/components/NotificationsPopover.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix template literals with unquoted var()
    # Replace ${var(...)} with var(...) in template literals
    content = re.sub(r'\$\{var\(([^)]+)\)\}', r'var(\1)', content)

    # Write back
    with open('src/components/NotificationsPopover.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

    print('Fixed template literals in NotificationsPopover.tsx')

if __name__ == '__main__':
    fix_template_literals()