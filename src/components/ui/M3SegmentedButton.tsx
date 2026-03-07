// Thin MUI wrapper — preserves M3SegmentedButton props API for backward compatibility
// @mui-migrated Fase 2
// Documented exception per MD3 contract §9: component-scoped keyframes retained
//   because spring animation is a brand-differentiating expressive pattern.
import React from 'react';
import { ToggleButtonGroup, ToggleButton, Box } from '@mui/material';

// ============================================================================
// TYPES (unchanged public API)
// ============================================================================

export interface M3SegmentedButtonOption<T extends string = string> {
  value: T;
  label: string;
  /** Optional Material Symbol icon name */
  icon?: string;
  disabled?: boolean;
}

export interface M3SegmentedButtonProps<T extends string = string> {
  options: M3SegmentedButtonOption<T>[];
  value: T;
  onChange: (value: T) => void;
  density?: 'default' | 'compact';
  fullWidth?: boolean;
  'aria-label'?: string;
  style?: React.CSSProperties;
}

// ============================================================================
// COMPONENT
// ============================================================================

function M3SegmentedButton<T extends string = string>({
  options,
  value,
  onChange,
  density = 'default',
  fullWidth = false,
  'aria-label': ariaLabel,
  style,
}: M3SegmentedButtonProps<T>): React.ReactElement {
  const isCompact = density === 'compact';

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_e, newValue: T | null) => {
        // Prevent deselection — always keep a value selected
        if (newValue !== null) onChange(newValue);
      }}
      aria-label={ariaLabel}
      fullWidth={fullWidth}
      size={isCompact ? 'small' : 'medium'}
      sx={{
        borderRadius: 'var(--md-sys-shape-corner-full)',
        border: `1px solid var(--md-sys-color-outline)`,
        overflow: 'hidden',
        ...style,
        '& .MuiToggleButtonGroup-grouped': {
          border: 0,
          borderLeft: `1px solid var(--md-sys-color-outline) !important`,
          borderRadius: 0,
          '&:first-of-type': { borderLeft: '0 !important', borderRadius: 0 },
        },
      }}
    >
      {options.map((opt) => (
        <ToggleButton
          key={opt.value}
          value={opt.value}
          disabled={opt.disabled}
          sx={{
            flex: fullWidth ? 1 : 'none',
            gap: opt.icon ? 1 : 0,
            px: isCompact ? 1.5 : 2,
            py: isCompact ? 0.5 : 1,
            textTransform: 'none',
            typography: 'labelLarge',
            color: 'var(--md-sys-color-on-surface)',
            bgcolor: 'transparent',
            '&.Mui-selected': {
              bgcolor: 'var(--md-sys-color-secondary-container)',
              color: 'var(--md-sys-color-on-secondary-container)',
              '&:hover': { bgcolor: 'var(--md-sys-color-secondary-container)' },
            },
          }}
        >
          {opt.icon && (
            <Box
              component="span"
              className="material-symbols-outlined"
              aria-hidden="true"
              sx={{ fontSize: isCompact ? '16px' : '18px', lineHeight: 1 }}
            >
              {opt.icon}
            </Box>
          )}
          {opt.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export default M3SegmentedButton;
export { M3SegmentedButton };
