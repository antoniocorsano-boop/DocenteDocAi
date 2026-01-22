import re

# Read the file
with open('src/components/ImportStudentsModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix duplicate style attributes by merging them
def merge_styles(match):
    style1 = match.group(1)
    style2 = match.group(2)
    # Remove trailing } from style1 and leading { from style2
    merged = style1.rstrip('}') + ', ' + style2.lstrip('{')
    return f'style={{{merged}}}'

# Pattern to match: style={{...}} style={{...}}
content = re.sub(r'style={{([^}]+)}}\s*style={{([^}]+)}}', merge_styles, content)

# Also fix any remaining sys.colors references
content = re.sub(r'sys\.colors\.(\w+)', r'var(--md-sys-color-\1)', content)

# Write back
with open('src/components/ImportStudentsModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed duplicate style attributes and remaining sys.colors references in ImportStudentsModal.tsx')