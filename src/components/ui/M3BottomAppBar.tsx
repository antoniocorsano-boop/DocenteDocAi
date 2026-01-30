// MD3 Compliant M3BottomAppBar Component
// Fully compliant with MD3 tokens: uses var(--md-sys-*) CSS variables for theming, spacing, and elevation
// No useTheme() dependency - all styling uses direct MD3 CSS variables

import React from 'react';

export type M3BottomAppBarProps = React.HTMLAttributes<HTMLDivElement> & {
  elevated?: boolean;
};

function M3BottomAppBar({ children, elevated, style, ...props }: M3BottomAppBarProps): React.ReactElement {
  // MD3 Token mapping - no useTheme() dependency
  // Color tokens
  const surface = 'var(--app-color-surface)';
  const outlineVariant = 'var(--md-sys-color-outline-variant)';

  // Elevation token
  const level2 = 'var(--app-elevation-level-2)';

  const baseStyle: React.CSSProperties = {
    width: 'var(--app-layout-full)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--app-spacing-component)',
    padding: `var(--app-spacing-component) var(--app-spacing-element)`,
    backgroundColor: surface,
    borderTop: `var(--app-border-normal) solid ${outlineVariant}`,
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        ...baseStyle,
        boxShadow: elevated ? level2 : 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default M3BottomAppBar;








