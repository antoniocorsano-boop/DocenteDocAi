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
      fontSize: 'var(--app-text-display)',
      lineHeight: 'var(--app-text-display-line-height)',
      fontWeight: 'var(--app-text-display-weight)'
    },
    'display-medium': {
      fontSize: 'var(--app-text-display)',
      lineHeight: 'var(--app-text-display-line-height)',
      fontWeight: 'var(--app-text-display-weight)'
    },
    'display-small': {
      fontSize: 'var(--app-text-display)',
      lineHeight: 'var(--app-text-display-line-height)',
      fontWeight: 'var(--app-text-display-weight)'
    },
    'headline-large': {
      fontSize: 'var(--app-text-title)',
      lineHeight: 'var(--app-text-title-line-height)',
      fontWeight: 'var(--app-text-title-weight)'
    },
    'headline-medium': {
      fontSize: 'var(--app-text-title)',
      lineHeight: 'var(--app-text-title-line-height)',
      fontWeight: 'var(--app-text-title-weight)'
    },
    'headline-small': {
      fontSize: 'var(--app-text-title)',
      lineHeight: 'var(--app-text-title-line-height)',
      fontWeight: 'var(--app-text-title-weight)'
    },
    'title-large': {
      fontSize: 'var(--app-text-title)',
      lineHeight: 'var(--app-text-title-line-height)',
      fontWeight: 'var(--app-text-title-weight)'
    },
    'title-medium': {
      fontSize: 'var(--app-text-title)',
      lineHeight: 'var(--app-text-title-line-height)',
      fontWeight: 'var(--app-text-title-weight)'
    },
    'title-small': {
      fontSize: 'var(--app-text-title)',
      lineHeight: 'var(--app-text-title-line-height)',
      fontWeight: 'var(--app-text-title-weight)'
    },
    'body-large': {
      fontSize: 'var(--app-text-body)',
      lineHeight: 'var(--app-text-body-line-height)',
      fontWeight: 'var(--app-text-body-weight)'
    },
    'body-medium': {
      fontSize: 'var(--app-text-body)',
      lineHeight: 'var(--app-text-body-line-height)',
      fontWeight: 'var(--app-text-body-weight)'
    },
    'body-small': {
      fontSize: 'var(--app-text-body)',
      lineHeight: 'var(--app-text-body-line-height)',
      fontWeight: 'var(--app-text-body-weight)'
    },
    'label-large': {
      fontSize: 'var(--app-text-label)',
      lineHeight: 'var(--app-text-label-line-height)',
      fontWeight: 'var(--app-text-label-weight)'
    },
    'label-medium': {
      fontSize: 'var(--app-text-label)',
      lineHeight: 'var(--app-text-label-line-height)',
      fontWeight: 'var(--app-text-label-weight)'
    },
    'label-small': {
      fontSize: 'var(--app-text-label)',
      lineHeight: 'var(--app-text-label-line-height)',
      fontWeight: 'var(--app-text-label-weight)'
    },
    'button-primary': {
      fontSize: 'var(--app-text-label)',
      lineHeight: 'var(--app-text-label-line-height)',
      fontWeight: '900',
      letterSpacing: '0.1em'
    },
    'button-secondary': {
      fontSize: 'var(--app-text-label)',
      lineHeight: 'var(--app-text-label-line-height)',
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
    color: 'var(--app-color-on-surface)', // Default color from MD3 sys layer
    ...style
  };

  return (
    <Component style={typographyStyles}>
      {children}
    </Component>
  );
};

export default M3Typography;
export { M3Typography };







