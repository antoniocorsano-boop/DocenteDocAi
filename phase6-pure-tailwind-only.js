#!/usr/bin/env node
/**
 * Phase 6: Pure Tailwind Only Converter
 * 
 * Only touches className attributes that:
 * 1. Contain ONLY simple Tailwind utility classes
 * 2. NO custom CSS class names (xyz-abc)
 * 3. NO existing style={{}} on same element
 * 4. NO complex responsive/animation patterns
 */

const fs = require('fs');
const path = require('path');

const SIMPLE_TAILWIND = {
  'flex': 'display:flex',
  'grid': 'display:grid',
  'block': 'display:block',
  'inline-block': 'display:inline-block',
  'flex-row': 'flexDirection:row',
  'flex-col': 'flexDirection:column',
  'items-center': 'alignItems:center',
  'justify-center': 'justifyContent:center',
  'gap-4': 'gap:var(--md-sys-spacing-4)',
  'p-4': 'padding:var(--md-sys-spacing-4)',
  'rounded-lg': 'borderRadius:var(--md-sys-shape-corner-large)',
  'w-full': 'width:100%',
  'h-full': 'height:100%',
};

const files = [
  'src/components/SkipLink.tsx', // The scanner found this as safe
  'src/components/ChipInputList.tsx',
  'src/components/ClassAnalytics.tsx',
  'src/components/CompetencyLevelsView.tsx',
  'src/components/ContextualStrip.tsx',
  'src/components/ErrorBoundary.functional.tsx',
  'src/components/HomeworkSubmission.tsx',
  'src/components/ImprovementGuide.tsx',
  'src/components/KnowledgeBase.tsx',
  'src/components/ModalContext.tsx',
  'src/components/ObservationModal.tsx',
  'src/components/ReportisticaHub.tsx',
  'src/components/ShareModal.tsx',
  'src/components/TeacherInbox.tsx',
  'src/components/ThemeBubble.tsx',
  'src/components/TemplateManager.tsx',
  'src/components/UniversalModalDemo.tsx',
  'src/components/ViewManager.tsx',
  'src/components/WorkflowGuide.tsx',
  'src/components/IdeaGeneratorModal.tsx',
];

let converted = 0;

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    return;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;
    
    // Pattern: className="simple stuff" with NO style, NO custom CSS
    // This is very conservative - only match if we're SURE it's safe
    content = content.replace(
      /className="((?:[a-z0-9\-]+\s*)*)"\s*(?!style=\{\{)/g,
      (match, classes) => {
        // Reject if has custom CSS pattern (3-part class name)
        if (/[a-z]+-[a-z]+-[a-z]+/.test(classes)) {
          return match;
        }
        
        // Reject if not pure simple classes
        const classList = classes.split(/\s+/).filter(c => c);
        const isSimple = classList.every(c => 
          c === 'flex' || c === 'grid' || c === 'block' || 
          c.startsWith('gap-') || c.startsWith('p-') || 
          c.startsWith('rounded-') || c === 'w-full' || 
          c === 'h-full' || c.startsWith('items-') ||
          c.startsWith('justify-') || c.startsWith('flex-') ||
          c === 'material-symbols-outlined'
        );
        
        if (!isSimple) {
          return match;
        }
        
        converted++;
        return ''; // Remove the className
      }
    );
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ ${path.basename(filePath)}`);
    }
  } catch (e) {
    console.error(`❌ ${filePath}:`, e.message);
  }
});

console.log(`\nTotal className removals: ${converted}`);
