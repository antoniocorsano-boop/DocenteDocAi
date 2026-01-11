# Plan: Restore Emotional Presets Functionality in MD3 System

Implement a fully functional EmotionalPresetsManager component that enables users to personalize the DocenteDoc AI app's UI through 8 emotional presets, adapting MD3 design tokens (colors, spacing, motion, typography) to create a more engaging and adaptive experience for docente users. The implementation will use internal type definitions, CSS custom property overrides, and include live hover previews with permanent selection capabilities.

## Steps
1. Create EmotionalPresetsManager.tsx in the appropriate components directory, defining the EmotionalPreset union type internally ('calm' | 'energetic' | 'creative' | 'focused' | 'relaxed' | 'professional' | 'playful' | 'minimal').
2. Implement preset configurations as a record mapping each EmotionalPreset to override objects containing MD3 token modifications for colors, spacing, motion, and typography.
3. Integrate useTheme and updateOverrides hook to apply CSS custom property changes (--md-sys-color-*, --md-sys-spacing-*, etc.) for theme personalization.
4. Add hover preview functionality using state management to temporarily apply preset overrides on mouse enter and reset on mouse leave.
5. Implement permanent selection mechanism that persists preset application and updates the theme accordingly.
6. Render the component using M3Typography, M3Card, and M3Button components in a responsive grid layout with visual indicators for selection and preview states.

## Further Considerations
1. Ensure all imports use correct relative paths based on project structure (e.g., '../../theme/theme' for useTheme).
2. Verify that updateOverrides hook correctly translates override objects to CSS custom properties for MD3 compliance.
3. Consider adding a reset button to clear permanent selections and return to default theme.
4. Test component integration with existing theme system to ensure overrides persist across app interactions.