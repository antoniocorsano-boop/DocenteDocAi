// Thin MUI wrapper — preserves M3Card props API for backward compatibility
// @mui-migrated Fase 2
import React, { useState } from 'react';
import { Card } from '@mui/material';

export interface M3CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: React.CSSProperties;
  ariaLabel?: string;
  className?: string;
}

const PADDING_MAP: Record<NonNullable<M3CardProps['padding']>, number> = {
  none: 0, small: 2, medium: 3, large: 4,
};

const M3Card: React.FC<M3CardProps> = ({
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  variant = 'elevated',
  padding = 'medium',
  style,
  ariaLabel,
  className,
}) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const isClickable = Boolean(onClick);

  const getBgcolor = () => {
    switch (variant) {
      case 'outlined': return 'var(--md-sys-color-surface)';
      case 'filled':   return isClickable && hovered
        ? 'var(--md-sys-color-surface-container)'
        : 'var(--md-sys-color-surface-container-low)';
      default:         return 'var(--md-sys-color-surface-container-low)';
    }
  };

  return (
    <Card
      variant={variant === 'outlined' ? 'outlined' : 'elevation'}
      elevation={variant === 'elevated' ? (hovered && isClickable ? 2 : 1) : 0}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={ariaLabel}
      className={className}
      onClick={onClick}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick!();
        }
      }}
      onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e as React.MouseEvent<HTMLDivElement>); }}
      onMouseLeave={(e) => { setHovered(false); setPressed(false); onMouseLeave?.(e as React.MouseEvent<HTMLDivElement>); }}
      onMouseDown={() => isClickable && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => isClickable && setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      sx={{
        bgcolor: getBgcolor(),
        borderRadius: 'var(--md-sys-shape-corner-large)',
        p: PADDING_MAP[padding],
        transform: isClickable
          ? pressed ? 'scale(0.98)' : hovered ? 'scale(1.03)' : 'scale(1)'
          : 'scale(1)',
        transition: [
          'transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
          'box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
          'background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
        ].join(', '),
        cursor: isClickable ? 'pointer' : 'default',
        outline: focused && isClickable ? '2px solid var(--md-sys-color-primary)' : 'none',
        outlineOffset: '2px',
        willChange: isClickable ? 'transform' : undefined,
        ...style,
      }}
    >
      {children}
    </Card>
  );
};

export default M3Card;

