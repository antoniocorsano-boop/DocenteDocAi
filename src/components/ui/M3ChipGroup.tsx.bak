// MD3 Compliant M3ChipGroup Component
// Fully compliant with MD3 tokens: uses var(--md-sys-*) CSS variables for theming, spacing, typography, shape, motion, and elevation
// No useTheme() dependency - all styling uses direct MD3 CSS variables

import React from 'react';

export type M3ChipGroupProps = {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
  wrap?: boolean;
};

function M3ChipGroup({
  children,
  direction = 'horizontal',
  spacing = 'normal',
  wrap = true
}: M3ChipGroupProps): React.ReactElement {
  // MD3 Token mapping - no useTheme() dependency
  // Spacing tokens
  const spacing1 = 'var(--md-sys-spacing-1)';
  const spacing2 = 'var(--md-sys-spacing-2)';
  const spacing3 = 'var(--md-sys-spacing-3)';

  const getSpacing = () => {
    switch (spacing) {
      case 'tight': return spacing1;
      case 'loose': return spacing3;
      default: return spacing2;
    }
  };

  const flexDirection = direction === 'vertical' ? 'column' : 'row';
  const flexWrap = wrap ? 'wrap' : 'nowrap';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection,
        flexWrap,
        gap: getSpacing(),
        alignItems: direction === 'vertical' ? 'flex-start' : 'center'
      }}
    >
      {children}
    </div>
  );
}

export default M3ChipGroup;

