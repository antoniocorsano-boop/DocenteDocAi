import re

# Read the file
with open('src/components/ImportStudentsModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove useTheme import and destructuring
content = re.sub(r'import\s*{\s*useTheme[^}]*}\s*from\s*[\'\"][^\'\"]*[\'\"]\s*;', '', content)
content = re.sub(r'const\s*{\s*layers[^}]*}\s*=\s*useTheme\(\)\s*;', '', content)

# Replace layers.sys.color.* with var(--md-sys-color-*)
content = re.sub(r'layers\.sys\.color\.(\w+)', r'var(--md-sys-color-\1)', content)

# Replace layers.ref.spacing['*'] with var(--md-sys-spacing-*)
content = re.sub(r'layers\.ref\.spacing\[\'(\d+)\'\]', r'var(--md-sys-spacing-\1)', content)

# Replace layers.ref.shape.corner.* with var(--md-sys-shape-corner-*)
content = re.sub(r'layers\.ref\.shape\.corner\.(\w+)', r'var(--md-sys-shape-corner-\1)', content)

# Replace layers.motion.* with standard CSS values
content = re.sub(r'layers\.motion\.(\w+)', r'300ms cubic-bezier(0.4, 0, 0.2, 1)', content)

# Write back
with open('src/components/ImportStudentsModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Migrated ImportStudentsModal.tsx from layers.* to MD3 tokens')