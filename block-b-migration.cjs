const fs = require('fs');
const path = require('path');

// Block B Migration: Convert className to inline styles
function migrateClassNameToStyles(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Common Tailwind class mappings to MD3 tokens
  const CLASS_MAPPINGS = {
    // Spacing
    'p-1': 'padding: \'var(--md-sys-spacing-1)\'',
    'p-2': 'padding: \'var(--md-sys-spacing-2)\'',
    'p-3': 'padding: \'var(--md-sys-spacing-3)\'',
    'p-4': 'padding: \'var(--md-sys-spacing-4)\'',
    'p-6': 'padding: \'var(--md-sys-spacing-6)\'',
    'p-8': 'padding: \'var(--md-sys-spacing-8)\'',

    // Margins
    'm-1': 'margin: \'var(--md-sys-spacing-1)\'',
    'm-2': 'margin: \'var(--md-sys-spacing-2)\'',
    'mb-2': 'marginBottom: \'var(--md-sys-spacing-2)\'',
    'mb-4': 'marginBottom: \'var(--md-sys-spacing-4)\'',
    'mt-4': 'marginTop: \'var(--md-sys-spacing-4)\'',
    'mr-2': 'marginRight: \'var(--md-sys-spacing-2)\'',
    'ml-2': 'marginLeft: \'var(--md-sys-spacing-2)\'',

    // Colors
    'bg-primary': 'backgroundColor: \'var(--md-sys-color-primary)\'',
    'bg-surface': 'backgroundColor: \'var(--md-sys-color-surface)\'',
    'text-primary': 'color: \'var(--md-sys-color-primary)\'',
    'text-on-primary': 'color: \'var(--md-sys-color-on-primary)\'',
    'text-surface': 'color: \'var(--md-sys-color-on-surface)\'',

    // Borders
    'border': 'border: \'1px solid var(--md-sys-color-outline)\'',
    'rounded': 'borderRadius: \'var(--md-sys-shape-corner-small)\'',
    'rounded-lg': 'borderRadius: \'var(--md-sys-shape-corner-large)\'',

    // Layout
    'flex': 'display: \'flex\'',
    'grid': 'display: \'grid\'',
    'hidden': 'display: \'none\'',
    'block': 'display: \'block\'',

    // Flexbox
    'items-center': 'alignItems: \'center\'',
    'justify-center': 'justifyContent: \'center\'',
    'justify-between': 'justifyContent: \'space-between\'',
    'flex-col': 'flexDirection: \'column\'',
    'flex-1': 'flex: \'1\'',

    // Dimensions
    'w-full': 'width: \'100%\'',
    'h-full': 'height: \'100%\'',
    'min-h-screen': 'minHeight: \'100vh\''
  };

  // Find className attributes
  const classNameRegex = /className\s*=\s*['"]([^'"]*)['"]/g;
  let match;

  while ((match = classNameRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const classString = match[1];
    const classes = classString.split(/\s+/).filter(cls => cls.trim());

    // Convert classes to style properties
    const styleProps = [];
    classes.forEach(cls => {
      if (CLASS_MAPPINGS[cls]) {
        styleProps.push(CLASS_MAPPINGS[cls]);
      }
    });

    if (styleProps.length > 0) {
      // Create style object
      const styleObject = `{${styleProps.join(', ')}}`;

      // Replace className with style
      const beforeClassName = content.substring(0, match.index);
      const afterClassName = content.substring(match.index + fullMatch.length);

      // Check if there's already a style attribute
      const styleRegex = /style\s*=\s*\{[^}]*\}/;
      const existingStyleMatch = beforeClassName.match(styleRegex);

      if (existingStyleMatch) {
        // Merge with existing style
        const existingStyle = existingStyleMatch[0];
        const mergedStyle = existingStyle.replace(/\}\s*$/, `, ${styleProps.join(', ')}}`);
        content = beforeClassName.replace(existingStyle, mergedStyle) + afterClassName;
      } else {
        // Add new style attribute
        content = beforeClassName + `style={${styleProps.join(', ')}} ` + afterClassName;
      }

      // Remove the className
      content = content.replace(fullMatch, '');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Migrated className in ${path.basename(filePath)}`);
  }

  return changed;
}

// Migrate components with className (start with simple ones)
function startBlockBMigration() {
  const simpleComponents = [
    'ThemeBubble.tsx',
    'ViewLoadingPlaceholder.tsx',
    'ClassSelection.tsx',
    'PinPadModal.tsx'
  ];

  console.log('Starting Block B migration...');
  console.log(`Target components: ${simpleComponents.length}`);

  simpleComponents.forEach(comp => {
    const filePath = `src/components/${comp}`;
    if (fs.existsSync(filePath)) {
      migrateClassNameToStyles(filePath);
    }
  });

  console.log('Block B migration batch completed');
}

// Run migration
startBlockBMigration();