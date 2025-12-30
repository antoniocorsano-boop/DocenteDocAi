import React from 'react';
import Button from '@mui/material/Button';

interface M3ButtonProps {
  variant?: 'filled' | 'outlined' | 'text' | 'tonal' | 'elevated';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  title?: string;
}

const variantMap: Record<string, 'contained' | 'outlined' | 'text'> = {
  filled: 'contained',
  outlined: 'outlined',
  text: 'text',
  tonal: 'contained', // MUI does not have 'tonal', fallback to contained
  elevated: 'contained', // fallback to contained
};

const M3Button: React.FC<M3ButtonProps> = ({
  variant = 'filled',
  color = 'primary',
  startIcon,
  endIcon,
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
  fullWidth = false,
  title,
}) => (
  <Button
    variant={variantMap[variant] || 'contained'}
    color={color}
    startIcon={startIcon}
    endIcon={endIcon}
    disabled={disabled}
    onClick={onClick}
    className={className}
    type={type}
    fullWidth={fullWidth}
    disableElevation={variant !== 'elevated'}
    sx={{
      ...(variant === 'tonal' && {
        backgroundColor: 'var(--md-sys-color-secondary-container)',
        color: 'var(--md-sys-color-on-secondary-container)'
      }),
      ...(variant === 'elevated' && {
        boxShadow: 'var(--md-elevation-1)'
      })
    }}
    title={title}
  >
    {children}
  </Button>
);

export default M3Button;
