#!/usr/bin/env node

/**
 * Intelligent Tailwind to MD3 Converter for Individual Files
 * Converts className attributes with Tailwind utilities to inline style objects with MD3 tokens
 * Preserves custom CSS classes (help-modal-*, m3-*, material-symbols-outlined)
 */

const fs = require('fs');
const path = require('path');

// Mapping of Tailwind patterns to MD3 inline styles
const TAILWIND_PATTERNS = [
  // Spacing patterns
  {
    pattern: /className="space-y-6"/g,
    replacement: 'style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-6)" }}',
    description: 'space-y-6 → flex column with gap-6'
  },
  {
    pattern: /className="space-y-4"/g,
    replacement: 'style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-4)" }}',
    description: 'space-y-4 → flex column with gap-4'
  },
  {
    pattern: /className="space-y-3"/g,
    replacement: 'style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-3)" }}',
    description: 'space-y-3 → flex column with gap-3'
  },
  {
    pattern: /className="space-y-2"/g,
    replacement: 'style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-2)" }}',
    description: 'space-y-2 → flex column with gap-2'
  },
  {
    pattern: /className="space-y-1"/g,
    replacement: 'style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-1)" }}',
    description: 'space-y-1 → flex column with gap-1'
  },

  // Flex patterns
  {
    pattern: /className="flex flex-col"/g,
    replacement: 'style={{ display: "flex", flexDirection: "column" }}',
    description: 'flex flex-col → flex column'
  },
  {
    pattern: /className="flex flex-row"/g,
    replacement: 'style={{ display: "flex", flexDirection: "row" }}',
    description: 'flex flex-row → flex row'
  },
  {
    pattern: /className="flex"/g,
    replacement: 'style={{ display: "flex" }}',
    description: 'flex → display flex'
  },
  {
    pattern: /className="flex-col"/g,
    replacement: 'style={{ flexDirection: "column" }}',
    description: 'flex-col → flexDirection column'
  },
  {
    pattern: /className="flex-row"/g,
    replacement: 'style={{ flexDirection: "row" }}',
    description: 'flex-row → flexDirection row'
  },

  // Gap patterns
  {
    pattern: /className="gap-8"/g,
    replacement: 'style={{ gap: "var(--md-sys-spacing-8)" }}',
    description: 'gap-8 → gap spacing-8'
  },
  {
    pattern: /className="gap-6"/g,
    replacement: 'style={{ gap: "var(--md-sys-spacing-6)" }}',
    description: 'gap-6 → gap spacing-6'
  },
  {
    pattern: /className="gap-4"/g,
    replacement: 'style={{ gap: "var(--md-sys-spacing-4)" }}',
    description: 'gap-4 → gap spacing-4'
  },
  {
    pattern: /className="gap-3"/g,
    replacement: 'style={{ gap: "var(--md-sys-spacing-3)" }}',
    description: 'gap-3 → gap spacing-3'
  },
  {
    pattern: /className="gap-2"/g,
    replacement: 'style={{ gap: "var(--md-sys-spacing-2)" }}',
    description: 'gap-2 → gap spacing-2'
  },

  // Padding patterns
  {
    pattern: /className="p-8"/g,
    replacement: 'style={{ padding: "var(--md-sys-spacing-8)" }}',
    description: 'p-8 → padding-8'
  },
  {
    pattern: /className="p-6"/g,
    replacement: 'style={{ padding: "var(--md-sys-spacing-6)" }}',
    description: 'p-6 → padding-6'
  },
  {
    pattern: /className="p-5"/g,
    replacement: 'style={{ padding: "var(--md-sys-spacing-5)" }}',
    description: 'p-5 → padding-5'
  },
  {
    pattern: /className="p-4"/g,
    replacement: 'style={{ padding: "var(--md-sys-spacing-4)" }}',
    description: 'p-4 → padding-4'
  },
  {
    pattern: /className="p-3"/g,
    replacement: 'style={{ padding: "var(--md-sys-spacing-3)" }}',
    description: 'p-3 → padding-3'
  },
  {
    pattern: /className="pl-5"/g,
    replacement: 'style={{ paddingLeft: "var(--md-sys-spacing-5)" }}',
    description: 'pl-5 → paddingLeft-5'
  },
  {
    pattern: /className="pr-4"/g,
    replacement: 'style={{ paddingRight: "var(--md-sys-spacing-4)" }}',
    description: 'pr-4 → paddingRight-4'
  },
  {
    pattern: /className="pb-6"/g,
    replacement: 'style={{ paddingBottom: "var(--md-sys-spacing-6)" }}',
    description: 'pb-6 → paddingBottom-6'
  },
  {
    pattern: /className="pt-0"/g,
    replacement: 'style={{ paddingTop: "0" }}',
    description: 'pt-0 → paddingTop 0'
  },

  // Margin patterns
  {
    pattern: /className="mb-8"/g,
    replacement: 'style={{ marginBottom: "var(--md-sys-spacing-8)" }}',
    description: 'mb-8 → marginBottom-8'
  },
  {
    pattern: /className="mb-6"/g,
    replacement: 'style={{ marginBottom: "var(--md-sys-spacing-6)" }}',
    description: 'mb-6 → marginBottom-6'
  },
  {
    pattern: /className="mb-4"/g,
    replacement: 'style={{ marginBottom: "var(--md-sys-spacing-4)" }}',
    description: 'mb-4 → marginBottom-4'
  },
  {
    pattern: /className="mt-4"/g,
    replacement: 'style={{ marginTop: "var(--md-sys-spacing-4)" }}',
    description: 'mt-4 → marginTop-4'
  },
  {
    pattern: /className="mt-6"/g,
    replacement: 'style={{ marginTop: "var(--md-sys-spacing-6)" }}',
    description: 'mt-6 → marginTop-6'
  },
  {
    pattern: /className="mx-auto"/g,
    replacement: 'style={{ marginLeft: "auto", marginRight: "auto" }}',
    description: 'mx-auto → margin left right auto'
  },

  // Border patterns
  {
    pattern: /className="border"/g,
    replacement: 'style={{ border: "1px solid var(--md-sys-color-outline)" }}',
    description: 'border → border 1px outline'
  },
  {
    pattern: /className="border-b"/g,
    replacement: 'style={{ borderBottom: "1px solid var(--md-sys-color-outline-variant)" }}',
    description: 'border-b → borderBottom'
  },
  {
    pattern: /className="border-l"/g,
    replacement: 'style={{ borderLeft: "1px solid var(--md-sys-color-outline)" }}',
    description: 'border-l → borderLeft'
  },
  {
    pattern: /className="border-t"/g,
    replacement: 'style={{ borderTop: "1px solid var(--md-sys-color-outline)" }}',
    description: 'border-t → borderTop'
  },

  // Rounded/Border radius patterns
  {
    pattern: /className="rounded-full"/g,
    replacement: 'style={{ borderRadius: "9999px" }}',
    description: 'rounded-full → borderRadius full'
  },

  // List patterns
  {
    pattern: /className="list-disc"/g,
    replacement: 'style={{ listStyleType: "disc" }}',
    description: 'list-disc → listStyleType disc'
  },

  // Opacity patterns
  {
    pattern: /className="opacity-80"/g,
    replacement: 'style={{ opacity: 0.8 }}',
    description: 'opacity-80 → opacity 0.8'
  },
  {
    pattern: /className="opacity-70"/g,
    replacement: 'style={{ opacity: 0.7 }}',
    description: 'opacity-70 → opacity 0.7'
  },
  {
    pattern: /className="opacity-50"/g,
    replacement: 'style={{ opacity: 0.5 }}',
    description: 'opacity-50 → opacity 0.5'
  },

  // Cursor patterns
  {
    pattern: /className="cursor-pointer"/g,
    replacement: 'style={{ cursor: "pointer" }}',
    description: 'cursor-pointer → cursor pointer'
  },
];

