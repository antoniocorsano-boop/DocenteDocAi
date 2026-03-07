// Thin MUI wrapper — preserves M3Chip props API for backward compatibility
// @mui-migrated Fase 2
import React from 'react';
import { Chip } from '@mui/material';

export type M3ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: 'filled' | 'outlined' | 'elevated';
  disabled?: boolean;
  onDelete?: () => void;
};

function M3Chip({ label, variant = 'filled', disabled, onDelete, onClick }: M3ChipProps): React.ReactElement {
  const getMuiVariant = (): 'filled' | 'outlined' =>
    variant === 'outlined' ? 'outlined' : 'filled';

  const getExtraSx = () => {
    switch (variant) {
      case 'elevated':
        return {
          boxShadow: 'var(--md-sys-elevation-level1)',
          bgcolor: 'var(--md-sys-color-surface)',
          color: 'var(--md-sys-color-on-surface-variant)',
          '&:hover': { boxShadow: 'var(--md-sys-elevation-level2)' },
        };
      case 'filled':
        return {
          bgcolor: 'var(--md-sys-color-secondary-container)',
          color: 'var(--md-sys-color-on-secondary-container)',
        };
      default:
        return {};
    }
  };

  return (
    <Chip
      label={label}
      variant={getMuiVariant()}
      disabled={disabled}
      onDelete={onDelete}
      onClick={onClick as unknown as React.MouseEventHandler<HTMLDivElement>}
      sx={{ borderRadius: 'var(--md-sys-shape-corner-full)', ...getExtraSx() }}
    />
  );
}

export default M3Chip;



