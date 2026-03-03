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
  const surface = 'var(--md-sys-color-surface)';
  const outlineVariant = 'var(--md-sys-color-outline-variant)';

  // Elevation token
  const level2 = 'var(--md-sys-elevation-level2)';

  const baseStyle: React.CSSProperties = {
    width: 'var(--md-sys-percent-100)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--md-sys-spacing-2)',
    padding: `var(--md-sys-spacing-2) var(--md-sys-spacing-3)`,
    backgroundColor: surface,
    borderTop: `var(--md-sys-border-width-normal) solid ${outlineVariant}`,
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

