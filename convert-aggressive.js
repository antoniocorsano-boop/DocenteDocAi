#!/usr/bin/env node

/**
 * Aggressive Tailwind to Inline MD3 Converter
 * Converts ALL className attributes to inline style objects
 * Preserves custom class references in className attribute
 */

const fs = require('fs');
const path = require('path');

function convertFile(filePath) {
  console.log(`\n🔄 Aggressive conversion: ${filePath}\n`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalLines = content.split('\n').length;
  
  // Pattern 1: className with only custom classes (preserve as-is)
  // Pattern 2: className with mix of Tailwind + custom (convert Tailwind, keep custom)
  // Pattern 3: className with only Tailwind (convert to style object, remove className)

  const STYLE_CONVERSIONS = {
    // Typography
    'text-\\[var\\(--md-sys-typescale-headline-small\\)\\]': 'fontSize: "var(--md-sys-typescale-headline-small-size)"',
    'text-\\[var\\(--md-sys-typescale-headline-medium\\)\\]': 'fontSize: "var(--md-sys-typescale-headline-medium-size)"',
    'text-\\[var\\(--md-sys-typescale-body-medium\\)\\]': 'fontSize: "var(--md-sys-typescale-body-medium-size)"',
    'text-\\[var\\(--md-sys-typescale-body-large\\)\\]': 'fontSize: "var(--md-sys-typescale-body-large-size)"',
    'font-\\[var\\(--md-sys-typescale-headline-small-font\\)\\]': 'fontFamily: "var(--md-sys-typescale-headline-small-font)"',
    'font-\\[var\\(--md-sys-typescale-headline-medium-font\\)\\]': 'fontFamily: "var(--md-sys-typescale-headline-medium-font)"',
    'font-\\[var\\(--md-sys-typescale-body-medium-font\\)\\]': 'fontFamily: "var(--md-sys-typescale-body-medium-font)"',
    'font-\\[var\\(--md-sys-typescale-body-large-font\\)\\]': 'fontFamily: "var(--md-sys-typescale-body-large-font)"',
    'font-black': 'fontWeight: "900"',
    'font-bold': 'fontWeight: "bold"',
    'text-xs': 'fontSize: "0.75rem"',
    'text-sm': 'fontSize: "0.875rem"',
    'text-base': 'fontSize: "1rem"',
    'text-lg': 'fontSize: "1.125rem"',

    // Colors  
    'text-\\[var\\(--md-sys-color-on-surface\\)\\]': 'color: "var(--md-sys-color-on-surface)"',
    'text-\\[var\\(--md-sys-color-on-surface\\)\\]-variant': 'color: "var(--md-sys-color-on-surface)"',
    'text-primary': 'color: "var(--md-sys-color-primary)"',
    'text-secondary': 'color: "var(--md-sys-color-secondary)"',
    'text-tertiary': 'color: "var(--md-sys-color-tertiary)"',
    'text-error': 'color: "var(--md-sys-color-error)"',
    'text-center': 'textAlign: "center"',

    // Spacing & layout
    'mr-2': 'marginRight: "0.5rem"',
    'mt-0.5': 'marginTop: "0.125rem"',

    // Transform & animation
    'uppercase': 'textTransform: "uppercase"',
    'lowercase': 'textTransform: "lowercase"',
    'tracking-widest': 'letterSpacing: "0.1em"',
    'tracking-wider': 'letterSpacing: "0.05em"',
    'leading-relaxed': 'lineHeight: "1.625"',
    'leading-tight': 'lineHeight: "1.25"',

    // Overflow & text
    'overflow-hidden': 'overflow: "hidden"',
    'truncate': 'overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"',
    'line-clamp-2': 'display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden"',

    // Cursor
    'cursor-pointer': 'cursor: "pointer"',
    'cursor-default': 'cursor: "default"',

    // Opacity
    'opacity-0': 'opacity: "0"',
    'opacity-30': 'opacity: "0.3"',
    'opacity-50': 'opacity: "0.5"',
    'opacity-70': 'opacity: "0.7"',
    'opacity-80': 'opacity: "0.8"',

    // Transitions
    'transition-all': 'transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)"',
    'transition-colors': 'transition: "color 300ms cubic-bezier(0.4, 0, 0.2, 1)"',
    'transition-transform': 'transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)"',
    'duration-300': '', // Handled with transition
    'group-open:\\w+': '', // Handle with CSS
    'group-hover:\\w+': '', // Handle with CSS
    'hover:\\w+': '', // Handle with CSS
    'focus:\\w+': '', // Handle with CSS

    // Layout
    'inline': 'display: "inline"',
    'block': 'display: "block"',
    'inline-block': 'display: "inline-block"',
    'w-full': 'width: "100%"',
    'w-10': 'width: "2.5rem"',
    'w-20': 'width: "5rem"',
    'h-10': 'height: "2.5rem"',
    'h-20': 'height: "5rem"',
    'min-w-0': 'minWidth: "0"',
    'flex-shrink-0': 'flexShrink: "0"',
    'flex-grow': 'flexGrow: "1"',
    'flex-1': 'flex: "1"',

    // Alignment
    'items-start': 'alignItems: "flex-start"',
    'items-end': 'alignItems: "flex-end"',
    'items-center': 'alignItems: "center"',
    'justify-start': 'justifyContent: "flex-start"',
    'justify-end': 'justifyContent: "flex-end"',
    'justify-center': 'justifyContent: "center"',
    'justify-between': 'justifyContent: "space-between"',

    // Borders
    'border-l-4': 'borderLeft: "4px solid"',
    'border-l': 'borderLeft: "1px solid"',
    'border-r': 'borderRight: "1px solid"',
    'border-t': 'borderTop: "1px solid"',
    'border-b': 'borderBottom: "1px solid"',
    'border-none': 'border: "none"',

    // List styles
    'list-none': 'listStyle: "none"',

    // Visibility
    'hidden': 'display: "none"',
  };

  let conversionCount = 0;
  const replacements = [];

  // Process each line
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const classNameMatch = line.match(/className="([^"]*)"/);
    
    if (classNameMatch) {
      const classString = classNameMatch[1];
      const classes = classString.split(/\s+/).filter(c => c);

      // Separate custom classes from Tailwind/styling classes
      const customClasses = classes.filter(c => {
        // Keep classes that start with custom prefixes or contain -
        return c.match(/^(help-modal|m3-|material-symbols|group|faq-item|expanded)/) ||
               // Or classes that don't match Tailwind patterns
               !c.match(/^(flex|gap|space|p-|m-|mb-|mt-|ml-|mr-|px-|py-|border|rounded|bg-|text-|font-|leading|tracking|uppercase|lowercase|grid|opacity|w-|h-|list-|cursor|transition|duration|group|hover|focus|md:|lg:|transition-|hidden|block|inline|items-|justify-|min-w|flex-shrink|flex-grow|list-none|line-clamp|truncate|overflow|overflow-hidden)/);
      });

      const tailwindClasses = classes.filter(c => !customClasses.includes(c));

      if (tailwindClasses.length > 0) {
        // Generate inline styles
        const styles = [];
        for (const twClass of tailwindClasses) {
          // Handle complex patterns
          if (twClass.match(/^text-\[var/)) {
            const match = twClass.match(/text-\[(var\([^)]+\))\]/);
            if (match) styles.push(`color: "${match[1]}"`);
          } else if (twClass.match(/^font-\[var/)) {
            const match = twClass.match(/font-\[(var\([^)]+\))\]/);
            if (match) styles.push(`fontFamily: "${match[1]}"`);
          } else if (twClass.match(/^bg-\[var/)) {
            const match = twClass.match(/bg-\[(var\([^)]+\))\]/);
            if (match) styles.push(`backgroundColor: "${match[1]}"`);
          } else if (twClass.match(/^rounded-\[var/)) {
            const match = twClass.match(/rounded-\[(var\([^)]+\))\]/);
            if (match) styles.push(`borderRadius: "${match[1]}"`);
          } else if (twClass.match(/^border-l-\d+/)) {
            const width = twClass.match(/border-l-(\d+)/)[1];
            styles.push(`borderLeft: "${width}px solid"`);
          } else if (twClass.match(/^border-[a-z]-\d+/)) {
            const dir = twClass.match(/border-([a-z])-/)[1];
            const width = twClass.match(/-(\d+)$/)[1];
            const dirMap = { t: 'Top', r: 'Right', b: 'Bottom', l: 'Left' };
            styles.push(`border${dirMap[dir]}: "${width}px solid"`);
          } else if (twClass.match(/^md:/)) {
            // Skip responsive classes for now
            customClasses.push(twClass);
          } else if (twClass.match(/^group|^hover:|^focus:|^group-|^transition-|^duration-/)) {
            // Skip pseudo-class handlers
            customClasses.push(twClass);
          } else {
            // Look up in style conversion map
            for (const [pattern, styleCode] of Object.entries(STYLE_CONVERSIONS)) {
              if (twClass.match(new RegExp(`^${pattern}$`))) {
                if (styleCode) styles.push(styleCode);
                break;
              }
            }
          }
        }

        // Rebuild the element with style prop
        if (styles.length > 0) {
          const styleString = styles.join(", ");
          let newLine = line;

          // Build new className (only custom) or remove it
          if (customClasses.length > 0) {
            const newClassName = customClasses.join(" ");
            newLine = line.replace(
              classNameMatch[0],
              `className="${newClassName}" style={{ ${styleString} }}`
            );
          } else {
            // Check if there's already a style attribute
            const existingStyleMatch = newLine.match(/style={{([^}]+)}}/);
            if (existingStyleMatch) {
              // Merge with existing style
              const existingStyles = existingStyleMatch[1].trim();
              newLine = newLine.replace(
                classNameMatch[0],
                `style={{ ${existingStyles}, ${styleString} }}`
              );
            } else {
              // Replace className with style
              newLine = newLine.replace(
                classNameMatch[0],
                `style={{ ${styleString} }}`
              );
            }
          }

          lines[i] = newLine;
          conversionCount++;
        }
      }
    }
  }

  content = lines.join('\n');
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`✨ Converted ${conversionCount} className attributes to inline styles!\n`);
  return { success: true, count: conversionCount };
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node convert-aggressive.js <filepath>');
  process.exit(1);
}

const filePath = args[0];
const absolutePath = path.resolve(filePath);
const result = convertFile(absolutePath);

process.exit(result.success ? 0 : 1);
