// Thin MUI wrapper — preserves M3ButtonGroup props API for backward compatibility
// @mui-migrated Fase 2
import React from 'react';
import { Stack, Box } from '@mui/material';

export type M3ButtonGroupProps = {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
  variant?: 'default' | 'outlined' | 'elevated';
  fullWidth?: boolean;
  role?: string;
  'aria-label'?: string;
};

const SPACING_MAP: Record<NonNullable<M3ButtonGroupProps['spacing']>, number> = {
  tight: 0, normal: 0.5, loose: 1,
};

function M3ButtonGroup({
  children,
  direction = 'horizontal',
  spacing = 'normal',
  variant = 'default',
  fullWidth = false,
  role,
  'aria-label': ariaLabel,
}: M3ButtonGroupProps): React.ReactElement {
  const getVariantSx = () => {
    switch (variant) {
      case 'outlined':
        return { border: '1px solid var(--md-sys-color-outline)', borderRadius: 'var(--md-sys-shape-corner-small)' };
      case 'elevated':
        return { bgcolor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-small)', boxShadow: 'var(--md-sys-elevation-level1)' };
      default:
        return { bgcolor: 'var(--md-sys-color-surface)', borderRadius: 'var(--md-sys-shape-corner-small)' };
    }
  };

  return (
    <Stack
      role={role}
      aria-label={ariaLabel}
      direction={direction === 'vertical' ? 'column' : 'row'}
      spacing={SPACING_MAP[spacing]}
      sx={{ width: fullWidth ? '100%' : 'auto', ...getVariantSx() }}
    >
      {React.Children.map(children, (child) => (
        <Box sx={{ flex: fullWidth ? 1 : 'none' }}>{child}</Box>
      ))}
    </Stack>
  );
}

export default M3ButtonGroup;

