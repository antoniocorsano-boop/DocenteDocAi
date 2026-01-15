// LEGACY - MD3 Non-compliant
// @legacy
// @md3-noncompliant
// @do-not-extend

import React from 'react';
import { useTheme } from '../../theme/theme';
import { useTheme } from '../../theme/theme';

interface ThinkingIndicatorProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  message = "Pensando...",
  size = 'medium'
}) => {
  const { layers } = useTheme();
  const { spacing, typography } = useTheme();

  const sizeStyles = {
    small: {
      fontSize: typography.body2.fontSize,
      lineHeight: typography.body2.lineHeight,
      fontWeight: typography.body2.fontWeight
    },
    medium: {
      fontSize: typography.body1.fontSize,
      lineHeight: typography.body1.lineHeight,
      fontWeight: typography.body1.fontWeight
    },
    large: {
      fontSize: typography.heading2.fontSize,
      lineHeight: typography.heading2.lineHeight,
      fontWeight: typography.heading2.fontWeight
    }
  };

  return (
    <div
      style={{display: 'flex',
        alignItems: 'center',
        gap: spacing[3],
        padding: spacing[4],
        borderRadius: 'layers.ref.shape.corner.medium',
        backgroundColor: 'layers.sys.color.surface-container-low',
        opacity: 0.5,
        border: '1px solid layers.sys.color.outline-variant',
        borderOpacity: 0.3}}
    >
      {/* Animated dots */}
      <div style={{ display: 'flex', gap: spacing[1] }}>
        <div
          style={{width: ref.spacing[8],
            height: ref.spacing[8],
            backgroundColor: 'layers.sys.color.primary',
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite',
            animationDelay: '0ms'}}
        />
        <div
          style={{width: ref.spacing[8],
            height: ref.spacing[8],
            backgroundColor: 'layers.sys.color.primary',
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite',
            animationDelay: '150ms'}}
        />
        <div
          style={{width: ref.spacing[8],
            height: ref.spacing[8],
            backgroundColor: 'layers.sys.color.primary',
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite',
            animationDelay: '300ms'}}
        />
      </div>

      {/* Message */}
      <span
        style={{...sizeStyles[size],
          color: 'layers.sys.color.on-surface-variant',
          fontFamily: 'var(--md-sys-typescale-body-large-font-family)'}}
      >
        {message}
      </span>

      {/* Optional AI icon */}
      <div
        style={{width: ref.spacing[24],
          height: ref.spacing[24],
          borderRadius: '50%',
          backgroundColor: 'layers.sys.color.primary',
          opacity: 0.1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 'auto'}}
      >
        <span
          style={{fontFamily: 'Material Symbols Outlined',
            fontSize: typography.caption.fontSize,
            color: 'layers.sys.color.primary',
            fontWeight: typography.caption.fontWeight,
            lineHeight: typography.caption.lineHeight}}
        >
          smart_toy
        </span>
      </div>
    </div>
  );
};

export default ThinkingIndicator;


