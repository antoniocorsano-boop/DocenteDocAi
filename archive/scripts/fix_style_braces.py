import re

# Read the file
with open('src/components/ImportStudentsModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix style attributes missing curly braces
content = re.sub(r'style=\{([^}]+)\}', r'style={{\1}}', content)

# Write back
with open('src/components/ImportStudentsModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed style attributes missing curly braces in ImportStudentsModal.tsx')