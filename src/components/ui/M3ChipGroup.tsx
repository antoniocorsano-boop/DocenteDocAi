// Thin MUI wrapper — preserves M3ChipGroup props API for backward compatibility
// @mui-migrated Fase 2
import React from 'react';
import { Stack } from '@mui/material';

export type M3ChipGroupProps = {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
  wrap?: boolean;
  role?: string;
  'aria-label'?: string;
};

const SPACING_MAP: Record<NonNullable<M3ChipGroupProps['spacing']>, number> = {
  tight: 0.5, normal: 1, loose: 2,
};

function M3ChipGroup({
  children,
  direction = 'horizontal',
  spacing = 'normal',
  wrap = true,
  role,
  'aria-label': ariaLabel,
}: M3ChipGroupProps): React.ReactElement {
  return (
    <Stack
      role={role}
      aria-label={ariaLabel}
      direction={direction === 'vertical' ? 'column' : 'row'}
      spacing={SPACING_MAP[spacing]}
      flexWrap={wrap ? 'wrap' : 'nowrap'}
      useFlexGap
    >
      {children}
    </Stack>
  );
}

export default M3ChipGroup;

