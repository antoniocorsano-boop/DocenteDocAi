// MD3 Native - Fully Compliant
import React from 'react';

export interface M3TypographyProps {
  variant?: 'display-large' | 'display-medium' | 'display-small' |
           'headline-large' | 'headline-medium' | 'headline-small' |
           'title-large' | 'title-medium' | 'title-small' |
           'body-large' | 'body-medium' | 'body-small' |
           'label-large' | 'label-medium' | 'label-small' |
           'button-primary' | 'button-secondary';
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
  // Map MD3 variants to CSS custom properties
  const typographyMap: Record<string, {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
    letterSpacing?: string;
  }> = {
    'display-large': {
      fontSize: 'var(--md-sys-typescale-display-large-font-size)',
      lineHeight: 'var(--md-sys-typescale-display-large-line-height)',
      fontWeight: 'var(--md-sys-typescale-display-large-font-weight)'
    },
    'display-medium': {
      fontSize: 'var(--md-sys-typescale-display-medium-font-size)',
      lineHeight: 'var(--md-sys-typescale-display-medium-line-height)',
      fontWeight: 'var(--md-sys-typescale-display-medium-font-weight)'
    },
    'display-small': {
      fontSize: 'var(--md-sys-typescale-display-small-font-size)',
      lineHeight: 'var(--md-sys-typescale-display-small-line-height)',
      fontWeight: 'var(--md-sys-typescale-display-small-font-weight)'
    },
    'headline-large': {
      fontSize: 'var(--md-sys-typescale-headline-large-font-size)',
      lineHeight: 'var(--md-sys-typescale-headline-large-line-height)',
      fontWeight: 'var(--md-sys-typescale-headline-large-font-weight)'
    },
    'headline-medium': {
      fontSize: 'var(--md-sys-typescale-headline-medium-font-size)',
      lineHeight: 'var(--md-sys-typescale-headline-medium-line-height)',
      fontWeight: 'var(--md-sys-typescale-headline-medium-font-weight)'
    },
    'headline-small': {
      fontSize: 'var(--md-sys-typescale-headline-small-font-size)',
      lineHeight: 'var(--md-sys-typescale-headline-small-line-height)',
      fontWeight: 'var(--md-sys-typescale-headline-small-font-weight)'
    },
    'title-large': {
      fontSize: 'var(--md-sys-typescale-title-large-font-size)',
      lineHeight: 'var(--md-sys-typescale-title-large-line-height)',
      fontWeight: 'var(--md-sys-typescale-title-large-font-weight)'
    },
    'title-medium': {
      fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
      lineHeight: 'var(--md-sys-typescale-title-medium-line-height)',
      fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)'
    },
    'title-small': {
      fontSize: 'var(--md-sys-typescale-title-small-font-size)',
      lineHeight: 'var(--md-sys-typescale-title-small-line-height)',
      fontWeight: 'var(--md-sys-typescale-title-small-font-weight)'
    },
    'body-large': {
      fontSize: 'var(--md-sys-typescale-body-large-font-size)',
      lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
      fontWeight: 'var(--md-sys-typescale-body-large-font-weight)'
    },
    'body-medium': {
      fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
      lineHeight: 'var(--md-sys-typescale-body-medium-line-height)',
      fontWeight: 'var(--md-sys-typescale-body-medium-font-weight)'
    },
    'body-small': {
      fontSize: 'var(--md-sys-typescale-body-small-font-size)',
      lineHeight: 'var(--md-sys-typescale-body-small-line-height)',
      fontWeight: 'var(--md-sys-typescale-body-small-font-weight)'
    },
    'label-large': {
      fontSize: 'var(--md-sys-typescale-label-large-font-size)',
      lineHeight: 'var(--md-sys-typescale-label-large-line-height)',
      fontWeight: 'var(--md-sys-typescale-label-large-font-weight)'
    },
    'label-medium': {
      fontSize: 'var(--md-sys-typescale-label-medium-font-size)',
      lineHeight: 'var(--md-sys-typescale-label-medium-line-height)',
      fontWeight: 'var(--md-sys-typescale-label-medium-font-weight)'
    },
    'label-small': {
      fontSize: 'var(--md-sys-typescale-label-small-font-size)',
      lineHeight: 'var(--md-sys-typescale-label-small-line-height)',
      fontWeight: 'var(--md-sys-typescale-label-small-font-weight)'
    },
    'button-primary': {
      fontSize: 'var(--md-sys-typescale-label-large-font-size)',
      lineHeight: 'var(--md-sys-typescale-label-large-line-height)',
      fontWeight: '900',
      letterSpacing: '0.1em'
    },
    'button-secondary': {
      fontSize: 'var(--md-sys-typescale-label-medium-font-size)',
      lineHeight: 'var(--md-sys-typescale-label-medium-line-height)',
      fontWeight: '700',
      letterSpacing: '0.05em'
    }
  };

  const typographyConfig = typographyMap[variant] || typographyMap['body-large'];

  // Typography styles using MD3 CSS custom properties
  const typographyStyles = {
    fontFamily: 'var(--md-sys-typescale-font-family)',
    fontSize: typographyConfig.fontSize,
    fontWeight: typographyConfig.fontWeight,
    lineHeight: typographyConfig.lineHeight,
    letterSpacing: typographyConfig.letterSpacing || 'var(--md-sys-typescale-body-large-letter-spacing)',
    color: 'var(--md-sys-color-on-surface)', // Default color from MD3 sys layer
    ...style
  };

  return (
    <Component style={typographyStyles}>
      {children}
    </Component>
  );
};

export default M3Typography;






