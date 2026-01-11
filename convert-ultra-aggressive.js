#!/usr/bin/env node

/**
 * Ultra-aggressive Tailwind to MD3 Converter - V2
 * This version is more intelligent about mixed className patterns
 */

const fs = require('fs');
const path = require('path');

const TAILWIND_TO_STYLE = {
  // Single word Tailwind classes
  'block': 'display: "block"',
  'inline': 'display: "inline"',
  'inline-block': 'display: "inline-block"',
  'flex': 'display: "flex"',
  'inline-flex': 'display: "inline-flex"',
  'grid': 'display: "grid"',
  'hidden': 'display: "none"',
  'w-full': 'width: "100%"',
  'h-full': 'height: "100%"',
  'overflow-hidden': 'overflow: "hidden"',
  'overflow-auto': 'overflow: "auto"',
  'list-none': 'listStyle: "none"',
  'cursor-pointer': 'cursor: "pointer"',
  'cursor-default': 'cursor: "default"',

  // Spacing classes - must do longer patterns first
  'space-y-8': 'gap: "var(--md-sys-spacing-8)"',
  'space-y-6': 'gap: "var(--md-sys-spacing-6)"',
  'space-y-4': 'gap: "var(--md-sys-spacing-4)"',
  'space-y-3': 'gap: "var(--md-sys-spacing-3)"',
  'space-y-2': 'gap: "var(--md-sys-spacing-2)"',
  'space-y-1': 'gap: "var(--md-sys-spacing-1)"',

  // Padding
  'p-8': 'padding: "var(--md-sys-spacing-8)"',
  'p-6': 'padding: "var(--md-sys-spacing-6)"',
  'p-5': 'padding: "var(--md-sys-spacing-5)"',
  'p-4': 'padding: "var(--md-sys-spacing-4)"',
  'p-3': 'padding: "var(--md-sys-spacing-3)"',
  'p-2': 'padding: "var(--md-sys-spacing-2)"',
  'p-1': 'padding: "var(--md-sys-spacing-1)"',
  'px-4': 'paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)"',
  'py-4': 'paddingTop: "var(--md-sys-spacing-4)", paddingBottom: "var(--md-sys-spacing-4)"',
  'pl-5': 'paddingLeft: "var(--md-sys-spacing-5)"',
  'pl-6': 'paddingLeft: "var(--md-sys-spacing-6)"',
  'pr-4': 'paddingRight: "var(--md-sys-spacing-4)"',
  'pt-0': 'paddingTop: "0"',
  'pb-6': 'paddingBottom: "var(--md-sys-spacing-6)"',

  // Margin
  'mb-8': 'marginBottom: "var(--md-sys-spacing-8)"',
  'mb-6': 'marginBottom: "var(--md-sys-spacing-6)"',
  'mb-4': 'marginBottom: "var(--md-sys-spacing-4)"',
  'mb-3': 'marginBottom: "var(--md-sys-spacing-3)"',
  'mb-2': 'marginBottom: "var(--md-sys-spacing-2)"',
  'mt-6': 'marginTop: "var(--md-sys-spacing-6)"',
  'mt-4': 'marginTop: "var(--md-sys-spacing-4)"',
  'mt-3': 'marginTop: "var(--md-sys-spacing-3)"',
  'mt-2': 'marginTop: "var(--md-sys-spacing-2)"',
  'mx-auto': 'marginLeft: "auto", marginRight: "auto"',
  'mr-2': 'marginRight: "0.5rem"',
  'ml-2': 'marginLeft: "0.5rem"',

  // Gap
  'gap-8': 'gap: "var(--md-sys-spacing-8)"',
  'gap-6': 'gap: "var(--md-sys-spacing-6)"',
  'gap-4': 'gap: "var(--md-sys-spacing-4)"',
  'gap-3': 'gap: "var(--md-sys-spacing-3)"',
  'gap-2': 'gap: "var(--md-sys-spacing-2)"',
  'gap-1': 'gap: "var(--md-sys-spacing-1)"',

  // Flexbox
  'flex-row': 'flexDirection: "row"',
  'flex-col': 'flexDirection: "column"',
  'flex-wrap': 'flexWrap: "wrap"',
  'flex-nowrap': 'flexWrap: "nowrap"',
  'flex-grow': 'flexGrow: "1"',
  'flex-shrink': 'flexShrink: "1"',
  'flex-shrink-0': 'flexShrink: "0"',
  'flex-1': 'flex: "1"',
  'items-start': 'alignItems: "flex-start"',
  'items-end': 'alignItems: "flex-end"',
  'items-center': 'alignItems: "center"',
  'items-baseline': 'alignItems: "baseline"',
  'items-stretch': 'alignItems: "stretch"',
  'justify-start': 'justifyContent: "flex-start"',
  'justify-end': 'justifyContent: "flex-end"',
  'justify-center': 'justifyContent: "center"',
  'justify-between': 'justifyContent: "space-between"',
  'justify-around': 'justifyContent: "space-around"',

  // Grid
  'grid-cols-1': 'gridTemplateColumns: "1fr"',
  'grid-cols-2': 'gridTemplateColumns: "1fr 1fr"',
  'grid-cols-3': 'gridTemplateColumns: "repeat(3, 1fr)"',
  'grid-cols-4': 'gridTemplateColumns: "repeat(4, 1fr)"',
  'grid-rows-1': 'gridTemplateRows: "1fr"',

  // Text
  'text-xs': 'fontSize: "0.75rem"',
  'text-sm': 'fontSize: "0.875rem"',
  'text-base': 'fontSize: "1rem"',
  'text-lg': 'fontSize: "1.125rem"',
  'text-xl': 'fontSize: "1.25rem"',
  'text-2xl': 'fontSize: "1.5rem"',
  'text-center': 'textAlign: "center"',
  'text-left': 'textAlign: "left"',
  'text-right': 'textAlign: "right"',

  // Font
  'font-bold': 'fontWeight: "bold"',
  'font-black': 'fontWeight: "900"',
  'font-normal': 'fontWeight: "normal"',
  'font-medium': 'fontWeight: "500"',

  // Text transform
  'uppercase': 'textTransform: "uppercase"',
  'lowercase': 'textTransform: "lowercase"',
  'capitalize': 'textTransform: "capitalize"',

  // Letter spacing
  'tracking-widest': 'letterSpacing: "0.1em"',
  'tracking-wider': 'letterSpacing: "0.05em"',
  'tracking-wide': 'letterSpacing: "0.025em"',
  'tracking-normal': 'letterSpacing: "0"',
  'tracking-tight': 'letterSpacing: "-0.005em"',

  // Line height
  'leading-3': 'lineHeight: "0.75rem"',
  'leading-4': 'lineHeight: "1rem"',
  'leading-5': 'lineHeight: "1.25rem"',
  'leading-6': 'lineHeight: "1.5rem"',
  'leading-7': 'lineHeight: "1.75rem"',
  'leading-8': 'lineHeight: "2rem"',
  'leading-9': 'lineHeight: "2.25rem"',
  'leading-10': 'lineHeight: "2.5rem"',
  'leading-none': 'lineHeight: "1"',
  'leading-tight': 'lineHeight: "1.25"',
  'leading-snug': 'lineHeight: "1.375"',
  'leading-normal': 'lineHeight: "1.5"',
  'leading-relaxed': 'lineHeight: "1.625"',
  'leading-loose': 'lineHeight: "2"',

  // Border
  'border': 'border: "1px solid var(--md-sys-color-outline)"',
  'border-none': 'border: "none"',
  'border-t': 'borderTop: "1px solid var(--md-sys-color-outline)"',
  'border-b': 'borderBottom: "1px solid var(--md-sys-color-outline)"',
  'border-l': 'borderLeft: "1px solid var(--md-sys-color-outline)"',
  'border-r': 'borderRight: "1px solid var(--md-sys-color-outline)"',
  'border-t-4': 'borderTop: "4px solid var(--md-sys-color-outline)"',
  'border-b-4': 'borderBottom: "4px solid var(--md-sys-color-outline)"',
  'border-l-4': 'borderLeft: "4px solid"',
  'border-r-4': 'borderRight: "4px solid"',

  // Rounded
  'rounded': 'borderRadius: "0.375rem"',
  'rounded-none': 'borderRadius: "0"',
  'rounded-sm': 'borderRadius: "0.125rem"',
  'rounded-md': 'borderRadius: "0.375rem"',
  'rounded-lg': 'borderRadius: "0.5rem"',
  'rounded-xl': 'borderRadius: "0.75rem"',
  'rounded-2xl': 'borderRadius: "1rem"',
  'rounded-3xl': 'borderRadius: "1.5rem"',
  'rounded-full': 'borderRadius: "9999px"',

  // Opacity
  'opacity-0': 'opacity: "0"',
  'opacity-10': 'opacity: "0.1"',
  'opacity-20': 'opacity: "0.2"',
  'opacity-25': 'opacity: "0.25"',
  'opacity-30': 'opacity: "0.3"',
  'opacity-40': 'opacity: "0.4"',
  'opacity-50': 'opacity: "0.5"',
  'opacity-60': 'opacity: "0.6"',
  'opacity-70': 'opacity: "0.7"',
  'opacity-75': 'opacity: "0.75"',
  'opacity-80': 'opacity: "0.8"',
  'opacity-90': 'opacity: "0.9"',
  'opacity-100': 'opacity: "1"',

  // Transitions
  'transition': 'transition: "all 300ms"',
  'transition-all': 'transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)"',
  'transition-colors': 'transition: "color 300ms"',
  'transition-transform': 'transition: "transform 300ms"',
  'transition-opacity': 'transition: "opacity 300ms"',

  // Colors (text/bg/border)
  'text-primary': 'color: "var(--md-sys-color-primary)"',
  'text-secondary': 'color: "var(--md-sys-color-secondary)"',
  'text-tertiary': 'color: "var(--md-sys-color-tertiary)"',
  'text-error': 'color: "var(--md-sys-color-error)"',
  'text-success': 'color: "var(--md-sys-color-success)"',
  'text-warning': 'color: "var(--md-sys-color-warning)"',
  'text-info': 'color: "var(--md-sys-color-info)"',
  'text-on-primary': 'color: "var(--md-sys-color-on-primary)"',
  'text-on-secondary': 'color: "var(--md-sys-color-on-secondary)"',
  'text-on-surface': 'color: "var(--md-sys-color-on-surface)"',
  'text-on-surface-variant': 'color: "var(--md-sys-color-on-surface-variant)"',

  'bg-primary': 'backgroundColor: "var(--md-sys-color-primary)"',
  'bg-secondary': 'backgroundColor: "var(--md-sys-color-secondary)"',
  'bg-tertiary': 'backgroundColor: "var(--md-sys-color-tertiary)"',
  'bg-surface': 'backgroundColor: "var(--md-sys-color-surface)"',
  'bg-surface-dim': 'backgroundColor: "var(--md-sys-color-surface-dim)"',
  'bg-surface-bright': 'backgroundColor: "var(--md-sys-color-surface-bright)"',
  'bg-surface-container': 'backgroundColor: "var(--md-sys-color-surface-container)"',
  'bg-surface-container-low': 'backgroundColor: "var(--md-sys-color-surface-container-low)"',
  'bg-surface-container-high': 'backgroundColor: "var(--md-sys-color-surface-container-high)"',
  'bg-primary-container': 'backgroundColor: "var(--md-sys-color-primary-container)"',
  'bg-secondary-container': 'backgroundColor: "var(--md-sys-color-secondary-container)"',
  'bg-tertiary-container': 'backgroundColor: "var(--md-sys-color-tertiary-container)"',
  'bg-error-container': 'backgroundColor: "var(--md-sys-color-error-container)"',
  'bg-white': 'backgroundColor: "white"',
  'bg-black': 'backgroundColor: "black"',
  'bg-transparent': 'backgroundColor: "transparent"',

  'border-primary': 'borderColor: "var(--md-sys-color-primary)"',
  'border-secondary': 'borderColor: "var(--md-sys-color-secondary)"',
  'border-tertiary': 'borderColor: "var(--md-sys-color-tertiary)"',
  'border-outline': 'borderColor: "var(--md-sys-color-outline)"',
  'border-outline-variant': 'borderColor: "var(--md-sys-color-outline-variant)"',

  // Size/width/height
  'w-0': 'width: "0"',
  'w-1': 'width: "0.25rem"',
  'w-2': 'width: "0.5rem"',
  'w-3': 'width: "0.75rem"',
  'w-4': 'width: "1rem"',
  'w-5': 'width: "1.25rem"',
  'w-6': 'width: "1.5rem"',
  'w-8': 'width: "2rem"',
  'w-10': 'width: "2.5rem"',
  'w-12': 'width: "3rem"',
  'w-16': 'width: "4rem"',
  'w-20': 'width: "5rem"',
  'w-24': 'width: "6rem"',
  'w-32': 'width: "8rem"',
  'w-max': 'width: "max-content"',
  'w-min': 'width: "min-content"',
  'w-fit': 'width: "fit-content"',
  'h-0': 'height: "0"',
  'h-1': 'height: "0.25rem"',
  'h-2': 'height: "0.5rem"',
  'h-3': 'height: "0.75rem"',
  'h-4': 'height: "1rem"',
  'h-5': 'height: "1.25rem"',
  'h-6': 'height: "1.5rem"',
  'h-8': 'height: "2rem"',
  'h-10': 'height: "2.5rem"',
  'h-12': 'height: "3rem"',
  'h-16': 'height: "4rem"',
  'h-20': 'height: "5rem"',
  'h-24': 'height: "6rem"',
  'h-32': 'height: "8rem"',
  'h-full': 'height: "100%"',
  'h-screen': 'height: "100vh"',
  'min-w-0': 'minWidth: "0"',
  'min-h-0': 'minHeight: "0"',
  'min-h-screen': 'minHeight: "100vh"',
  'max-w-full': 'maxWidth: "100%"',
  'max-h-full': 'maxHeight: "100%"',

  // Scrolling
  'overflow-x-auto': 'overflowX: "auto"',
  'overflow-y-auto': 'overflowY: "auto"',
  'overflow-x-hidden': 'overflowX: "hidden"',
  'overflow-y-hidden': 'overflowY: "hidden"',

  // Whitespace
  'truncate': 'overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"',
  'whitespace-normal': 'whiteSpace: "normal"',
  'whitespace-nowrap': 'whiteSpace: "nowrap"',
  'whitespace-pre': 'whiteSpace: "pre"',
  'whitespace-pre-wrap': 'whiteSpace: "pre-wrap"',
  'whitespace-pre-line': 'whiteSpace: "pre-line"',
};

