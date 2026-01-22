#!/usr/bin/env python3
import re

# Read file
with open('src/components/NotificationsPopover.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace motion tokens
content = re.sub(r'layers\.motion\.duration\.short2', "var(--md-sys-motion-duration-short2)", content)
content = re.sub(r'layers\.motion\.easing\.standard', "var(--md-sys-motion-easing-standard)", content)

# Write back
with open('src/components/NotificationsPopover.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Replaced motion tokens')