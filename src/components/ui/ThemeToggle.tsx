// MD3 Gold Compliant
// Theme toggle button con icon animation
// Audit: febbraio 2026

import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Tooltip } from './index';

interface ThemeToggleProps {
  variant?: 'icon' | 'button' | 'menu';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  showLabel = false
}) => {
  const { mode, setMode, effectiveTheme, isSystemTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    
    // Cycle through: auto → light → dark → auto
    if (mode === 'auto') {
      setMode('light');
    } else if (mode === 'light') {
      setMode('dark');
    } else {
      setMode('auto');
    }

    setTimeout(() => setIsAnimating(false), 400);
  };

  // Icon based on current effective theme
  const icon = effectiveTheme === 'dark' ? 'dark_mode' : 'light_mode';
  
  // Label based on mode
  const label = mode === 'auto' 
    ? 'Tema automatico' 
    : mode === 'light' 
      ? 'Tema chiaro' 
      : 'Tema scuro';

  // Tooltip text
  const tooltipText = mode === 'auto'
    ? `Tema automatico (${effectiveTheme === 'dark' ? 'Scuro' : 'Chiaro'})`
    : mode === 'light'
      ? 'Passa a tema scuro'
      : 'Passa a tema automatico';

  if (variant === 'icon') {
    return (
      <Tooltip text={tooltipText}>
        <button
          onClick={handleToggle}
          aria-label={label}
          style={{
            position: 'relative',
            width: 'var(--md-sys-spacing-10)',
            height: 'var(--md-sys-spacing-10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            borderRadius: 'var(--md-sys-percent-50)',
            backgroundColor: 'transparent',
            color: 'var(--md-sys-color-on-surface)',
            cursor: 'pointer',
            transition: 'background-color var(--md-sys-motion-duration-medium)',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-variant)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {/* Icon with rotation animation */}
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 'var(--md-sys-typescale-headline-medium-size)',
              fontVariationSettings: isSystemTheme 
                ? '"FILL" 0, "wght" 400' 
                : '"FILL" 1, "wght" 600',
              transform: isAnimating ? 'rotate(360deg)' : 'rotate(0deg)',
              transition: 'transform 400ms var(--md-sys-motion-easing-standard)'
            }}
          >
            {icon}
          </span>

          {/* System indicator dot */}
          {isSystemTheme && (
            <div
              style={{
                position: 'absolute',
                bottom: 'var(--md-sys-spacing-1)',
                right: 'var(--md-sys-spacing-1)',
                width: 'var(--md-sys-spacing-1)',
                height: 'var(--md-sys-spacing-1)',
                borderRadius: '50%',
                backgroundColor: 'var(--md-sys-color-primary)',
                boxShadow: '0 0 4px var(--md-sys-color-primary)'
              }}
            />
          )}
        </button>
      </Tooltip>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggle}
        aria-label={label}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--md-sys-spacing-2)',
          padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)',
          border: '1px solid var(--md-sys-color-outline)',
          borderRadius: 'var(--md-sys-spacing-5)',
          backgroundColor: 'var(--md-sys-color-surface-container)',
          color: 'var(--md-sys-color-on-surface)',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 200ms'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container)';
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '20px',
            fontVariationSettings: isSystemTheme 
              ? '"FILL" 0, "wght" 400' 
              : '"FILL" 1, "wght" 600',
            transform: isAnimating ? 'rotate(360deg)' : 'rotate(0deg)',
            transition: 'transform 400ms var(--md-sys-motion-easing-standard)'
          }}
        >
          {icon}
        </span>
        {showLabel && <span>{label}</span>}
      </button>
    );
  }

  // variant === 'menu'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-1)'
      }}
    >
      {/* Menu items for each theme option */}
      {(['auto', 'light', 'dark'] as const).map((themeMode) => (
        <button
          key={themeMode}
          onClick={() => setMode(themeMode)}
          aria-pressed={mode === themeMode}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--md-sys-spacing-3)',
            padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
            border: 'none',
            borderRadius: 'var(--md-sys-spacing-2)',
            backgroundColor: mode === themeMode 
              ? 'var(--md-sys-color-primary-container)' 
              : 'transparent',
            color: mode === themeMode
              ? 'var(--md-sys-color-on-primary-container)'
              : 'var(--md-sys-color-on-surface)',
            fontSize: '14px',
            fontWeight: mode === themeMode ? '600' : '400',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            transition: 'all 200ms'
          }}
          onMouseEnter={(e) => {
            if (mode !== themeMode) {
              e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-variant)';
            }
          }}
          onMouseLeave={(e) => {
            if (mode !== themeMode) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          {/* Icon */}
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: '20px',
              fontVariationSettings: mode === themeMode 
                ? '"FILL" 1, "wght" 600' 
                : '"FILL" 0, "wght" 400'
            }}
          >
            {themeMode === 'auto' ? 'brightness_auto' : themeMode === 'light' ? 'light_mode' : 'dark_mode'}
          </span>

          {/* Label */}
          <span style={{ flex: 1 }}>
            {themeMode === 'auto' ? 'Automatico' : themeMode === 'light' ? 'Chiaro' : 'Scuro'}
          </span>

          {/* Checkmark */}
          {mode === themeMode && (
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '18px',
                fontVariationSettings: '"FILL" 1, "wght" 600'
              }}
            >
              check
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
