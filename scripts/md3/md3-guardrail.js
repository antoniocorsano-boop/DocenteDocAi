#!/usr/bin/env node

/**
 * MD3 Guardrail Script
 * Checks for MD3 policy violations in the codebase
 */

import fs from 'fs';
import path from 'path';

const srcDir = './src';

function findFiles(dir, ext) {
  const files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    // Skip excluded directories
    if (stat.isDirectory()) {
      const excludedDirs = ['node_modules', '.git', 'storybook-static', 'dist', 'build', 'coverage', '__tests__', 'stories', 'docs'];
      if (!excludedDirs.includes(item) && !item.startsWith('.')) {
        files.push(...findFiles(fullPath, ext));
      }
    } else if (stat.isFile() && fullPath.endsWith(ext)) {
      // Skip excluded files
      const excludedPatterns = [
        /\.test\./,
        /\.spec\./,
        /\.stories\./,
        /__tests__/,
        /stories/,
        /docs/
      ];

      const shouldExclude = excludedPatterns.some(pattern => pattern.test(fullPath));
      if (!shouldExclude) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

function checkFile(filePath) {
  // Skip constants files - they contain business values, not design tokens
  if (filePath.includes('/constants/') || filePath.includes('\\constants\\')) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const violations = [];

  // Check for eslint disable comments for design-system rules
  const hasDesignSystemDisable = /eslint-disable.*(?:design-system|md3-design-system)/.test(content);
  const hasHardcodedColorsDisable = /eslint-disable.*(?:no-hardcoded-colors|md3-hardcoded-colors)/.test(content);

  // Remove comments, @keyframes blocks, and CSS custom property definitions
  let processedContent = content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/@keyframes[\s\S]*?}/g, '')
    .replace(/^[\s]*--[\w-]+\s*:\s*[^;]+;/gm, '');

  // Check for hardcoded px, rem, %
  const hardcodedUnits = /(?<![-\w])(\d+(?:\.\d+)?(?:px|rem|%))(?![\w-])/g;
  let match;
  while ((match = hardcodedUnits.exec(processedContent)) !== null) {
    const value = match[1];
    const lineNumber = processedContent.substring(0, match.index).split('\n').length;
    const lineContent = processedContent.split('\n')[lineNumber - 1];

    // Functional exceptions for layout percentages
    const isLayoutPercentage = /width|height|flex|grid|gap|margin|padding|left|right|top|bottom/.test(lineContent) && value.endsWith('%');

    // Allow certain px values that are standard (1px for borders, etc.)
    const isStandardPx = value === '1px' && /border|outline|box-shadow|text-decoration/.test(lineContent);

    // Allow certain rem values that are standard typography
    const isStandardRem = ['0.75rem', '0.875rem', '1rem', '1.125rem', '1.25rem', '1.5rem'].includes(value) &&
                         /font-size|line-height/.test(lineContent);

    // Allow percentages in color-mix functions
    const isColorMixPercentage = /color-mix/.test(lineContent) && value.endsWith('%');

    // Allow 24px for Material Symbols Outlined icons
    const isIconFontSize = value === '24px' && /fontFamily.*Material Symbols/.test(lineContent);

    if (!hasDesignSystemDisable && !isLayoutPercentage && !isStandardPx && !isStandardRem && !isColorMixPercentage && !isIconFontSize) {
      violations.push({
        type: 'Hardcoded Unit',
        value: value,
        line: lineNumber,
        file: filePath
      });
    }
  }

  // Check for hardcoded hex colors (excluding CSS custom property definitions)
  if (!hasHardcodedColorsDisable && !hasDesignSystemDisable) {
    const hexColors = /#[0-9a-fA-F]{3,8}/g;
    while ((match = hexColors.exec(processedContent)) !== null) {
      const value = match[0];
      const lineNumber = processedContent.substring(0, match.index).split('\n').length;

      // Allow certain standard colors or in specific contexts
      const isAllowedColor = ['#FFFFFF', '#000000', '#666666', '#666', '#333', '#999'].includes(value) ||
                            filePath.includes('stories') || // Storybook documentation
                            filePath.includes('test') || // Test files
                            /fallback|default|placeholder/.test(processedContent.split('\n')[lineNumber - 1]);

      if (!isAllowedColor) {
        violations.push({
          type: 'Hardcoded Hex Color',
          value: value,
          line: lineNumber,
          file: filePath
        });
      }
    }
  }

  // Check for hardcoded rgba (excluding CSS custom property definitions)
  if (!hasHardcodedColorsDisable && !hasDesignSystemDisable) {
    const rgbaColors = /rgba?\([^)]+\)/g;
    while ((match = rgbaColors.exec(processedContent)) !== null) {
      const value = match[0];
      const lineNumber = processedContent.substring(0, match.index).split('\n').length;
      const lineContent = processedContent.split('\n')[lineNumber - 1];

      // Allow rgba with CSS variables (dynamic theming)
      const isCssVariableRgba = /rgba\(var\(--/.test(value);

      // Allow standard scrim/backdrop colors
      const isStandardScrim = /rgba\(0,\s*0,\s*0,\s*0\.\d+\)/.test(value) && /backdrop|background|scrim/.test(lineContent);

      // Allow glass effects
      const isGlassEffect = /rgba\(255,\s*255,\s*255,\s*0\.\d+\)/.test(value) && /glass|blur|backdrop-filter/.test(lineContent);

      // Allow MD3-compliant PDF colors (rgb(...PDF_COLOR_*))
      const isPdfColor = /^rgb\(\.\.\.PDF_COLOR_[A-Z_]+\)$/.test(value.trim());

      if (!isCssVariableRgba && !isStandardScrim && !isGlassEffect && !isPdfColor) {
        violations.push({
          type: 'Hardcoded RGBA Color',
          value: value,
          line: lineNumber,
          file: filePath
        });
      }
    }
  }

  // Check for className usage (excluding material-symbols and allowed patterns)
  const classNameRegex = /className\s*=\s*["'][^"']*["']/g;
  while ((match = classNameRegex.exec(content)) !== null) {
    const classValue = match[0].match(/["']([^"']*)["']/)[1];
    const lineNumber = content.substring(0, match.index).split('\n').length;

    // Allow material-symbols and certain utility classes
    const isAllowedClass = classValue.includes('material-symbols') ||
                          /^m3-/.test(classValue) || // MD3 prefixed classes
                          /test|spec|story/i.test(filePath) || // Test/story files
                          classValue.split(' ').length === 1; // Single utility classes

    if (!isAllowedClass) {
      violations.push({
        type: 'ClassName Usage',
        value: classValue,
        line: lineNumber,
        file: filePath
      });
    }
  }

  return violations;
}

function main() {
  console.log('🔍 Running MD3 Guardrail Check...\n');

  const tsxFiles = findFiles(srcDir, '.tsx');
  const tsFiles = findFiles(srcDir, '.ts');
  const cssFiles = findFiles(srcDir, '.css');
  const allFiles = [...tsxFiles, ...tsFiles, ...cssFiles];

  let totalViolations = 0;
  const allViolations = [];

  for (const file of allFiles) {
    const violations = checkFile(file);
    if (violations.length > 0) {
      console.log(`📁 ${file}:`);
      violations.forEach(v => {
        console.log(`  ❌ ${v.type}: ${v.value} (line ${v.line})`);
      });
      console.log('');
      totalViolations += violations.length;
      allViolations.push(...violations);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`Total files checked: ${allFiles.length}`);
  console.log(`Total violations found: ${totalViolations}`);

  if (totalViolations > 0) {
    console.log('\n❌ MD3 Policy Violations Detected!');
    console.log('Please fix the above issues to comply with MD3 design system policies.');
    process.exit(1);
  } else {
    console.log('\n✅ No MD3 Policy Violations Found!');
  }
}

main();