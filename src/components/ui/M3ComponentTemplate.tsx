// ✅ MD3 Native Compliant - Migrated from useTheme to direct MD3 tokens
import React from 'react';
import { M3Typography } from './M3Typography';
import { M3Button } from './M3Button';

// MD3 Token Constants - Direct CSS Variables
const MD3_TOKENS = {
  // Colors
  primaryContainer: 'var(--app-color-primary-container)',
  onPrimaryContainer: 'var(--app-color-on-primary-container)',
  primary: 'var(--app-color-primary)',
  secondaryContainer: 'var(--app-color-secondary-container)',
  onSecondaryContainer: 'var(--app-color-on-secondary-container)',
  secondary: 'var(--app-color-secondary)',
  tertiaryContainer: 'var(--md-sys-color-tertiary-container)',
  onTertiaryContainer: 'var(--md-sys-color-on-tertiary-container)',
  tertiary: 'var(--md-sys-color-tertiary)',

  // Shape
  cornerLarge: 'var(--md-sys-shape-corner-large)',
  cornerFull: 'var(--md-sys-shape-corner-full)',

  // Spacing
  spacing2: 'var(--app-spacing-component)',
  spacing3: 'var(--app-spacing-element)',
  spacing4: 'var(--app-spacing-container)',
  spacing6: 'var(--app-spacing-section)',

  // Motion
  durationShort2: 'var(--md-sys-motion-duration-short2)',
  easingStandard: 'var(--app-easing-standard)',

  // Elevation
  elevation1: 'var(--md-sys-elevation-level1)',

  // Typography
  labelLargeFontWeight: 'var(--app-text-label-weight)',
} as const;

/**
 * MD3 Component Template
 *
 * This template provides a fully structured, MD3-compliant React component
 * that can be used as a starting point for new components or migrations.
 *
 * Token Usage:
 * - Colors: MD3 color roles (--md-sys-color-*)
 * - Typography: MD3 type scale (--md-sys-typescale-*)
 * - Spacing: MD3 spacing scale (--md-sys-spacing-*)
 * - Motion: MD3 motion tokens (--md-sys-motion-*)
 * - Shape: MD3 shape tokens (--md-sys-shape-*)
 *
 * Accessibility:
 * - ARIA roles and properties
 * - Keyboard navigation support
 * - Focus management
 * - Screen reader compatibility
 *
 * @example
 * ```tsx
 * <M3ComponentTemplate
 *   title="Example Component"
 *   description="This is an example of the MD3 component template"
 *   variant="primary"
 *   onAction={() => console.log('Action triggered')}
 * />
 * ```
 */
interface M3ComponentTemplateProps {
  /** Primary title text - uses label-large typography variant */
  title: string;

  /** Optional description text - uses body-medium typography variant */
  description?: string;

  /** Component variant affecting colors and styling */
  variant?: 'primary' | 'secondary' | 'tertiary';

  /** Optional leading icon name from Material Symbols */
  leadingIcon?: string;

  /** Optional action button text */
  actionLabel?: string;

  /** Callback for action button clicks */
  onAction?: () => void;

  /** Test identifier for automated testing */
  'data-testid'?: string;
}

