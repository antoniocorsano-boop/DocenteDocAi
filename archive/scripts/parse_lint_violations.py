#!/usr/bin/env python3
import re
from collections import defaultdict

with open('full_lint.txt', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Find all file sections
file_violations = defaultdict(lambda: {'className': 0, 'tailwind': 0, 'classes': set()})

# Split by file path patterns
lines = content.split('\n')
current_file = None

for line in lines:
    # Find file paths with components
    if 'src\\components' in line and '.tsx' in line:
        # Extract clean file path
        match = re.search(r'src\\components\\[^\s]+\.tsx', line)
        if match:
            current_file = 'src/components/' + match.group(0).split('\\')[-1]
    
    # Process violations for current file
    elif current_file and 'error' in line:
        if 'design-system/no-classname' in line:
            file_violations[current_file]['className'] += 1
        elif 'design-system/no-tailwind-classes' in line:
            file_violations[current_file]['tailwind'] += 1
            # Extract Tailwind class
            class_match = re.search(r"'([^']+)'\s+not\s+allowed", line)
            if class_match:
                file_violations[current_file]['classes'].add(class_match.group(1))

# Sort and generate report
sorted_files = sorted(
    file_violations.items(),
    key=lambda x: x[1]['className'] + x[1]['tailwind'],
    reverse=True
)

print('# Design System Violations Analysis - src/components')
print()
print('## Summary Table (Top 25 Files)')
print()
print('| File Path | className Count | Tailwind Count | Sample Classes |')
print('|---|---|---|---|')

for filepath, violations in sorted_files[:25]:
    if violations['className'] > 0 or violations['tailwind'] > 0:
        classes = sorted(list(violations['classes']))[:5]
        classes_str = ', '.join(f'`{c}`' for c in classes) if classes else 'N/A'
        print(f'| {filepath} | {violations["className"]} | {violations["tailwind"]} | {classes_str} |')

# Tailwind classes summary
print()
print('## All Tailwind Classes Found')
print()

all_classes = set()
for violations in file_violations.values():
    all_classes.update(violations['classes'])

sorted_classes = sorted(all_classes)
cols = 3
for i in range(0, len(sorted_classes), cols):
    row_classes = sorted_classes[i:i+cols]
    print('| ' + ' | '.join(f'`{c}`' for c in row_classes) + ' |')

print()
print('## Statistics')
print()
total_classname = sum(v['className'] for v in file_violations.values())
total_tailwind = sum(v['tailwind'] for v in file_violations.values())
total_files = len(file_violations)

print(f'- **Total files with violations**: {total_files}')
print(f'- **Total className violations**: {total_classname}')
print(f'- **Total Tailwind violations**: {total_tailwind}')
print(f'- **Total violations**: {total_classname + total_tailwind}')
print(f'- **Unique Tailwind classes found**: {len(all_classes)}')
