// Thin MUI wrapper — preserves M3Button props API for backward compatibility
// @mui-migrated Fase 2
import React, { ButtonHTMLAttributes } from 'react';
import { Button, CircularProgress } from '@mui/material';

interface M3ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'tonal' | 'elevated';
  size?: 'small' | 'medium' | 'large';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  icon?: string;
  loading?: boolean;
}

const M3Button: React.FC<M3ButtonProps> = ({
  variant = 'filled',
  size = 'medium',
  startIcon,
  endIcon,
  disabled = false,
  onClick,
  children,
  type = 'button',
  fullWidth = false,
  title,
  loading,
  icon: _icon,
  'aria-label': ariaLabel,
  ..._otherProps
}) => {
  const getMuiVariant = (): 'contained' | 'outlined' | 'text' => {
    if (variant === 'outlined') return 'outlined';
    if (variant === 'text') return 'text';
    return 'contained';
  };

  const getVariantSx = () => {
    switch (variant) {
      case 'tonal':
        return {
          bgcolor: 'var(--md-sys-color-secondary-container)',
          color: 'var(--md-sys-color-on-secondary-container)',
          '&:hover': { bgcolor: 'color-mix(in srgb, var(--md-sys-color-secondary-container) 88%, var(--md-sys-color-on-secondary-container))' },
        };
      case 'elevated':
        return {
          bgcolor: 'var(--md-sys-color-surface-container-low)',
          color: 'var(--md-sys-color-primary)',
          boxShadow: 'var(--md-sys-elevation-level1)',
          '&:hover': { boxShadow: 'var(--md-sys-elevation-level2)' },
        };
      default:
        return {};
    }
  };

  return (
    <Button
      variant={getMuiVariant()}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || !!loading}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      type={type as 'button' | 'submit' | 'reset'}
      title={title}
      aria-label={ariaLabel || title || (typeof children === 'string' ? children : undefined)}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
      endIcon={endIcon}
      sx={{
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        textTransform: 'none',
        ...getVariantSx(),
      }}
    >
      {children}
    </Button>
  );
};

export { M3Button };
export default M3Button;
