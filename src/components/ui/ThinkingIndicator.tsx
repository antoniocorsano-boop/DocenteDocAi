// MD3 Compliant - Updated for layered theme access
// @md3-compliant

import React from 'react';

interface ThinkingIndicatorProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  message = "Pensando...",
  size = 'medium'
}) => {

  const sizeStyles = {
    small: {
      fontSize: 'var(--md-sys-typescale-body-large-font-size)',
      lineHeight: 'var(--md-sys-typescale-body-large-font-size-line-height)',
      fontWeight: 'var(--md-sys-typescale-body-large-font-size-weight)'
    },
    medium: {
      fontSize: 'var(--md-sys-typescale-body-large-font-size)',
      lineHeight: 'var(--md-sys-typescale-body-large-font-size-line-height)',
      fontWeight: 'var(--md-sys-typescale-body-large-font-size-weight)'
    },
    large: {
      fontSize: 'var(--md-sys-typescale-title-large-font-size)',
      lineHeight: 'var(--md-sys-typescale-title-large-font-size-line-height)',
      fontWeight: 'var(--md-sys-typescale-title-large-font-size-weight)'
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--md-sys-spacing-3)',
        padding: 'var(--md-sys-spacing-4)',
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        opacity: 0.5,
        border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-on-primary)',
        borderOpacity: 0.3
      }}
    >
      {/* Animated dots */}
      <div style={{ display: 'flex', gap: 'var(--md-sys-spacing-1)' }}>
        <div
          style={{
            width: 'var(--md-sys-spacing-2)',
            height: 'var(--md-sys-spacing-2)',
            backgroundColor: 'var(--md-sys-color-primary)',
            borderRadius: 'var(--md-sys-percent-50)',
            animation: `pulse var(--md-sys-motion-duration-extra-long) var(--md-sys-motion-easing-standard) infinite`, // MD3 motion tokens for duration and easing
            animationDelay: 'var(--md-sys-motion-duration-0)'
          }}
        />
        <div
          style={{
            width: 'var(--md-sys-spacing-2)',
            height: 'var(--md-sys-spacing-2)',
            backgroundColor: 'var(--md-sys-color-primary)',
            borderRadius: 'var(--md-sys-percent-50)',
            animation: `pulse var(--md-sys-motion-duration-extra-long) var(--md-sys-motion-easing-standard) infinite`, // MD3 motion tokens for duration and easing
            animationDelay: 'var(--md-sys-motion-duration-short)'
          }}
        />
        <div
          style={{
            width: 'var(--md-sys-spacing-2)',
            height: 'var(--md-sys-spacing-2)',
            backgroundColor: 'var(--md-sys-color-primary)',
            borderRadius: 'var(--md-sys-percent-50)',
            animation: `pulse var(--md-sys-motion-duration-extra-long) var(--md-sys-motion-easing-standard) infinite`, // MD3 motion tokens for duration and easing
            animationDelay: 'var(--md-sys-motion-duration-medium)'
          }}
        />
      </div>

      {/* Message */}
      <span
        style={{
          ...sizeStyles[size],
          color: 'var(--md-sys-color-on-surface-variant)',
          fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
          flexGrow: 1
        }}
      >
        {message}
      </span>

      {/* Optional AI icon */}
      <div
        style={{
          width: 'var(--md-sys-spacing-8)',
          height: 'var(--md-sys-spacing-8)',
          borderRadius: 'var(--md-sys-percent-50)',
          backgroundColor: 'var(--md-sys-color-primary)',
          opacity: 0.1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span
          style={{
            fontFamily: 'Material Symbols Outlined',
            fontSize: 'var(--md-sys-typescale-body-large-font-size)',
            color: 'var(--md-sys-color-primary)',
            fontWeight: 'var(--md-sys-typescale-body-large-font-size-weight)',
            lineHeight: 'var(--md-sys-typescale-body-large-font-size-line-height)'
          }}
        >
          smart_toy
        </span>
      </div>
    </div>
  );
};

export default ThinkingIndicator;







