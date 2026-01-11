import * as fs from 'fs';
import * as path from 'path';

const srcDir = path.join(__dirname, '..', 'src');

function reportHardcoded(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues: string[] = [];

  // Check for hardcoded colors (hex, rgba)
  const colorRegex = /#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/g;
  const colors = content.match(colorRegex);
  if (colors) {
    issues.push(`Hardcoded colors: ${colors.join(', ')}`);
  }

  // Check for hardcoded spacing (px, rem, %)
  const spacingRegex = /\b\d+(px|rem|%)\b/g;
  const spacings = content.match(spacingRegex);
  if (spacings) {
    issues.push(`Hardcoded spacing: ${spacings.join(', ')}`);
  }

  if (issues.length > 0) {
    console.log(`File: ${filePath}`);
    issues.forEach(issue => console.log(`  - ${issue}`));
  }
}

function scanDir(dir: string): void {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.css')) {
      reportHardcoded(filePath);
    }
  });
}

console.log('Dry-run report for hardcoded values in /src:');
scanDir(srcDir);
console.log('Report complete. No files modified.');