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
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[3],
        padding: spacing[4],
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        opacity: 0.5,
        border: '1px solid var(--md-sys-color-outline-variant)',
        borderOpacity: 0.3
      }}
    >
      {/* Animated dots */}
      <div style={{ display: 'flex', gap: spacing[1] }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--md-sys-color-primary)',
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite',
            animationDelay: '0ms'
          }}
        />
        <div
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--md-sys-color-primary)',
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite',
            animationDelay: '150ms'
          }}
        />
        <div
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--md-sys-color-primary)',
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
          color: 'var(--md-sys-color-on-surface-variant)',
          fontFamily: 'var(--md-sys-typescale-body-large-font-family)'
        }}
      >
        {message}
      </span>

      {/* Optional AI icon */}
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: 'var(--md-sys-color-primary)',
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
            fontSize: typography.caption.fontSize,
            color: 'var(--md-sys-color-primary)',
            fontWeight: typography.caption.fontWeight,
            lineHeight: typography.caption.lineHeight
          }}
        >
          smart_toy
        </span>
      </div>
    </div>
  );
};

export default ThinkingIndicator;