const M3ComponentTemplate: React.FC<M3ComponentTemplateProps> = ({
  title,
  description,
  variant = 'primary',
  leadingIcon,
  actionLabel,
  onAction,
  'data-testid': dataTestId
}) => {
  // Color mapping based on variant - using MD3 color roles
  const getVariantColors = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: MD3_TOKENS.secondaryContainer,
          onBackground: MD3_TOKENS.onSecondaryContainer,
          accent: MD3_TOKENS.secondary
        };
      case 'tertiary':
        return {
          background: MD3_TOKENS.tertiaryContainer,
          onBackground: MD3_TOKENS.onTertiaryContainer,
          accent: MD3_TOKENS.tertiary
        };
      default: // primary
        return {
          background: MD3_TOKENS.primaryContainer,
          onBackground: MD3_TOKENS.onPrimaryContainer,
          accent: MD3_TOKENS.primary
        };
    }
  };

  const colors = getVariantColors();

  return (
    <div
      data-testid={dataTestId}
      role="region"
      aria-label={`${title} component`}
      style={{// Layout using flexbox with MD3 spacing tokens
        display: 'flex',
        flexDirection: 'column',
        gap: MD3_TOKENS.spacing3,
        backgroundColor: colors.background,
        borderRadius: MD3_TOKENS.cornerLarge,
        padding: MD3_TOKENS.spacing4,
        boxShadow: 'var(--md-sys-elevation-level1)',
        transition: `all var(--app-motion-quick) var(--app-easing-standard)`
      }}
    >
      {/* Header section with icon and title */}
      <div
        style={{display: 'flex',
          alignItems: 'center',
          gap: MD3_TOKENS.spacing3
        }}
      >
        {/* Optional leading icon */}
        {leadingIcon && (
          <div
            style={{display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: MD3_TOKENS.spacing6,
              height: MD3_TOKENS.spacing6,
              borderRadius: MD3_TOKENS.cornerFull,
              backgroundColor: colors.accent,
              color: colors.onBackground
            }}
            aria-hidden="true"
          >
            <span
              style={{fontFamily: 'Material Symbols Outlined',
                fontSize: 'var(--app-spacing-container)'
              }}
            >
              {leadingIcon}
            </span>
          </div>
        )}

        {/* Title using M3Typography with label-large variant */}
        <M3Typography
          variant="label-large"
          style={{color: colors.onBackground,
            fontWeight: MD3_TOKENS.labelLargeFontWeight
          }}
        >
          {title}
        </M3Typography>
      </div>

      {/* Optional description section */}
      {description && (
        <div
          style={{marginTop: MD3_TOKENS.spacing2}}
        >
          {/* Description using M3Typography with body-medium variant */}
          <M3Typography
            variant="body-medium"
            style={{
              color: colors.onBackground,
              opacity: 0.87
            }}
          >
            {description}
          </M3Typography>
        </div>
      )}

      {/* Optional action section */}
      {actionLabel && onAction && (
        <div
          style={{marginTop: MD3_TOKENS.spacing4, // Larger top margin for actions
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          {/* Action button using M3Button component */}
          <M3Button
            onClick={onAction}
            variant="filled"
            size="small"
            style={{
              backgroundColor: colors.accent,
              color: colors.onBackground
            }}
            aria-label={`${actionLabel} for ${title}`}
          >
            {actionLabel}
          </M3Button>
        </div>
      )}
    </div>
  );
};

export default M3ComponentTemplate;

/*
MIGRATION NOTES (when adapting this template):

1. Component Naming:
   - Replace "M3ComponentTemplate" with your specific component name
   - Update interface name accordingly
   - Update example usage comments

2. Props Interface:
   - Add/remove props based on component requirements
   - Ensure TypeScript types are correct
   - Add JSDoc comments for each prop

3. Token Mapping:
   - Colors: Use appropriate MD3 color roles for your use case
   - Typography: Choose variants that match content hierarchy
   - Spacing: Use consistent spacing scale throughout
   - Shape: Select appropriate corner radius for component type

4. Accessibility:
   - Update ARIA labels and roles for component purpose
   - Ensure keyboard navigation if interactive
   - Add focus management if needed
   - Include screen reader support

5. Layout:
   - Use flexbox/grid for responsive layouts
   - Apply spacing tokens consistently
   - Consider component responsive behavior

6. M3 Components:
   - Use M3Typography for all text elements
   - Use M3Button for interactive elements
   - Use M3Card for surface containers if appropriate
   - Use M3ListItem for list items if applicable

7. Styling:
   - All colors, spacing, typography must use MD3 tokens
   - No hardcoded values allowed
   - Use CSS custom properties (--md-sys-*) only

8. Testing:
   - Add data-testid attributes for testing
   - Ensure component works in different variants
   - Test accessibility features

EXAMPLE MIGRATION (TextField):
- Replace title/description with label/errorMessage
- Use input element with proper styling
- Add focus/error states with token-based colors
- Implement floating label animation
- Add ARIA attributes for form accessibility
*/






