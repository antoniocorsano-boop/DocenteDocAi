// Thin MUI wrapper — preserves M3ProgressBar props API for backward compatibility
// @mui-migrated Fase 2
import React from 'react';
import { LinearProgress, CircularProgress, Box } from '@mui/material';

export type M3ProgressBarProps = {
  value: number; // 0-1
  label?: string;
  showValue?: boolean;
  variant?: 'linear' | 'circular';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'tertiary';
};

const CIRCULAR_SIZE = { small: 24, medium: 36, large: 48 } as const;
const LINEAR_HEIGHT = { small: 2, medium: 4, large: 8 } as const;

function M3ProgressBar({
  value,
  label,
  showValue = false,
  variant = 'linear',
  size = 'medium',
  color = 'primary',
}: M3ProgressBarProps): React.ReactElement {
  const percentage = Math.round(Math.max(0, Math.min(1, value)) * 100);
  const muiColor = color === 'tertiary' ? undefined : (color as 'primary' | 'secondary');
  const tertiarySx = color === 'tertiary' ? { color: 'var(--md-sys-color-tertiary)' } : {};

  if (variant === 'circular') {
    return (
      <Box
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
      >
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={CIRCULAR_SIZE[size]}
          color={muiColor}
          sx={tertiarySx}
        />
        {showValue && <span>{percentage}%</span>}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
      {(label || showValue) && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && (
            <Box component="span" sx={{ fontSize: 'var(--md-sys-typescale-body-small-font-size)' }}>
              {label}
            </Box>
          )}
          {showValue && (
            <Box component="span" sx={{ fontSize: 'var(--md-sys-typescale-body-small-font-size)' }}>
              {percentage}%
            </Box>
          )}
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={percentage}
        color={muiColor}
        aria-label={label}
        sx={{
          height: LINEAR_HEIGHT[size],
          borderRadius: 'var(--md-sys-shape-corner-full)',
          ...tertiarySx,
        }}
      />
    </Box>
  );
}

export default M3ProgressBar;
