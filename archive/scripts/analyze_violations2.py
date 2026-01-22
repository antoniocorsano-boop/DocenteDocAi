#!/usr/bin/env python3
import re
from collections import defaultdict

with open('full_lint.txt', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

# Join lines that are split, rebuild file path
full_lines = []
current_line = ""
for line in lines:
    line = line.rstrip('\n')
    if line.startswith('C:\\'):
        if current_line:
            full_lines.append(current_line)
        current_line = line
    else:
        current_line += line
if current_line:
    full_lines.append(current_line)

# Parse violations
file_violations = defaultdict(lambda: {'className': 0, 'tailwind': 0, 'classes': set()})
current_file = None

for line in full_lines:
    # Extract file path starting with C:\
    if 'src\\components' in line and '.tsx' in line:
        # Extract the path part
        match = re.search(r'src\\components\\[^\s]+\.tsx', line)
        if match:
            file_path = match.group(0).replace('\\', '/')
            # Keep track of current file for following error lines
            if 'error' in line and ('className' in line or 'Tailwind class' in line):
                current_file = file_path
                # Check violations in same line
                if 'design-system/no-classname' in line:
                    file_violations[file_path]['className'] += 1
                if 'design-system/no-tailwind-classes' in line:
                    file_violations[file_path]['tailwind'] += 1
                    match_class = re.search(r"Tailwind class '([^']+)'", line)
                    if match_class:
                        file_violations[file_path]['classes'].add(match_class.group(1))

# Sort and display
sorted_files = sorted(file_violations.items(), key=lambda x: (x[1]['className'] + x[1]['tailwind']), reverse=True)

print('# Design System Violations Report')
print()
print('## Summary by File (Top 30)')
print()
print('| File Path | className Count | Tailwind Count | Sample Classes |')
print('|---|---|---|---|')

for filepath, violations in sorted_files[:30]:
    if violations['className'] > 0 or violations['tailwind'] > 0:
        classes_list = sorted(list(violations['classes']))[:5]
        classes_str = ', '.join(classes_list) if classes_list else 'N/A'
        # Shorten filepath for readability
        short_path = filepath.replace('src/components/', '')
        print(f'| {short_path} | {violations["className"]} | {violations["tailwind"]} | {classes_str} |')

# All classes
print()
print('## All Tailwind Classes Used')
print()

all_classes = set()
for violations in file_violations.values():
    all_classes.update(violations['classes'])

sorted_classes = sorted(all_classes)
for i, cls in enumerate(sorted_classes, 1):
    count = sum(1 for v in file_violations.values() if cls in v['classes'])
    print(f'{i}. `{cls}` (used in {count} file(s))')

print()
print(f'## Statistics')
print()
print(f'- Total files with violations: {len(file_violations)}')
print(f'- Total className violations: {sum(v["className"] for v in file_violations.values())}')
print(f'- Total Tailwind violations: {sum(v["tailwind"] for v in file_violations.values())}')
print(f'- Unique Tailwind classes: {len(all_classes)}')
