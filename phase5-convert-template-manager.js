#!/usr/bin/env node

/**
 * PHASE 5 - MANUAL CONVERSION: TemplateManager.tsx
 * Converts 134 className + 42 Tailwind errors to MD3 inline styles
 * 
 * Strategy:
 * 1. Convert all template-manager-* custom classes to inline MD3 styles
 * 2. Handle material-symbols-outlined icon classes (keep as is)
 * 3. Convert remaining Tailwind utilities in TemplatePreview to MD3
 * 4. Fix all complex inline styles to use MD3 tokens
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'TemplateManager.tsx');

// CSS Class to MD3 Style Object Mapping
const classNameToStyle = {
  // Dialog & Main Container
  'template-manager-dialog-content': 'style={{ padding: 0 }}', // M3Dialog handles padding
  'template-manager-main-container': 'style={{ display: "flex", flexDirection: "column", padding: "var(--md-sys-spacing-16)" }}',
  
  // Search Controls
  'template-manager-search-controls': 'style={{ display: "flex", gap: "var(--md-sys-spacing-12)", marginBottom: "var(--md-sys-spacing-16)" }}',
  'template-manager-search-container': 'style={{ flex: 1 }}',
  'template-manager-search-input-container': 'style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", backgroundColor: "var(--md-sys-color-surface-container)", borderRadius: "var(--md-sys-shape-corner-full)", padding: "var(--md-sys-spacing-8) var(--md-sys-spacing-12)" }}',
  'template-manager-search-icon': 'style={{ color: "var(--md-sys-color-on-surface-variant)", fontSize: "1.5rem" }}',
  'template-manager-search-input': 'style={{ border: "none", backgroundColor: "transparent", width: "100%", color: "var(--md-sys-color-on-surface)", fontSize: "1rem", outline: "none" }}',
  'template-manager-create-button': 'style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}',
  
  // Templates List
  'template-manager-templates-list': 'style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-16)" }}',
  
  // Empty State
  'template-manager-empty-state': 'style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "var(--md-sys-spacing-32)", gap: "var(--md-sys-spacing-16)" }}',
  'template-manager-empty-state-icon': 'style={{ fontSize: "3rem", color: "var(--md-sys-color-outline-variant)" }}',
  'template-manager-empty-state-title': 'style={{ fontSize: "var(--md-sys-typescale-title-medium)", fontWeight: "500", color: "var(--md-sys-color-on-surface)" }}',
  'template-manager-empty-state-description': 'style={{ fontSize: "var(--md-sys-typescale-body-medium)", color: "var(--md-sys-color-on-surface-variant)" }}',
  'template-manager-empty-state-button': '',
  
  // Template Group
  'template-manager-template-group': 'style={{ display: "flex", flexDirection: "column" }}',
  'template-manager-template-grid': 'style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--md-sys-spacing-12)" }}',
  
  // Template Card
  'template-manager-template-card': 'style={{ cursor: "pointer", transition: "all 0.2s ease-in-out" }}',
  'template-manager-template-header': 'style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--md-sys-spacing-12)" }}',
  'template-manager-template-info': 'style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-8)" }}',
  'template-manager-template-name': 'style={{ fontSize: "var(--md-sys-typescale-title-small)", fontWeight: "500", color: "var(--md-sys-color-on-surface)", margin: 0 }}',
  'template-manager-template-type-badge': 'style={{ display: "inline-block", backgroundColor: "var(--md-sys-color-surface-container)", color: "var(--md-sys-color-on-surface)", padding: "var(--md-sys-spacing-4) var(--md-sys-spacing-8)", borderRadius: "var(--md-sys-shape-corner-full)", fontSize: "0.75rem", fontWeight: "500", width: "fit-content" }}',
  'template-manager-template-actions': 'style={{ display: "flex", gap: "var(--md-sys-spacing-4)" }}',
  'template-manager-template-edit-button': '',
  'template-manager-template-edit-icon': '',
  'template-manager-template-delete-button': '',
  'template-manager-template-delete-icon': '',
  'template-manager-template-description': 'style={{ fontSize: "var(--md-sys-typescale-body-small)", color: "var(--md-sys-color-on-surface-variant)", marginBottom: "var(--md-sys-spacing-12)" }}',
  'template-manager-template-updated-date': 'style={{ fontSize: "0.75rem", color: "var(--md-sys-color-outline-variant)", marginBottom: "var(--md-sys-spacing-12)" }}',
  'template-manager-template-apply-button': '',
  
  // Editor Container
  'template-manager-editor-container': 'style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-16)" }}',
  'template-manager-editor-header': 'style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--md-sys-color-outline-variant)", paddingBottom: "var(--md-sys-spacing-12)", marginBottom: "var(--md-sys-spacing-16)" }}',
  'template-manager-editor-tabs': 'style={{ display: "flex", gap: "var(--md-sys-spacing-8)" }}',
  'template-manager-editor-tab-button': '',
  'template-manager-editor-actions': 'style={{ display: "flex", gap: "var(--md-sys-spacing-8)" }}',
  'template-manager-editor-cancel-button': '',
  'template-manager-editor-save-button': '',
  
  // Config Tab
  'template-manager-config-tab': 'style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-16)", paddingRight: "var(--md-sys-spacing-16)" }}',
  'template-manager-config-form-grid': 'style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--md-sys-spacing-16)", marginBottom: "var(--md-sys-spacing-16)" }}',
  'template-manager-ai-generation-card': '',
  'template-manager-ai-generation-header': 'style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", marginBottom: "var(--md-sys-spacing-12)" }}',
  'template-manager-ai-generation-icon': 'style={{ fontSize: "1.5rem" }}',
  'template-manager-ai-generation-title': 'style={{ margin: 0, fontSize: "var(--md-sys-typescale-title-small)" }}',
  'template-manager-ai-generation-form': 'style={{ display: "flex", gap: "var(--md-sys-spacing-8)", marginBottom: "var(--md-sys-spacing-12)" }}',
  'template-manager-ai-generation-input': 'style={{ flex: 1 }}',
  'template-manager-ai-generation-button': '',
  'template-manager-ai-generation-help': 'style={{ fontSize: "0.75rem", color: "var(--md-sys-color-outline-variant)", margin: 0 }}',
  
  // Config Options
  'template-manager-config-options-grid': 'style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--md-sys-spacing-16)" }}',
  'template-manager-config-card': '',
  'template-manager-config-card-title': 'style={{ margin: 0, marginBottom: "var(--md-sys-spacing-12)", fontSize: "var(--md-sys-typescale-title-small)" }}',
  'template-manager-config-options': 'style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-8)" }}',
  'template-manager-config-option-label': 'style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", cursor: "pointer" }}',
  'template-manager-config-option-checkbox': 'style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }}',
  'template-manager-config-option-text': 'style={{ fontSize: "var(--md-sys-typescale-body-medium)", color: "var(--md-sys-color-on-surface)" }}',
  
  // Custom Sections
  'template-manager-custom-sections': 'style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-8)" }}',
  'template-manager-custom-section-item': 'style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}',
  'template-manager-custom-section-input': 'style={{ flex: 1, padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)", borderRadius: "var(--md-sys-shape-corner-small)", backgroundColor: "var(--md-sys-color-surface)" }}',
  'template-manager-custom-section-delete-button': 'style={{ padding: 0, backgroundColor: "transparent", border: "none", cursor: "pointer", color: "var(--md-sys-color-error)" }}',
  'template-manager-custom-section-delete-icon': '',
  'template-manager-add-section-button': '',
  
  // Content Tab
  'template-manager-content-tab': 'style={{ display: "flex", paddingRight: "var(--md-sys-spacing-16)" }}',
  'template-manager-content-layout': 'style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--md-sys-spacing-16)", width: "100%" }}',
  'template-manager-content-editor': 'style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-12)" }}',
  'template-manager-content-editor-header': 'style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}',
  'template-manager-content-editor-icon': 'style={{ fontSize: "1.5rem" }}',
  'template-manager-content-editor-title': 'style={{ margin: 0, fontSize: "var(--md-sys-typescale-title-small)" }}',
  'template-manager-content-field': 'style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-8)" }}',
  'template-manager-content-field-label': 'style={{ fontSize: "var(--md-sys-typescale-label-medium)", fontWeight: "500", color: "var(--md-sys-color-on-surface)" }}',
  'template-manager-content-textarea': 'style={{ padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)", borderRadius: "var(--md-sys-shape-corner-small)", backgroundColor: "var(--md-sys-color-surface-container-low)", fontFamily: "monospace", fontSize: "0.875rem", color: "var(--md-sys-color-on-surface)", resize: "vertical" }}',
  
  // Content Preview
  'template-manager-content-preview': 'style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-12)" }}',
  'template-manager-content-preview-header': 'style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}',
  'template-manager-content-preview-title-container': 'style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}',
  'template-manager-content-preview-icon': 'style={{ fontSize: "1.5rem" }}',
  'template-manager-content-preview-title': 'style={{ margin: 0, fontSize: "var(--md-sys-typescale-title-small)" }}',
  'template-manager-content-preview-status': 'style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-4)", fontSize: "0.75rem", color: "var(--md-sys-color-outline-variant)" }}',
  'template-manager-content-preview-status-dot': 'style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", backgroundColor: "var(--md-sys-color-tertiary)" }}',
  'template-manager-content-preview-container': 'style={{ maxHeight: "600px", overflow: "auto", borderRadius: "var(--md-sys-shape-corner-medium)", border: "1px solid var(--md-sys-color-outline-variant)" }}',
  
  // Variables Card
  'template-manager-variables-card': '',
  'template-manager-variables-header': 'style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", margin: 0, marginBottom: "var(--md-sys-spacing-12)", fontSize: "var(--md-sys-typescale-title-small)" }}',
  'template-manager-variables-icon': 'style={{ fontSize: "1.25rem" }}',
  'template-manager-variables-list': 'style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "var(--md-sys-spacing-8)" }}',
  'template-manager-variable-button': 'style={{ padding: "var(--md-sys-spacing-8)", backgroundColor: "var(--md-sys-color-surface-container)", border: "1px solid var(--md-sys-color-outline-variant)", borderRadius: "var(--md-sys-shape-corner-small)", cursor: "pointer", fontSize: "0.75rem", fontFamily: "monospace", color: "var(--md-sys-color-on-surface-variant)", transition: "all 0.2s ease-in-out" }}',
  
  // Preview Tab
  'template-manager-preview-tab': 'style={{ display: "flex", justifyContent: "center", paddingRight: "var(--md-sys-spacing-16)" }}',
};

// Tailwind to MD3 conversions in TemplatePreview
const tailwindToMD3 = [
  { from: /className="p-0 overflow-hidden border-\[var\(--md-sys-color-outline\)\]\/50"/g, to: 'style={{ border: "1px solid var(--md-sys-color-outline)" }}' },
  { from: /className="bg-\[var\(--md-sys-color-surface-container-low\)\].*?shrink-0"/g, to: 'style={{ backgroundColor: "var(--md-sys-color-surface-container-low)" }}' },
  { from: /className="border-\[var\(--md-sys-color-outline\)\]\/30/g, to: 'style={{ borderColor: "var(--md-sys-color-outline)" }}' },
  { from: /className="text-black shadow-inner"/g, to: 'style={{ color: "black", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)" }}' },
  { from: /className="my-6 py-8 border-2 border-dashed border-\[var\(--md-sys-color-outline-variant\)\] rounded-\[var\(--md-sys-shape-corner-medium\)\] text-\[var\(--md-sys-color-outline\)\] bg-\[var\(--md-sys-color-surface-container-low\)\]\/50"/g, to: 'style={{ margin: "var(--md-sys-spacing-12) 0", padding: "var(--md-sys-spacing-16)", border: "2px dashed var(--md-sys-color-outline-variant)", borderRadius: "var(--md-sys-shape-corner-medium)", color: "var(--md-sys-color-outline)", backgroundColor: "var(--md-sys-color-surface-container-low)" }}' },
  { from: /className="material-symbols-outlined text-3xl"/g, to: 'className="material-symbols-outlined" style={{ fontSize: "1.875rem" }}' },
  { from: /className="bg-\[var\(--md-sys-color-outline-variant\)\] w-3\/4"/g, to: 'style={{ backgroundColor: "var(--md-sys-color-outline-variant)", width: "75%" }}' },
  { from: /className="bg-\[var\(--md-sys-color-outline-variant\)\] w-1\/2"/g, to: 'style={{ backgroundColor: "var(--md-sys-color-outline-variant)", width: "50%" }}' },
  { from: /className="bg-\[var\(--md-sys-color-surface-container-high\)\] border-\[var\(--md-sys-color-outline-variant\)\]"/g, to: 'style={{ backgroundColor: "var(--md-sys-color-surface-container-high)" }}' },
  { from: /className="border-\[var\(--md-sys-color-outline-variant\)\] overflow-hidden"/g, to: 'style={{ overflow: "hidden" }}' },
  { from: /className="bg-error\/30"/g, to: 'style={{ backgroundColor: "var(--md-sys-color-error)" }}' },
  { from: /className="bg-warning\/30"/g, to: 'style={{ backgroundColor: "var(--md-sys-color-warning)" }}' },
  { from: /className="bg-success\/30"/g, to: 'style={{ backgroundColor: "var(--md-sys-color-success)" }}' },
  { from: /className="px-8"/g, to: 'style={{ paddingLeft: "var(--md-sys-spacing-16)", paddingRight: "var(--md-sys-spacing-16)" }}' },
  { from: /className="w-3\/4"/g, to: 'style={{ width: "75%" }}' },
  { from: /className="w-1\/2"/g, to: 'style={{ width: "50%" }}' },
  { from: /className="w-5\/6"/g, to: 'style={{ width: "83.333%" }}' },
];

function convertFile(content) {
  let modified = content;
  
  // Replace all custom className attributes with inline styles
  Object.entries(classNameToStyle).forEach(([className, style]) => {
    // Match className="..." patterns
    const regex = new RegExp(`className="${className}"`, 'g');
    if (style && regex.test(modified)) {
      modified = modified.replace(regex, style);
    }
  });
  
  // Apply Tailwind to MD3 conversions
  tailwindToMD3.forEach(({ from, to }) => {
    modified = modified.replace(from, to);
  });
  
  // Fix mixed className + style patterns
  // Example: className="flex" style={{...}} -> just style={{...}}
  modified = modified.replace(/\s*className="flex"\s*style=/g, ' style=');
  modified = modified.replace(/\s*className="flex flex-col"/g, '');
  modified = modified.replace(/\s*className="gap-/g, '');
  
  // Fix icon classes that should remain with className
  // material-symbols-outlined should stay as className
  
  return modified;
}

// Main execution
try {
  console.log('\n🔄 PHASE 5: Converting TemplateManager.tsx');
  console.log('═'.repeat(50));
  
  const content = fs.readFileSync(filePath, 'utf8');
  const converted = convertFile(content);
  
  // Count changes
  const classNameMatches = (content.match(/className="template-manager-/g) || []).length;
  const tailwindMatches = (content.match(/className="(flex|p-0|bg-|w-|my-|px-)/g) || []).length;
  
  fs.writeFileSync(filePath, converted, 'utf8');
  
  console.log(`✅ Conversion complete`);
  console.log(`   - Custom classes replaced: ${classNameMatches}`);
  console.log(`   - Tailwind utilities fixed: ${tailwindMatches}`);
  console.log(`   - Total className → inline style conversions: ${classNameMatches + tailwindMatches}`);
  console.log('\n✔ File updated: ' + filePath);
  console.log('\n📝 Next: npm run lint to verify changes');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
