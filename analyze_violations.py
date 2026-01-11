#!/usr/bin/env python3
import re
from collections import defaultdict

# Read the lint output
with open('full_lint.txt', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Normalize line breaks and path separators
content = content.replace('\r\n', '\n')
content = content.replace('docent\nedoc-ai\\src', 'src')
content = re.sub(r'edoc-ai\n', '', content)
content = re.sub(r'entedoc-ai\n', '', content)

# Parse violations
file_violations = defaultdict(lambda: {'className': 0, 'tailwind': 0, 'classes': set()})
lines = content.split('\n')
current_file = None

for i, line in enumerate(lines):
    # Combine multi-line file paths
    combined_line = line
    if i + 1 < len(lines) and 'src' in line and 'components' in line:
        if '.tsx' not in line:
            combined_line = line + lines[i + 1] if i + 1 < len(lines) else line
    
    # Extract file path - match src\components or src/components patterns
    if 'src' in combined_line and 'components' in combined_line and ('.tsx' in combined_line or '.ts' in combined_line):
        match = re.search(r'src[\\\/]components[^\s:]+\.tsx?', combined_line)
        if match:
            current_file = match.group(0).replace('\\', '/').strip()
    
    # Count violations for current file
    if current_file:
        if 'design-system/no-classname' in line:
            file_violations[current_file]['className'] += 1
        
        if 'design-system/no-tailwind-classes' in line:
            file_violations[current_file]['tailwind'] += 1
            # Extract Tailwind class name
            match = re.search(r"Tailwind class '([^']+)'", line)
            if match:
                file_violations[current_file]['classes'].add(match.group(1))

# Sort and display
sorted_files = sorted(file_violations.items(), key=lambda x: x[1]['className'], reverse=True)

print('# Design System Violations Report')
print('')
print('## Summary by File (Top 30)')
print('')
print('| File Path | className Count | Tailwind Count | Sample Classes |')
print('|---|---|---|---|')

for filepath, violations in sorted_files[:30]:
    if violations['className'] > 0 or violations['tailwind'] > 0:
        classes_list = sorted(list(violations['classes']))[:5]
        classes_str = ', '.join(classes_list) if classes_list else 'N/A'
        # Shorten filepath for readability
        short_path = filepath.replace('src/components/', '')
        print(f'| {short_path} | {violations["className"]} | {violations["tailwind"]} | {classes_str} |')

# Print detailed Tailwind class usage
print('')
print('## All Tailwind Classes Used')
print('')

all_classes = set()
for violations in file_violations.values():
    all_classes.update(violations['classes'])

sorted_classes = sorted(all_classes)
for i, cls in enumerate(sorted_classes, 1):
    # Count how many files use this class
    count = sum(1 for v in file_violations.values() if cls in v['classes'])
    print(f'{i}. `{cls}` (used in {count} file(s))')
