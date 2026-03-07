// Thin MUI wrapper — preserves M3Surface props API for backward compatibility
// @mui-migrated Fase 2
import React from 'react';
import { Paper } from '@mui/material';

/** MD3 surface container level: 0 = base surface, 5 = highest container. */
type SurfaceLevel = 0 | 1 | 2 | 3 | 4 | 5;

const SURFACE_BGCOLOR: Record<SurfaceLevel, string> = {
  0: 'var(--md-sys-color-surface)',
  1: 'var(--md-sys-color-surface-container-lowest)',
  2: 'var(--md-sys-color-surface-container-low)',
  3: 'var(--md-sys-color-surface-container)',
  4: 'var(--md-sys-color-surface-container-high)',
  5: 'var(--md-sys-color-surface-container-highest)',
};

export interface M3SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  /** Elevation level from 0 (base) to 5 (highest container). Default: 0 */
  level?: SurfaceLevel;
  /** Render as this HTML element. Default: 'div' */
  as?: 'div' | 'section' | 'article' | 'aside' | 'main' | 'li' | 'button';
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  /** Shape token name, e.g. 'corner-medium'. Default: none */
  shape?: string;
  // Legacy props from old M3Surface — accepted & silently ignored for backward compat
  variant?: string;
  elevation?: number | string;
  interactive?: boolean;
  padding?: string;
}

const M3Surface: React.FC<M3SurfaceProps> = ({
  level = 0,
  as: component = 'div',
  children,
  style,
  shape,
  // Legacy props — destructured to prevent passing to Paper
  variant: _variant,
  elevation: _elevation,
  interactive: _interactive,
  padding: _padding,
  ...rest
}) => (
  <Paper
    component={component as React.ElementType}
    elevation={0}
    sx={{
      bgcolor: SURFACE_BGCOLOR[level],
      color: 'var(--md-sys-color-on-surface)',
      borderRadius: shape ? `var(--md-sys-shape-${shape})` : undefined,
      ...style,
    }}
    {...rest}
  >
    {children}
  </Paper>
);

export default M3Surface;
export { M3Surface };

