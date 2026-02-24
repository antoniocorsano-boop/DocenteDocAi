/**
 * M3LinearProgress.tsx
 * Material Design 3 Linear Progress Indicator
 * https://m3.material.io/components/progress-indicators/overview
 */

import React from 'react';

interface M3LinearProgressProps {
  /** Progress value from 0 to 100 */
  value?: number;
  /** Indeterminate animation when true */
  indeterminate?: boolean;
  /** Visual style variant */
  variant?: 'linear' | 'buffer';
  /** Buffer value for buffer variant (0-100) */
  bufferValue?: number;
  /** Custom color (defaults to primary) */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';
  /** Height of the progress bar */
  thickness?: 'small' | 'medium' | 'large';
  /** Optional label to display */
  label?: string;
  /** Show percentage label */
  showPercentage?: boolean;
}

const M3LinearProgress: React.FC<M3LinearProgressProps> = ({
  value = 0,
  indeterminate = false,
  variant = 'linear',
  bufferValue = 0,
  color = 'primary',
  thickness = 'medium',
  label,
  showPercentage = false,
}) => {
  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));
  const clampedBuffer = Math.max(0, Math.min(100, bufferValue));

  const getColor = () => {
    switch (color) {
      case 'primary':
        return 'var(--md-sys-color-primary)';
      case 'secondary':
        return 'var(--md-sys-color-secondary)';
      case 'tertiary':
        return 'var(--md-sys-color-tertiary)';
      case 'error':
        return 'var(--md-sys-color-error)';
      default:
        return 'var(--md-sys-color-primary)';
    }
  };

  const getTrackColor = () => {
    switch (color) {
      case 'primary':
        return 'var(--md-sys-color-primary-container)';
      case 'secondary':
        return 'var(--md-sys-color-secondary-container)';
      case 'tertiary':
        return 'var(--md-sys-color-tertiary-container)';
      case 'error':
        return 'var(--md-sys-color-error-container)';
      default:
        return 'var(--md-sys-color-primary-container)';
    }
  };

  const getHeight = () => {
    switch (thickness) {
      case 'small':
        return '4px';
      case 'medium':
        return '8px';
      case 'large':
        return '12px';
      default:
        return '8px';
    }
  };

  const getBorderRadius = () => {
    switch (thickness) {
      case 'small':
        return 'var(--md-sys-shape-corner-small)';
      case 'medium':
        return 'var(--md-sys-shape-corner-medium)';
      case 'large':
        return 'var(--md-sys-shape-corner-large)';
      default:
        return 'var(--md-sys-shape-corner-medium)';
    }
  };

  return (
    <div
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || 'Progress'}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-2)',
      }}
    >
      {/* Label row */}
      {(label || showPercentage) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {label && (
            <span
              style={{
                fontFamily: 'var(--md-sys-typescale-body-medium-font-family)',
                fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                color: 'var(--md-sys-color-on-surface)',
              }}
            >
              {label}
            </span>
          )}
          {showPercentage && !indeterminate && (
            <span
              style={{
                fontFamily: 'var(--md-sys-typescale-body-medium-font-family)',
                fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                color: 'var(--md-sys-color-on-surface-variant)',
              }}
            >
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}

      {/* Progress track */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: getHeight(),
          backgroundColor: getTrackColor(),
          borderRadius: getBorderRadius(),
          overflow: 'hidden',
        }}
      >
        {/* Buffer track (for buffer variant) */}
        {variant === 'buffer' && !indeterminate && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${clampedBuffer}%`,
              backgroundColor: getColor(),
              opacity: 0.3,
              transition: `width var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)`,
            }}
          />
        )}

        {/* Main progress indicator */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: indeterminate ? '30%' : `${clampedValue}%`,
            backgroundColor: getColor(),
            borderRadius: getBorderRadius(),
            transition: indeterminate
              ? undefined
              : `width var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)`,
            animation: indeterminate
              ? 'm3-linear-progress-indeterminate 2s infinite linear'
              : undefined,
          }}
        />
      </div>

      {/* Indeterminate animation styles */}
      {indeterminate && (
        <style>{`
          @keyframes m3-linear-progress-indeterminate {
            0% {
              left: -30%;
            }
            50% {
              left: 30%;
            }
            100% {
              left: 100%;
            }
          }
        `}</style>
      )}
    </div>
  );
};

export default M3LinearProgress;
