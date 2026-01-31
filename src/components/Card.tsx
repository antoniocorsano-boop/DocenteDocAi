/* GENERATED: MD3 Platinum Recovery — DO NOT EDIT MANUALLY */

import React, { useState } from 'react';
import { M3Typography } from './ui';

interface CardProps {
  title?: string;
  content?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  label?: string;
  variant?: 'elevated' | 'filled' | 'outlined';
  isLoading?: boolean;
  error?: string;
}

export const Card: React.FC<CardProps> = ({
  title = 'Titolo Card',
  content = 'Contenuto della card.',
  onClick,
  fullWidth = true,
  variant = 'outlined',
  isLoading = false,
  error
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCardStyles = () => {
    const baseStyles = {
      width: fullWidth ? '100%' : 'auto',
      padding: 'var(--md-sys-spacing-4)',
      borderRadius: 'var(--md-sys-shape-corner-medium)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
      position: 'relative' as const,
      overflow: 'hidden'
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          backgroundColor: 'var(--md-sys-color-surface-container-low)',
          border: 'none',
          boxShadow: isHovered
            ? 'var(--md-sys-elevation-level3)'
            : 'var(--md-sys-elevation-level1)'
        };
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: 'var(--md-sys-color-surface-container-highest)',
          border: 'none',
          boxShadow: 'var(--md-sys-elevation-level1)'
        };
      case 'outlined':
      default:
        return {
          ...baseStyles,
          backgroundColor: 'var(--md-sys-color-surface-container-highest)',
          border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
          boxShadow: 'var(--md-sys-elevation-level1)'
        };
    }
  };

  const handleClick = () => {
    if (onClick && !isLoading) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  if (error) {
    return (
      <div
        style={{
          ...getCardStyles(),
          borderColor: 'var(--md-sys-color-error)',
          backgroundColor: 'var(--md-sys-color-error-container)'
        }}
        role="alert"
        aria-live="polite"
      >
        <M3Typography variant="title-medium" style={{ color: 'var(--md-sys-color-on-error-container)' }}>
          Errore
        </M3Typography>
        <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-error-container)', marginTop: 'var(--md-sys-spacing-2)' }}>
          {error}
        </M3Typography>
      </div>
    );
  }

  return (
    <div
      style={getCardStyles()}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? 'button' : 'article'}
      aria-label={onClick ? `${title}: ${content}` : undefined}
    >
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--md-sys-color-surface-container-highest)',
            opacity: 0.8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 'var(--md-sys-z-loading)'
          }}
          aria-live="polite"
        >
          <div
            style={{
              width: 'var(--md-sys-spacing-4)',
              height: 'var(--md-sys-spacing-4)',
              border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
              borderTop: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-primary)',
              borderRadius: 'var(--md-sys-percent-50)',
              animation: 'spin var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard) infinite'
            }}
          />
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}

      <M3Typography
        variant="title-medium"
        style={{
          color: 'var(--md-sys-color-on-surface)',
          opacity: isLoading ? 0.6 : 1
        }}
      >
        {title}
      </M3Typography>
      <M3Typography
        variant="body-medium"
        style={{
          color: 'var(--md-sys-color-on-surface-variant)',
          marginTop: 'var(--md-sys-spacing-2)',
          opacity: isLoading ? 0.6 : 1
        }}
      >
        {content}
      </M3Typography>
    </div>
  );
};

// SNAPSHOT_PLACEHOLDER: Card component visual regression baseline
// TODO: Add Playwright snapshot test and link to [CHECKLIST.md](http://_vscodecontentref_/CHECKLIST.md) phase 3
