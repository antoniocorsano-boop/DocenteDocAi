// MD3 Native - Fully Compliant
import React from 'react';

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
}

/** Maps each MD3 typescale variant to its direct --md-sys-typescale-* tokens. */
type TypographyConfig = {
  key: string;       // maps to --md-sys-typescale-{key}-{property}
  defaultTag: M3TypographyProps['as'];
};

const VARIANT_MAP: Record<NonNullable<M3TypographyProps['variant']>, TypographyConfig> = {
  'display-large':    { key: 'display-large',   defaultTag: 'h1' },
  'display-medium':   { key: 'display-medium',  defaultTag: 'h1' },
  'display-small':    { key: 'display-small',   defaultTag: 'h1' },
  'headline-large':   { key: 'headline-large',  defaultTag: 'h2' },
  'headline-medium':  { key: 'headline-medium', defaultTag: 'h2' },
  'headline-small':   { key: 'headline-small',  defaultTag: 'h3' },
  'title-large':      { key: 'title-large',     defaultTag: 'h4' },
  'title-medium':     { key: 'title-medium',    defaultTag: 'h5' },
  'title-small':      { key: 'title-small',     defaultTag: 'h6' },
  'body-large':       { key: 'body-large',      defaultTag: 'p'  },
  'body-medium':      { key: 'body-medium',     defaultTag: 'p'  },
  'body-small':       { key: 'body-small',      defaultTag: 'p'  },
  'label-large':      { key: 'label-large',     defaultTag: 'span' },
  'label-medium':     { key: 'label-medium',    defaultTag: 'span' },
  'label-small':      { key: 'label-small',     defaultTag: 'span' },
  // backwards-compat aliases used throughout the app
  'button-primary':   { key: 'label-large',     defaultTag: 'span' },
  'button-secondary': { key: 'label-medium',    defaultTag: 'span' },
};

/** Extra overrides for legacy button variants */
const BUTTON_OVERRIDES: Partial<Record<NonNullable<M3TypographyProps['variant']>, React.CSSProperties>> = {
  'button-primary':   { fontWeight: 'var(--md-sys-typescale-weight-black)', letterSpacing: '0.1em' },
  'button-secondary': { fontWeight: 'var(--md-sys-typescale-weight-bold)', letterSpacing: '0.05em' },
};

const M3Typography: React.FC<M3TypographyProps> = ({
  variant = 'body-large',
  as,
  children,
  style = {},
  color,
  id,
  title,
  htmlFor,
  dangerouslySetInnerHTML,
  onClick,
  className,
}) => {
  const config = VARIANT_MAP[variant] ?? VARIANT_MAP['body-large'];
  const k = config.key;
  const Component = as ?? config.defaultTag ?? 'span';

  const typographyStyles: React.CSSProperties = {
    fontFamily:    'var(--font-family)',
    fontSize:      `var(--md-sys-typescale-${k}-font-size)`,
    fontWeight:    `var(--md-sys-typescale-${k}-font-weight)`,
    lineHeight:    `var(--md-sys-typescale-${k}-line-height)`,
    letterSpacing: `var(--md-sys-typescale-${k}-tracking)`,
    color:         color ?? 'inherit',
    margin:        0,
    ...BUTTON_OVERRIDES[variant],
    ...style,
  };

  return (
    <Component
      style={typographyStyles}
      id={id}
      title={title}
      htmlFor={htmlFor as string | undefined}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      onClick={onClick}
      className={className}
    >
      {dangerouslySetInnerHTML ? undefined : children}
    </Component>
  );
};

export default M3Typography;
export { M3Typography };

