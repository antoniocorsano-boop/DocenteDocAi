import React from 'react';
import { cn } from '../../utils/cn';

export interface M3TypographyProps {
  variant?: 'display-large' | 'display-medium' | 'display-small' |
           'headline-large' | 'headline-medium' | 'headline-small' |
           'title-large' | 'title-medium' | 'title-small' |
           'body-large' | 'body-medium' | 'body-small' |
           'label-large' | 'label-medium' | 'label-small';
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const M3Typography: React.FC<M3TypographyProps> = ({
  variant = 'body-large',
  as: Component = 'span',
  children,
  style = {},
  className
}) => {
  // Typography styles using MD3 design tokens
  const typographyStyles = {
    'display-large': {
      fontSize: 'var(--md-sys-typescale-display-large)',
      lineHeight: '1.1',
      fontWeight: '400'
    },
    'display-medium': {
      fontSize: 'var(--md-sys-typescale-display-medium)',
      lineHeight: '1.1',
      fontWeight: '400'
    },
    'display-small': {
      fontSize: 'var(--md-sys-typescale-display-small)',
      lineHeight: '1.2',
      fontWeight: '400'
    },
    'headline-large': {
      fontSize: 'var(--md-sys-typescale-headline-large)',
      lineHeight: '1.25',
      fontWeight: '400'
    },
    'headline-medium': {
      fontSize: 'var(--md-sys-typescale-headline-medium)',
      lineHeight: '1.25',
      fontWeight: '400'
    },
    'headline-small': {
      fontSize: 'var(--md-sys-typescale-headline-small)',
      lineHeight: '1.25',
      fontWeight: '400'
    },
    'title-large': {
      fontSize: 'var(--md-sys-typescale-title-large)',
      lineHeight: '1.33',
      fontWeight: '500'
    },
    'title-medium': {
      fontSize: 'var(--md-sys-typescale-title-medium)',
      lineHeight: '1.5',
      fontWeight: '500'
    },
    'title-small': {
      fontSize: 'var(--md-sys-typescale-title-small)',
      lineHeight: '1.5',
      fontWeight: '500'
    },
    'body-large': {
      fontSize: 'var(--md-sys-typescale-body-large)',
      lineHeight: '1.5',
      fontWeight: '400'
    },
    'body-medium': {
      fontSize: 'var(--md-sys-typescale-body-medium)',
      lineHeight: '1.5',
      fontWeight: '400'
    },
    'body-small': {
      fontSize: 'var(--md-sys-typescale-body-small)',
      lineHeight: '1.5',
      fontWeight: '400'
    },
    'label-large': {
      fontSize: 'var(--md-sys-typescale-label-large)',
      lineHeight: '1.43',
      fontWeight: '500'
    },
    'label-medium': {
      fontSize: 'var(--md-sys-typescale-label-medium)',
      lineHeight: '1.33',
      fontWeight: '500'
    },
    'label-small': {
      fontSize: 'var(--md-sys-typescale-label-small)',
      lineHeight: '1.5',
      fontWeight: '500'
    }
  };

  const variantStyle = typographyStyles[variant];

  return (
    <Component
      className={cn('font-roboto text-[var(--md-sys-color-on-surface)]', className)}
      style={{
        ...variantStyle,
        ...style
      }}
    >
      {children}
    </Component>
  );
};

export default M3Typography;