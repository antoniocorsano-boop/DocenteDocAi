// LEGACY - MD3 Non-compliant
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
  const { layers } = useTheme();
  const { ref, sys } = layers;

  // Map MD3 variants to ref.typography keys
  const typographyMap: Record<string, keyof typeof ref.typography> = {
    'display-large': 'h1',
    'display-medium': 'h2',
    'display-small': 'h3',
    'headline-large': 'h4',
    'headline-medium': 'h5',
    'headline-small': 'h6',
    'title-large': 'subtitle1',
    'title-medium': 'subtitle2',
    'title-small': 'overline',
    'body-large': 'body1',
    'body-medium': 'body2',
    'body-small': 'caption',
    'label-large': 'button',
    'label-medium': 'button',
    'label-small': 'caption'
  };

  const typographyKey = typographyMap[variant] || 'body1';
  const token = ref.typography[typographyKey];

  // Typography styles using ref.typography tokens
  const typographyStyles = {
    fontFamily: 'inherit', // Use inherited font family
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: token.lineHeight,
    letterSpacing: token.letterSpacing,
    color: sys.color.onSurface, // Default color from sys layer
    ...style
  };

  return (
    <Component style={typographyStyles}>
      {children}
    </Component>
  );
};

export default M3Typography;