function convertFile(filePath) {
  console.log(`\n🔄 Ultra-aggressive conversion (V2): ${filePath}\n`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let conversionCount = 0;

  // Process all className patterns
  content = content.replace(/className="([^"]*)"/g, (match, classString) => {
    if (!classString) return match;

    const classes = classString.split(/\s+/).filter(c => c);
    const customClasses = [];
    const styleArray = [];

    for (const cls of classes) {
      // Check if it's a custom class (should be preserved)
      const isCustom = 
        cls.startsWith('help-modal-') ||
        cls.startsWith('m3-') ||
        cls.startsWith('material-symbols') ||
        cls.match(/^(group|expanded|faq-item|overflow-hidden|list-none)$/) ||
        cls.match(/^(hover:|focus:|group-|md:|lg:|sm:)/) || // Pseudo-classes and responsive
        cls.match(/^(text-\[|font-\[|bg-\[|rounded-\[|border-\[|bg-.*\/\d+|border-.*\/\d+|text-.*-variant)/); // Dynamic MD3 patterns

      if (isCustom) {
        customClasses.push(cls);
      } else {
        // Try to convert to style
        if (TAILWIND_TO_STYLE[cls]) {
          styleArray.push(TAILWIND_TO_STYLE[cls]);
        } else {
          // For unmatched, keep as custom (might be custom CSS)
          customClasses.push(cls);
        }
      }
    }

    if (styleArray.length > 0) {
      conversionCount++;
      if (customClasses.length > 0) {
        // Has both styles and custom classes
        return `className="${customClasses.join(' ')}" style={{ ${styleArray.join(', ')} }}`;
      } else {
        // Only styles
        return `style={{ ${styleArray.join(', ')} }}`;
      }
    }

    return match;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`✨ Converted ${conversionCount} className attributes!\n`);
  return { success: true, count: conversionCount };
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node convert-ultra-aggressive.js <filepath>');
  process.exit(1);
}

const filePath = args[0];
const absolutePath = path.resolve(filePath);
const result = convertFile(absolutePath);

process.exit(result.success ? 0 : 1);
