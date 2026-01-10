# DESIGN TOKEN MAP - Material Design 3 Consolidation

**Phase 3 - Design Token Consolidation (Strict Mode)**  
_Analysis Date: January 9, 2026_  
_Status: READ-ONLY ANALYSIS - No code changes applied_

## Color

### Detected Raw Values

- `#fff` - Pure white color
- `#d32f2f` - Red color for error states
- `rgba(255, 255, 255, 0.2)` - Semi-transparent white overlay
- `rgba(255, 255, 255, 0.4)` - Medium transparent white
- `rgba(0, 0, 0, 0.05)` - Very light black border
- `rgba(0, 0, 0, 0.1)` - Light black shadow/border
- `rgba(0, 0, 0, 0.18)` - Medium black shadow
- `rgba(0, 0, 0, 0.32)` - Dark overlay backdrop
- `rgba(0,0,0,0.3)` - Dark semi-transparent

### Files Where Appears

- `modules.css` (high frequency)
- `index.css` (medium frequency)
- `m3-interactive.css` (low frequency)

### Frequency

- High: `#fff`, `rgba(0, 0, 0, 0.1)`, `rgba(0, 0, 0, 0.18)`

### Proposed M3 Token Name

- `--md-sys-color-surface` (for #fff)
- `--md-sys-color-error` (for #d32f2f)
- `--md-sys-color-surface-variant` (for rgba overlays)
- `--md-sys-color-outline-variant` (for borders)
- `--md-sys-color-shadow` (for shadows)

### Confidence Level

- High: Error colors, surface colors
- Medium: Overlay transparencies, shadow colors

## Spacing

### Detected Raw Values

- `2px` - Small outline offset/border
- `20px` - Icon positioning, font sizes
- `40px` - Icon dimensions
- `140px` - Card minimum height
- `150px` - Grid minimum width
- `160px` - Card width constraints
- `600px` - Media query breakpoint

### Files Where Appears

- `modules.css` (high frequency)
- `spacing.css` (medium frequency)
- `typography.css` (low frequency)

### Frequency

- High: `2px`, `20px`, `40px`
- Medium: `140px`, `150px`, `160px`

### Proposed M3 Token Name

- `--md-sys-spacing-1` (for 2px values)
- `--md-sys-spacing-4` (for 20px values)
- `--md-sys-spacing-6` (for 40px values)
- `--md-sys-spacing-12` (for larger dimensions)

### Confidence Level

- High: Standard spacing values (2px, 20px, 40px)
- Medium: Component-specific dimensions

## Radius

### Detected Raw Values

- `var(--shape-m)` - Small radius
- `var(--shape-l)` - Large radius
- `var(--shape-xl)` - Extra large radius
- `var(--shape-full)` - Full radius (circular)
- `var(--shape-xs)` - Extra small radius
- `var(--shape-s)` - Small radius

### Files Where Appears

- `modules.css` (high frequency)
- `legacyStyles.css` (medium frequency)

### Frequency

- High: `var(--shape-l)`, `var(--shape-xl)`, `var(--shape-full)`

### Proposed M3 Token Name

- `--md-sys-shape-corner-extra-small` (for --shape-xs)
- `--md-sys-shape-corner-small` (for --shape-s)
- `--md-sys-shape-corner-medium` (for --shape-m)
- `--md-sys-shape-corner-large` (for --shape-l)
- `--md-sys-shape-corner-extra-large` (for --shape-xl)
- `--md-sys-shape-corner-full` (for --shape-full)

### Confidence Level

- High: All shape tokens map directly to M3 equivalents

## Elevation

### Detected Raw Values

- `var(--md-sys-elevation-level0)` - No elevation
- `var(--md-sys-elevation-level1)` - Low elevation
- `var(--md-sys-elevation-level2)` - Medium elevation
- `var(--md-sys-elevation-level3)` - High elevation
- `var(--elevation-0)` - Legacy no elevation
- `var(--elevation-1)` - Legacy low elevation
- `inset 0 1px 3px rgba(0, 0, 0, 0.1)` - Inset shadow
- `0 2px var(--md-sys-spacing-1) rgba(0, 0, 0, 0.1)` - Custom shadow

### Files Where Appears

- `modules.css` (high frequency)
- `m3-interactive.css` (medium frequency)

### Frequency

- High: `var(--md-sys-elevation-level1)`, `var(--md-sys-elevation-level2)`
- Medium: `var(--elevation-1)`, custom rgba shadows

### Proposed M3 Token Name

- `--md-sys-elevation-level0` (standardize all level0 references)
- `--md-sys-elevation-level1` (standardize all level1 references)
- `--md-sys-elevation-level2` (standardize all level2 references)
- `--md-sys-elevation-level3` (standardize all level3 references)

### Confidence Level

- High: Direct M3 token replacements available
- Medium: Custom rgba shadows need evaluation

## Typography

### Detected Raw Values

- `20px` - Font size for titles/icons
- `40px` - Line height values
- `14px` - Small text sizes
- `22px` - Title sizes
- `28px` - Headline sizes
- `36px` - Display sizes
- `45px` - Large display sizes
- `57px` - Extra large display sizes

### Files Where Appears

- `typography.css` (high frequency)
- `modules.css` (medium frequency)
- `index.css` (low frequency)

### Frequency

- High: `14px`, `20px`, `22px`
- Medium: `28px`, `36px`, `40px`

### Proposed M3 Token Name

- `--md-sys-typescale-body-small-size` (for 14px)
- `--md-sys-typescale-title-medium-size` (for 20px)
- `--md-sys-typescale-title-large-size` (for 22px)
- `--md-sys-typescale-headline-small-size` (for 28px)
- `--md-sys-typescale-display-small-size` (for 36px)
- `--md-sys-typescale-display-medium-size` (for 45px)
- `--md-sys-typescale-display-large-size` (for 57px)

### Confidence Level

- High: Direct M3 typescale token mappings
- Medium: Line height values need verification

## SAFE TO CONSOLIDATE

- **Color tokens**: High confidence mappings for error, surface, and outline colors
- **Shape tokens**: Direct 1:1 mapping from legacy --shape-_ to --md-sys-shape-corner-_
- **Elevation tokens**: Standardize --elevation-_ to --md-sys-elevation-level_
- **Typography scale**: Complete M3 typescale available for all detected sizes

## NEEDS HUMAN DECISION

- **Custom rgba values**: `rgba(255, 255, 255, 0.2)`, `rgba(0, 0, 0, 0.32)` - determine if these represent specific design intent or can be mapped to semantic tokens
- **Hardcoded pixel spacing**: Values like `150px`, `160px` for component dimensions - evaluate if these should become custom tokens or use existing spacing scale
- **Mixed elevation systems**: Coexistence of --elevation-_ and --md-sys-elevation-level_ - migration strategy needed

## DO NOT TOUCH

- **Functional CSS classes**: Utility classes in spacing.css, typography.css that provide intentional overrides
- **Legacy component styles**: Styles that serve specific component behavior (e.g., dialog positioning, grid layouts)
- **Animation timing**: Motion tokens that are already properly implemented in motion.css</content>
  <parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\DESIGN_TOKEN_MAP_M3.md
