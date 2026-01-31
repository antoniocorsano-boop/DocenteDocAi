// MD3 Compliant M3ButtonGroup Component
// Fully compliant with MD3 tokens: uses var(--md-sys-*) CSS variables for theming, spacing, typography, shape, motion, and elevation
// No useTheme() dependency - all styling uses direct MD3 CSS variables

import React from 'react';

export type M3ButtonGroupProps = {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
  variant?: 'default' | 'outlined' | 'elevated';
  fullWidth?: boolean;
};

function M3ButtonGroup({
  children,
  direction = 'horizontal',
  spacing = 'normal',
  variant = 'default',
  fullWidth = false
}: M3ButtonGroupProps): React.ReactElement {
  // MD3 Token mapping - no useTheme() dependency
  // Spacing tokens
  const spacing0 = 'var(--md-sys-spacing-0)';
  const spacing1 = 'var(--md-sys-spacing-1)';
  const spacing2 = 'var(--md-sys-spacing-2)';

  // Shape tokens
  const small = 'var(--md-sys-shape-corner-small)';

  // Color tokens
  const surface = 'var(--md-sys-color-surface)';
  const outline = 'var(--md-sys-color-outline)';
  const surfaceContainerHigh = 'var(--md-sys-color-surface-container-high)';

  // Elevation tokens
  const level1 = 'var(--md-sys-elevation-1)';

  const getSpacing = () => {
    switch (spacing) {
      case 'tight': return spacing0;
      case 'loose': return spacing2;
      default: return spacing1;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          border: `var(--md-sys-border-width-normal) solid ${outline}`,
          borderRadius: small
        };
      case 'elevated':
        return {
          backgroundColor: surfaceContainerHigh,
          borderRadius: small,
          boxShadow: level1
        };
      default:
        return {
          backgroundColor: surface,
          borderRadius: small
        };
    }
  };

  const flexDirection = direction === 'vertical' ? 'column' : 'row';
  const width = fullWidth ? 'var(--md-sys-percent-100)' : 'auto';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection,
        gap: getSpacing(),
        width,
        ...getVariantStyles()
      }}
    >
      {React.Children.map(children, (child) => (
        <div style={{ flex: fullWidth ? 1 : 'none' }}>
          {child}
        </div>
      ))}
    </div>
  );
}

export default M3ButtonGroup;

