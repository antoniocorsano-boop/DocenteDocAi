import re

# Read the file
with open('src/components/ClassPlanningWizard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix var( without quotes - pattern: property: var(--md-sys-...)
content = re.sub(r'(\w+):\s*var\(--md-sys-([^)]+)\)', r'\1: "var(--md-sys-\2)"', content)

# Write back
with open('src/components/ClassPlanningWizard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed var() references in ClassPlanningWizard.tsx')