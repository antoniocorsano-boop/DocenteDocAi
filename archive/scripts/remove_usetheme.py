#!/usr/bin/env python3
import re

# Read file
with open('src/components/NotificationsPopover.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove useTheme import
content = re.sub(r'import\s*\{\s*useTheme\s*\}\s*from\s*[\'\"][^\'"]*[\'"]\s*;?', '', content)

# Write back
with open('src/components/NotificationsPopover.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Removed useTheme import')