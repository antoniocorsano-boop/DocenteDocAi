import React from 'react';
import { useTheme } from '../../theme/theme';

export interface M3TypographyProps {
  variant?: 'display-large' | 'display-medium' | 'display-small' |
           'headline-large' | 'headline-medium' | 'headline-small' |
           'title-large' | 'title-medium' | 'title-small' |
           'body-large' | 'body-medium' | 'body-small' |
           'label-large' | 'label-medium' | 'label-small';
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const M3Typography: React.FC<M3TypographyProps> = ({
  variant = 'body-large',
  as: Component = 'span',
  children,
  style = {}
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
  // Typography styles using complete MD3 design tokens
  const typographyStyles = {
    'display-large': {
      fontFamily: 'var(--md-sys-typescale-display-large-font-family)',
      fontSize: 'var(--md-sys-typescale-display-large-font-size)',
      fontWeight: 'var(--md-sys-typescale-display-large-font-weight)',
      lineHeight: 'var(--md-sys-typescale-display-large-line-height)',
      letterSpacing: 'var(--md-sys-typescale-display-large-letter-spacing)'
    },
    'display-medium': {
      fontFamily: 'var(--md-sys-typescale-display-medium-font-family)',
      fontSize: 'var(--md-sys-typescale-display-medium-font-size)',
      fontWeight: 'var(--md-sys-typescale-display-medium-font-weight)',
      lineHeight: 'var(--md-sys-typescale-display-medium-line-height)',
      letterSpacing: 'var(--md-sys-typescale-display-medium-letter-spacing)'
    },
    'display-small': {
      fontFamily: 'var(--md-sys-typescale-display-small-font-family)',
      fontSize: 'var(--md-sys-typescale-display-small-font-size)',
      fontWeight: 'var(--md-sys-typescale-display-small-font-weight)',
      lineHeight: 'var(--md-sys-typescale-display-small-line-height)',
      letterSpacing: 'var(--md-sys-typescale-display-small-letter-spacing)'
    },
    'headline-large': {
      fontFamily: 'var(--md-sys-typescale-headline-large-font-family)',
      fontSize: 'var(--md-sys-typescale-headline-large-font-size)',
      fontWeight: 'var(--md-sys-typescale-headline-large-font-weight)',
      lineHeight: 'var(--md-sys-typescale-headline-large-line-height)',
      letterSpacing: 'var(--md-sys-typescale-headline-large-letter-spacing)'
    },
    'headline-medium': {
      fontFamily: 'var(--md-sys-typescale-headline-medium-font-family)',
      fontSize: 'var(--md-sys-typescale-headline-medium-font-size)',
      fontWeight: 'var(--md-sys-typescale-headline-medium-font-weight)',
      lineHeight: 'var(--md-sys-typescale-headline-medium-line-height)',
      letterSpacing: 'var(--md-sys-typescale-headline-medium-letter-spacing)'
    },
    'headline-small': {
      fontFamily: 'var(--md-sys-typescale-headline-small-font-family)',
      fontSize: 'var(--md-sys-typescale-headline-small-font-size)',
      fontWeight: 'var(--md-sys-typescale-headline-small-font-weight)',
      lineHeight: 'var(--md-sys-typescale-headline-small-line-height)',
      letterSpacing: 'var(--md-sys-typescale-headline-small-letter-spacing)'
    },
    'title-large': {
      fontFamily: 'var(--md-sys-typescale-title-large-font-family)',
      fontSize: 'var(--md-sys-typescale-title-large-font-size)',
      fontWeight: 'var(--md-sys-typescale-title-large-font-weight)',
      lineHeight: 'var(--md-sys-typescale-title-large-line-height)',
      letterSpacing: 'var(--md-sys-typescale-title-large-letter-spacing)'
    },
    'title-medium': {
      fontFamily: 'var(--md-sys-typescale-title-medium-font-family)',
      fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
      fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
      lineHeight: 'var(--md-sys-typescale-title-medium-line-height)',
      letterSpacing: 'var(--md-sys-typescale-title-medium-letter-spacing)'
    },
    'title-small': {
      fontFamily: 'var(--md-sys-typescale-title-small-font-family)',
      fontSize: 'var(--md-sys-typescale-title-small-font-size)',
      fontWeight: 'var(--md-sys-typescale-title-small-font-weight)',
      lineHeight: 'var(--md-sys-typescale-title-small-line-height)',
      letterSpacing: 'var(--md-sys-typescale-title-small-letter-spacing)'
    },
    'body-large': {
      fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
      fontSize: 'var(--md-sys-typescale-body-large-font-size)',
      fontWeight: 'var(--md-sys-typescale-body-large-font-weight)',
      lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
      letterSpacing: 'var(--md-sys-typescale-body-large-letter-spacing)'
    },
    'body-medium': {
      fontFamily: 'var(--md-sys-typescale-body-medium-font-family)',
      fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
      fontWeight: 'var(--md-sys-typescale-body-medium-font-weight)',
      lineHeight: 'var(--md-sys-typescale-body-medium-line-height)',
      letterSpacing: 'var(--md-sys-typescale-body-medium-letter-spacing)'
    },
    'body-small': {
      fontFamily: 'var(--md-sys-typescale-body-small-font-family)',
      fontSize: 'var(--md-sys-typescale-body-small-font-size)',
      fontWeight: 'var(--md-sys-typescale-body-small-font-weight)',
      lineHeight: 'var(--md-sys-typescale-body-small-line-height)',
      letterSpacing: 'var(--md-sys-typescale-body-small-letter-spacing)'
    },
    'label-large': {
      fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
      fontSize: 'var(--md-sys-typescale-label-large-font-size)',
      fontWeight: 'var(--md-sys-typescale-label-large-font-weight)',
      lineHeight: 'var(--md-sys-typescale-label-large-line-height)',
      letterSpacing: 'var(--md-sys-typescale-label-large-letter-spacing)'
    },
    'label-medium': {
      fontFamily: 'var(--md-sys-typescale-label-medium-font-family)',
      fontSize: 'var(--md-sys-typescale-label-medium-font-size)',
      fontWeight: 'var(--md-sys-typescale-label-medium-font-weight)',
      lineHeight: 'var(--md-sys-typescale-label-medium-line-height)',
      letterSpacing: 'var(--md-sys-typescale-label-medium-letter-spacing)'
    },
    'label-small': {
      fontFamily: 'var(--md-sys-typescale-label-small-font-family)',
      fontSize: 'var(--md-sys-typescale-label-small-font-size)',
      fontWeight: 'var(--md-sys-typescale-label-small-font-weight)',
      lineHeight: 'var(--md-sys-typescale-label-small-line-height)',
      letterSpacing: 'var(--md-sys-typescale-label-small-letter-spacing)'
    }
  };

  const variantStyle = typographyStyles[variant];

  return (
    <Component
      style={{
        color: 'var(--md-sys-color-on-surface)',
        ...variantStyle,
        ...style
      }}
    >
      {children}
    </Component>
  );
};

export default M3Typography;