// Complex patterns that need regex replacement with capture groups
const COMPLEX_PATTERNS = [
  // Handle className with complex tailwind + custom classes
  {
    name: 'className with space-y and other classes (preserve custom)',
    pattern: /className="([^"]*space-y-\d+[^"]*)"/g,
    replace: (match, classes) => {
      const classParts = classes.split(/\s+/);
      const tailwindSpacing = classParts.find(c => /^space-y-\d+$/.test(c));
      const customClasses = classParts.filter(c => !c.match(/^(space-y|flex|gap|p-|m-|rounded|border|list|opacity|cursor|w-|h-|text-|font-|leading|tracking|uppercase|lowercase|grid|md:|lg:|-|-)/));
      
      if (customClasses.length > 0) {
        return `className="${customClasses.join(' ')}" style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-${tailwindSpacing.split('-')[2]})" }}`;
      }
      return match;
    }
  },

  // Handle className with border-l-4 (left border with width/color)
  {
    name: 'border-l-4 with color',
    pattern: /className="border-l-4 border-l-(primary|secondary|tertiary|error|warning|success|info)"/g,
    replace: (match) => {
      const colorMatch = match.match(/border-l-(primary|secondary|tertiary|error|warning|success|info)/);
      const color = colorMatch ? colorMatch[1] : 'primary';
      return `style={{ borderLeft: "4px solid var(--md-sys-color-${color})" }}`;
    }
  },

  // Grid patterns: grid grid-cols-1 md:grid-cols-2
  {
    name: 'grid layout patterns',
    pattern: /className="grid grid-cols-1( md:grid-cols-2)?"/g,
    replace: (match) => {
      if (match.includes('md:')) {
        return 'style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}';
      }
      return 'style={{ display: "grid", gridTemplateColumns: "1fr" }}';
    }
  },
];

function convertFile(filePath) {
  console.log(`\n📄 Converting: ${filePath}\n`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let replacementCount = 0;

  // Apply simple patterns first
  for (const tailwindPattern of TAILWIND_PATTERNS) {
    const matches = content.match(tailwindPattern.pattern);
    if (matches) {
      content = content.replace(tailwindPattern.pattern, tailwindPattern.replacement);
      const count = matches.length;
      replacementCount += count;
      console.log(`✅ ${tailwindPattern.description} (${count} matches)`);
    }
  }

  // Apply complex patterns
  for (const complexPattern of COMPLEX_PATTERNS) {
    const matches = content.match(complexPattern.pattern);
    if (matches) {
      content = content.replace(complexPattern.pattern, complexPattern.replace);
      const count = matches.length;
      replacementCount += count;
      console.log(`✅ ${complexPattern.name} (${count} matches)`);
    }
  }

  // Write the converted file
  fs.writeFileSync(filePath, content, 'utf8');

  if (replacementCount > 0) {
    console.log(`\n✨ Successfully converted ${replacementCount} Tailwind patterns!\n`);
    return { success: true, count: replacementCount };
  } else {
    console.log('\n⚠️  No Tailwind patterns found to convert.\n');
    return { success: true, count: 0 };
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node convert-tailwind-file.js <filepath>');
  process.exit(1);
}

const filePath = args[0];
const absolutePath = path.resolve(filePath);
const result = convertFile(absolutePath);

process.exit(result.success ? 0 : 1);
