#!/usr/bin/env python3
"""
Script to fix duplicate style attributes and triple braces in JSX elements
caused by MD3 migration scripts.
"""

import os
import re
import glob

def fix_triple_braces(content):
    """Fix triple braces {{{ to double braces {{ in style attributes"""
    # More precise pattern: match exactly style={{{ followed by content and }}}
    # This should only match cases where there are exactly 3 opening braces
    lines = content.split('\n')
    fixed_lines = []

    for line in lines:
        # Look for style={{{ (exactly 3 braces)
        if 'style={{{' in line:
            # Replace {{{ with {{
            line = line.replace('style={{{', 'style={{')
        fixed_lines.append(line)

    return '\n'.join(fixed_lines)

def fix_duplicate_styles(content):
    """Fix duplicate style attributes by merging them"""
    lines = content.split('\n')
    fixed_lines = []

    for line in lines:
        # Find lines with duplicate style attributes
        style_pattern = r'(\s+)([^>]+)style=\{([^}]+)\}\s+style=\{([^}]+)\}([^>]*>?)'
        match = re.search(style_pattern, line)

        if match:
            indent, before, style1, style2, after = match.groups()
            # Merge the two style objects
            merged_style = f"{style1}, {style2}"
            fixed_line = f"{indent}{before}style={{{merged_style}}}{after}"
            fixed_lines.append(fixed_line)
        else:
            fixed_lines.append(line)

    return '\n'.join(fixed_lines)

def process_file(filepath):
    """Process a single file to fix style issues"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Fix triple braces first
        content = fix_triple_braces(content)

        # Then fix duplicate styles
        content = fix_duplicate_styles(content)

        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True

    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

    return False

def main():
    """Main function to process all TypeScript/React files"""
    # Find all .tsx and .ts files
    patterns = [
        'src/**/*.tsx',
        'src/**/*.ts'
    ]

    files_processed = 0
    files_fixed = 0

    for pattern in patterns:
        for filepath in glob.glob(pattern, recursive=True):
            if os.path.isfile(filepath):
                files_processed += 1
                if process_file(filepath):
                    files_fixed += 1
                    print(f"Fixed: {filepath}")

    print(f"\nProcessed {files_processed} files, fixed {files_fixed} files")

if __name__ == '__main__':
    main()