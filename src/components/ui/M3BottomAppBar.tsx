// LEGACY - MD3 Non-compliant
import React from 'react';
import { useTheme } from '../../theme/theme';

export type M3BottomAppBarProps = React.HTMLAttributes<HTMLDivElement> & {
  elevated?: boolean;
};

function M3BottomAppBar({ children, elevated, style, ...props }: M3BottomAppBarProps): React.ReactElement {
  const { layers } = useTheme();
  const { sys, ref, elevation } = layers;

  const baseStyle: React.CSSProperties = {
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: layers.ref.spacing['4'],
    padding: `${layers.ref.spacing['4']} ${layers.ref.spacing['4']}`,
    backgroundColor: sys.color.surface,
    borderTop: `1px solid ${sys.color.outlineVariant}`,
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        ...baseStyle,
        boxShadow: elevated ? elevation.level2 : 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default M3BottomAppBar;







