#!/usr/bin/env python3
"""
Fix var() quoting in NotificationsPopover.tsx
"""

import re

def fix_var_quoting():
    """Fix all unquoted var() calls in style objects"""

    # Read the file
    with open('src/components/NotificationsPopover.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix all var() calls in style objects by adding quotes
    # Pattern: property: var(...
    content = re.sub(r'([a-zA-Z-]+):\s*var\(([^)]+)\)', r"\1: 'var(\2)'", content)

    # Write back
    with open('src/components/NotificationsPopover.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

    print('Fixed var() quoting in NotificationsPopover.tsx')

if __name__ == '__main__':
    fix_var_quoting()