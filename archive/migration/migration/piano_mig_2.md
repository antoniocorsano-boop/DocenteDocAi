// MD3 Migration Cleanup Plan
// Execute these operations systematically to achieve 100% MD3 compliance

## PHASE 1: Theme System Consolidation (IMMEDIATE)

1. REMOVE LEGACY THEME PROVIDER:
   - Delete src/theme/theme.tsx (marked @legacy and @md3-noncompliant)
   - Remove all imports of useTheme from legacy provider
   - Update components to use M3ThemeProvider only

2. STANDARDIZE TOKEN REFERENCES:
   - Replace all --sys-* variables with --md-sys-* across entire codebase
   - Update --spacing-* and --shape-* to use MD3 spacing tokens
   - Remove hardcoded colors (hex values like #666, #333, rgba(0,0,0,0.32))

3. CLEAN UP CSS ARCHITECTURE:
   - Remove redundant styles from theme.css (1271 lines)
   - Delete design-system/legacyStyles.css (489 lines)
   - Consolidate typography scales into single source
   - Organize m3-interactive.css classes for consistent application

## PHASE 2: Component Migration (HIGH PRIORITY)

1. CREATE REFERENCE IMPLEMENTATIONS:
   - Update M3Button and M3Card as perfect MD3 examples
   - Ensure they use only --md-sys-* tokens
   - Remove all inline styles from these components

2. SYSTEMATIC COMPONENT MIGRATION:
   - Audit all 100+ components using useTheme() hook
   - Migrate 20-30 most-used components first
   - Replace inline styles with CSS classes using MD3 tokens
   - Update all Storybook .stories.tsx files

3. STANDARDIZE PATTERNS:
   - All components must follow M3Button/M3Card pattern
   - Use consistent prop interfaces
   - Apply m3-interactive-* classes for states
   - Ensure proper elevation and motion tokens

## PHASE 3: Visual Consistency (MEDIUM PRIORITY)

1. COLOR SYSTEM UNIFICATION:
   - Ensure all components use MD3 color tokens only
   - Remove all hardcoded hex colors
   - Apply consistent color schemes across light/dark themes

2. SPACING AND LAYOUT:
   - Standardize spacing using --md-sys-spacing-* tokens
   - Fix responsive breakpoints consistently
   - Resolve bottom navigation CSS conflicts

3. TYPOGRAPHY CONSISTENCY:
   - Create single typography scale source
   - Apply consistent font families (Roboto Flex + Material Symbols)
   - Use MD3 type scale variants correctly

## PHASE 4: Code Quality & Testing (LOW PRIORITY)

1. REMOVE TECHNICAL DEBT:
   - Replace all remaining inline styles (100+ instances)
   - Remove deprecated token usage
   - Standardize CSS class naming conventions

2. IMPLEMENT VALIDATION:
   - Add visual regression tests
   - Validate MD3 compliance across components
   - Test theme switching functionality

## EXECUTION ORDER:

1. Start with theme provider consolidation
2. Update reference components (M3Button, M3Card)
3. Migrate high-usage components
4. Clean up CSS architecture
5. Validate and test consistency

## SUCCESS METRICS:
- 100% MD3 token usage
- 0 inline styles with hardcoded values
- Single theme provider architecture
- Consistent visual appearance across all components
- All Storybook examples using MD3 tokens

## PRESERVED FOUNDATIONS:
- Maintain Local-First Architecture
- Keep CALMA AFFIDABILE principles
- Preserve accessibility compliance
- Maintain component prop interfaces
- Keep existing functionality intact

Execute this plan systematically to eliminate visual disorder and achieve perfect MD3 compliance.