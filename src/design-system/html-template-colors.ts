/* eslint-disable design-system/no-hardcoded-colors */

/**
 * HTML TEMPLATE COLOR UTILITIES
 * 
 * These colors are used in HTML template strings for document generation.
 * These are NOT CSS colors used in React components—they are part of
 * generated document content via jsPDF, HTML export, etc.
 * 
 * HTML template colors are:
 * - Hardcoded HEX values in template strings (not CSS variables)
 * - Embedded in generated documents (not affected by dark mode)
 * - Part of document data, not component styling
 * - Used by: DocumentGenerator, PDF exports, HTML reports
 * 
 * This file is EXCLUDED from the design-system/no-hardcoded-colors ESLint rule.
 * @see docs/DESIGN_SYSTEM_CONSOLIDATION.md § 5 - "Exceptions & Overrides"
 */

export const HTML_TEMPLATE_COLORS = {
  // Header and title styling
  headers: {
    primary: '#1a73e8',      // Blue - for main titles
    accent: '#e8f0fe',       // Light blue background
  },
  
  // Text colors
  text: {
    primary: '#202124',      // Dark gray - main text
    secondary: '#666666',    // Medium gray - secondary text
    footer: '#666666',       // Gray - footer text
  },
  
  // Table and structure colors
  structure: {
    headerBg: '#e8f0fe',     // Light blue for header backgrounds
    borderColor: '#dadce0',  // Light gray for borders
  },
} as const;

/**
 * Generate styled header HTML for document templates
 * @param title - Header title text
 * @returns HTML string with styled header
 */
export function getStyledHeader(title: string): string {
  return `<h1 style="text-align: center; color: ${HTML_TEMPLATE_COLORS.headers.primary};">${title}</h1><hr/>`;
}

/**
 * Generate styled footer HTML for document templates
 * @param text - Footer text (can include placeholders like {{data}})
 * @returns HTML string with styled footer
 */
export function getStyledFooter(text: string): string {
  return `<p style="text-align: center; font-size: 10px; color: ${HTML_TEMPLATE_COLORS.text.footer};">${text}</p>`;
}

/**
 * Generate styled section header HTML for document templates
 * @param title - Section title text
 * @returns HTML string with styled section header
 */
export function getStyledSectionHeader(title: string): string {
  return `<div style="background-color: ${HTML_TEMPLATE_COLORS.structure.headerBg}; padding: 15px; border-radius: 8px;"><h2>${title}</h2></div>`;
}
