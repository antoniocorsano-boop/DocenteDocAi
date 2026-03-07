// Thin MUI wrapper — preserves M3Typography props API for backward compatibility
// @mui-migrated Fase 2
import React from 'react';
import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';

export interface M3TypographyProps {
  variant?: 'display-large' | 'display-medium' | 'display-small' |
           'headline-large' | 'headline-medium' | 'headline-small' |
           'title-large' | 'title-medium' | 'title-small' |
           'body-large' | 'body-medium' | 'body-small' |
           'label-large' | 'label-medium' | 'label-small' |
           'button-primary' | 'button-secondary';
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
  children?: React.ReactNode;
  style?: React.CSSProperties;
  color?: string;
  id?: string;
  title?: string;
  htmlFor?: string;
  dangerouslySetInnerHTML?: { __html: string };
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  /** Passed-through to MUI Typography — adds bottom margin */
  gutterBottom?: boolean;
  role?: string;
  'aria-live'?: 'off' | 'assertive' | 'polite';
  'aria-level'?: number;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

const VARIANT_MAP: Record<
  NonNullable<M3TypographyProps['variant']>,
  { muiVariant: TypographyProps['variant']; defaultTag: string }
> = {
  'display-large':    { muiVariant: 'h1',        defaultTag: 'h1' },
  'display-medium':   { muiVariant: 'h2',        defaultTag: 'h1' },
  'display-small':    { muiVariant: 'h3',        defaultTag: 'h1' },
  'headline-large':   { muiVariant: 'h4',        defaultTag: 'h2' },
  'headline-medium':  { muiVariant: 'h5',        defaultTag: 'h2' },
  'headline-small':   { muiVariant: 'h6',        defaultTag: 'h3' },
  'title-large':      { muiVariant: 'subtitle1', defaultTag: 'h4' },
  'title-medium':     { muiVariant: 'subtitle2', defaultTag: 'h5' },
  'title-small':      { muiVariant: 'subtitle2', defaultTag: 'h6' },
  'body-large':       { muiVariant: 'body1',     defaultTag: 'p'  },
  'body-medium':      { muiVariant: 'body2',     defaultTag: 'p'  },
  'body-small':       { muiVariant: 'body2',     defaultTag: 'p'  },
  'label-large':      { muiVariant: 'button',    defaultTag: 'span' },
  'label-medium':     { muiVariant: 'caption',   defaultTag: 'span' },
  'label-small':      { muiVariant: 'caption',   defaultTag: 'span' },
  'button-primary':   { muiVariant: 'button',    defaultTag: 'span' },
  'button-secondary': { muiVariant: 'caption',   defaultTag: 'span' },
};

const M3Typography: React.FC<M3TypographyProps> = ({
  variant = 'body-large',
  as,
  children,
  style,
  color,
  id,
  title,
  htmlFor,
  dangerouslySetInnerHTML,
  onClick,
  className,
  gutterBottom,
  role,
  'aria-live': ariaLive,
  'aria-level': ariaLevel,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-hidden': ariaHidden,
}) => {
  const config = VARIANT_MAP[variant] ?? VARIANT_MAP['body-large'];
  const component = (as ?? config.defaultTag) as React.ElementType;
  const extraProps = htmlFor ? { htmlFor } : {};

  return (
    <Typography
      variant={config.muiVariant}
      component={component}
      id={id}
      title={title}
      gutterBottom={gutterBottom}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      onClick={onClick}
      className={className}
      role={role}
      aria-live={ariaLive}
      aria-level={ariaLevel}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-hidden={ariaHidden}
      sx={{ color: color ?? 'inherit', margin: 0, ...style }}
      {...extraProps}
    >
      {dangerouslySetInnerHTML ? undefined : children}
    </Typography>
  );
};

export default M3Typography;
export { M3Typography };

