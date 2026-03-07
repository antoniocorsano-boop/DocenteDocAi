// Thin MUI wrapper — preserves M3ChoiceCard props API for backward compatibility
// @mui-migrated Fase 2
import React from 'react';
import { Card, Box } from '@mui/material';

interface M3ChoiceCardProps {
    icon: string;
    label: string;
    onClick: () => void;
    selected: boolean;
}

const M3ChoiceCard: React.FC<M3ChoiceCardProps> = ({ icon, label, onClick, selected }) => (
  <Card
    component="button"
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 4,
      borderRadius: 'var(--md-sys-shape-corner-extra-large)',
      border: `2px solid ${selected ? 'var(--md-sys-color-primary)' : 'color-mix(in srgb, var(--md-sys-color-outline-variant) 19%, transparent)'}`,
      bgcolor: selected
        ? 'var(--md-sys-color-primary-container)'
        : 'color-mix(in srgb, var(--md-sys-color-surface-container) 50%, transparent)',
      color: selected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
      boxShadow: selected ? 'var(--md-sys-elevation-level4)' : 'none',
      transform: selected ? 'scale(1.05)' : 'scale(1)',
      transition: 'all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
      gap: 2,
      minWidth: 'var(--md-sys-spacing-16)',
      cursor: 'pointer',
      '&:hover': {
        border: `2px solid var(--md-sys-color-outline)`,
        bgcolor: selected
          ? 'var(--md-sys-color-primary-container)'
          : 'var(--md-sys-color-surface-container-high)',
      },
    }}
  >
    <Box
      sx={{
        width: 'var(--md-sys-spacing-12)',
        height: 'var(--md-sys-spacing-12)',
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: selected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface)',
        color: selected ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-primary)',
        boxShadow: selected ? 'var(--md-sys-elevation-level2)' : 'none',
        transition: 'all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
      }}
    >
      <Box
        component="span"
        className="material-symbols-outlined"
        aria-hidden="true"
        sx={{ fontSize: 'var(--icon-size-medium)', userSelect: 'none', fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
      >
        {icon}
      </Box>
    </Box>
    <Box
      component="span"
      sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', fontFamily: 'var(--md-sys-typescale-body-small-font-family)' }}
    >
      {label}
    </Box>
  </Card>
);

export default M3ChoiceCard;

