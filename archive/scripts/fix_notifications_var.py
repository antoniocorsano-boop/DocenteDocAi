#!/usr/bin/env python3
"""
Fix var() references in NotificationsPopover.tsx
"""

import re

def fix_var_references():
    """Fix all improperly quoted var() references"""

    # Read the file
    with open('src/components/NotificationsPopover.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix all var() calls that are not properly quoted
    # Pattern to match var(...) not inside quotes
    content = re.sub(r'([^\'\"])var\(([^)]+)\)([^\'\"])', r"\1'var(\2)'\3", content)

    # Write back
    with open('src/components/NotificationsPopover.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

    print('Fixed all var() references in NotificationsPopover.tsx')

if __name__ == '__main__':
    fix_var_references()