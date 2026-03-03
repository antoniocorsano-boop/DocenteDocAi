// MD3 Native — Clean surface wrapper with standard elevation levels 0-5
// No glass, interactive, or expressive logic — use M3SurfaceCard for those.
import React from 'react';

/** MD3 surface container level: 0 = base surface, 5 = highest container. */
type SurfaceLevel = 0 | 1 | 2 | 3 | 4 | 5;

const SURFACE_BACKGROUND: Record<SurfaceLevel, string> = {
  0: 'var(--md-sys-color-surface)',
  1: 'var(--md-sys-color-surface-container-lowest)',
  2: 'var(--md-sys-color-surface-container-low)',
  3: 'var(--md-sys-color-surface-container)',
  4: 'var(--md-sys-color-surface-container-high)',
  5: 'var(--md-sys-color-surface-container-highest)',
};

export interface M3SurfaceProps {
  /** Elevation level from 0 (base) to 5 (highest container). Default: 0 */
  level?: SurfaceLevel;
  /** Render as this HTML element. Default: 'div' */
  as?: 'div' | 'section' | 'article' | 'aside' | 'main' | 'li';
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: never; // className forbidden by MD3 governance contract
  /** Shape token name, e.g. 'corner-medium'. Default: none */
  shape?: string;
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const M3Surface: React.FC<M3SurfaceProps> = ({
  level = 0,
  as: Component = 'div',
  children,
  style = {},
  shape,
  ...rest
}) => {
  const surfaceStyle: React.CSSProperties = {
    backgroundColor: SURFACE_BACKGROUND[level],
    color: 'var(--md-sys-color-on-surface)',
    borderRadius: shape ? `var(--md-sys-shape-${shape})` : undefined,
    ...style,
  };

  return (
    <Component style={surfaceStyle} {...rest}>
      {children}
    </Component>
  );
};

export default M3Surface;
export { M3Surface };
