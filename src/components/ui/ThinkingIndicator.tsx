// MD3 Compliant - Updated for layered theme access
// @md3-compliant

import React from 'react';
import { useTheme } from '../../theme/theme';

interface ThinkingIndicatorProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  message = "Pensando...",
  size = 'medium'
}) => {
  const { layers: { sys: { color }, ref: { spacing, shape, typography } } } = useTheme();

  const sizeStyles = {
    small: {
      fontSize: typography.bodyMedium.fontSize,
      lineHeight: typography.bodyMedium.lineHeight,
      fontWeight: typography.bodyMedium.fontWeight
    },
    medium: {
      fontSize: typography.bodyLarge.fontSize,
      lineHeight: typography.bodyLarge.lineHeight,
      fontWeight: typography.bodyLarge.fontWeight
    },
    large: {
      fontSize: typography.headlineSmall.fontSize,
      lineHeight: typography.headlineSmall.lineHeight,
      fontWeight: typography.headlineSmall.fontWeight
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[3],
        padding: spacing[4],
        borderRadius: shape.corner.medium,
        backgroundColor: color.surfaceContainerLow,
        opacity: 0.5,
        border: `1px solid ${color.onPrimary}`,
        borderOpacity: 0.3
      }}
    >
      {/* Animated dots */}
      <div style={{ display: 'flex', gap: spacing[1] }}>
        <div
          style={{
            width: spacing[2],
            height: spacing[2],
            backgroundColor: color.primary,
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite',
            animationDelay: '0ms'
          }}
        />
        <div
          style={{
            width: spacing[2],
            height: spacing[2],
            backgroundColor: color.primary,
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite',
            animationDelay: '150ms'
          }}
        />
        <div
          style={{
            width: spacing[2],
            height: spacing[2],
            backgroundColor: color.primary,
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite',
            animationDelay: '300ms'
          }}
        />
      </div>

      {/* Message */}
      <span
        style={{
          ...sizeStyles[size],
          color: color.onSurfaceVariant,
          fontFamily: 'var(--md-sys-typescale-body-large-font-family)'
        }}
      >
        {message}
      </span>

      {/* Optional AI icon */}
      <div
        style={{
          width: spacing[8],
          height: spacing[8],
          borderRadius: '50%',
          backgroundColor: color.primary,
          opacity: 0.1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 'auto'
        }}
      >
        <span
          style={{
            fontFamily: 'Material Symbols Outlined',
            fontSize: typography.bodySmall.fontSize,
            color: color.primary,
            fontWeight: typography.bodySmall.fontWeight,
            lineHeight: typography.bodySmall.lineHeight
          }}
        >
          smart_toy
        </span>
      </div>
    </div>
  );
};

export default ThinkingIndicator;






