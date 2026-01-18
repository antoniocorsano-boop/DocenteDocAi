#!/usr/bin/env python3
import re

# Read file
with open('src/components/NotificationsPopover.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update header comment
content = re.sub(r'//.*', '// MD3 Compliant - Migrated on January 18, 2026', content, count=1)

# Fix unquoted var() in style objects
content = re.sub(r'([a-zA-Z-]+):\s*var\(([^)]+)\)', r"\1: 'var(\2)'", content)

# Fix template literals with var()
content = re.sub(r'\$\{var\(([^)]+)\)\}', r'var(\1)', content)

# Write back
with open('src/components/NotificationsPopover.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Applied syntax fixes and updated header')