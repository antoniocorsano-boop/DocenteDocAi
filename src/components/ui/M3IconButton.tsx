// Thin MUI wrapper — preserves M3IconButton props API for backward compatibility
// @mui-migrated Fase 2
import React from 'react';
import { IconButton, Box } from '@mui/material';

export interface M3IconButtonProps {
  icon: string;
  onClick?: () => void;
  ariaLabel?: string;
  'aria-label'?: string;
  disabled?: boolean;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'standard' | 'filled' | 'tonal' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  style?: React.CSSProperties;
}

const M3IconButton: React.FC<M3IconButtonProps> = ({
  icon,
  onClick,
  ariaLabel,
  'aria-label': ariaLabelKebab,
  disabled = false,
  title,
  type = 'button',
  variant = 'standard',
  size = 'medium',
  style,
}) => {
  const resolvedAriaLabel = ariaLabel ?? ariaLabelKebab ?? '';
  const getSizeSx = () => {
    switch (size) {
      case 'small': return { width: 'var(--md-sys-spacing-8)',  height: 'var(--md-sys-spacing-8)',  fontSize: 'var(--md-sys-typescale-label-large-font-size)' };
      case 'large': return { width: 'var(--md-sys-spacing-12)', height: 'var(--md-sys-spacing-12)', fontSize: 'var(--md-sys-typescale-title-large-font-size)' };
      default:      return { width: 'var(--md-sys-spacing-10)', height: 'var(--md-sys-spacing-10)', fontSize: 'var(--md-sys-typescale-label-large-font-size)' };
    }
  };

  const getVariantSx = () => {
    switch (variant) {
      case 'filled':
        return {
          bgcolor: 'var(--md-sys-color-primary-container)',
          color: 'var(--md-sys-color-on-primary-container)',
          '&:hover': { bgcolor: 'color-mix(in srgb, var(--md-sys-color-primary-container) 88%, var(--md-sys-color-on-primary-container))' },
        };
      case 'tonal':
        return {
          bgcolor: 'var(--md-sys-color-secondary-container)',
          color: 'var(--md-sys-color-on-secondary-container)',
          '&:hover': { bgcolor: 'color-mix(in srgb, var(--md-sys-color-secondary-container) 88%, var(--md-sys-color-on-secondary-container))' },
        };
      case 'outlined':
        return {
          border: '1px solid var(--md-sys-color-outline)',
          color: 'var(--md-sys-color-on-surface)',
          '&:hover': { bgcolor: 'var(--md-sys-color-surface-variant)' },
        };
      default:
        return {
          color: 'var(--md-sys-color-on-surface-variant)',
          '&:hover': { bgcolor: 'var(--md-sys-color-surface-variant)' },
        };
    }
  };

  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      aria-label={resolvedAriaLabel}
      title={title || resolvedAriaLabel}
      type={type}
      style={style}
      sx={{
        borderRadius: 'var(--md-sys-shape-corner-full)',
        transition: 'all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
        ...getSizeSx(),
        ...getVariantSx(),
      }}
    >
      <Box
        component="span"
        className="material-symbols-outlined"
        aria-hidden="true"
        sx={{ userSelect: 'none', fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", fontSize: 'inherit' }}
      >
        {icon}
      </Box>
    </IconButton>
  );
};

export default M3IconButton;
