// LEGACY - MD3 Non-compliant
import React from 'react';
import M3Typography from './M3Typography';
import M3Button from './M3Button';
import { useTheme } from '../../theme/theme';

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
  const { layers } = useTheme();
  // Color mapping based on variant - using MD3 color roles
  const getVariantColors = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: 'var(--md-sys-color-secondary-container)',
          onBackground: 'var(--md-sys-color-on-secondary-container)',
          accent: 'var(--md-sys-color-secondary)'
        };
      case 'tertiary':
        return {
          background: 'var(--md-sys-color-tertiary-container)',
          onBackground: 'var(--md-sys-color-on-tertiary-container)',
          accent: 'var(--md-sys-color-tertiary)'
        };
      default: // primary
        return {
          background: 'var(--md-sys-color-primaryContainer)',
          onBackground: 'var(--md-sys-color-on-primaryContainer)',
          accent: 'var(--md-sys-color-primary)'
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
        gap: layers.ref.spacing['3'],
        backgroundColor: colors.background,
        borderRadius: 'layers.ref.shape.corner.large',
        padding: layers.ref.spacing['4'],
        boxShadow: 'layers.sys.elevation.level1',
        transition: `all ${layers.motion.duration.short2} ${layers.motion.easing.standard}`
      }}
    >
      {/* Header section with icon and title */}
      <div
        style={{display: 'flex',
          alignItems: 'center',
          gap: layers.ref.spacing['3']
        }}
      >
        {/* Optional leading icon */}
        {leadingIcon && (
          <div
            style={{display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: layers.ref.spacing['6'],
              height: layers.ref.spacing['6'],
              borderRadius: 'layers.ref.shape.corner.full',
              backgroundColor: colors.accent,
              color: colors.onBackground
            }}
            aria-hidden="true"
          >
            <span
              style={{fontFamily: 'Material Symbols Outlined',
                fontSize: layers.ref.spacing['4']
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
            fontWeight: 'var(--md-sys-typescale-label-large-font-weight)'
          }}
        >
          {title}
        </M3Typography>
      </div>

      {/* Optional description section */}
      {description && (
        <div
          style={{marginTop: layers.ref.spacing['2']}}
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
          style={{marginTop: layers.ref.spacing['4'], // Larger top margin for actions
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





