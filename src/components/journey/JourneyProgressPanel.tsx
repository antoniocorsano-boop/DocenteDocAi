/**
 * JourneyProgressPanel — collapsible MD3 panel showing journey progress.
 *
 * Shows:
 *   - Linear progress bar in current level
 *   - Up to 3 next action Chips
 *   - CTA Button when a targetView is set
 * Visible to all levels; collapses on maestro as a secondary detail.
 */

import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { M3Surface } from '../ui';
import { useJourneyProgress } from '../../hooks/useJourneyProgress';
import type { JourneyLevel } from '../../types/teacherModel.types';

const LEVEL_LABELS: Record<JourneyLevel, string> = {
  esploratore: 'Esploratore',
  praticante: 'Praticante',
  maestro: 'Maestro',
};

const NEXT_LEVEL_LABELS: Record<JourneyLevel, string | null> = {
  esploratore: 'Praticante',
  praticante: 'Maestro',
  maestro: null,
};

interface Props {
  /** When provided, only renders the anchor tag for scrolling */
  showAnchor?: boolean;
}

const JourneyProgressPanel: React.FC<Props> = ({ showAnchor = false }) => {
  const { level, progress, nextActions } = useJourneyProgress();
  const [collapsed, setCollapsed] = useState(level === 'maestro');

  const nextLevel = NEXT_LEVEL_LABELS[level];

  if (showAnchor) return <div id="journey-progress" />;

  return (
    <M3Surface
      elevation={1}
      sx={{
        borderRadius: 'var(--md-sys-shape-corner-large)',
        p: 2,
      }}
      id="journey-progress"
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: collapsed ? 0 : 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            component="span"
            className="material-symbols-outlined"
            aria-hidden="true"
            sx={{ color: 'var(--md-sys-color-primary)', fontSize: '1.25rem' }}
          >
            trending_up
          </Box>
          <Typography variant="titleSmall" sx={{ color: 'var(--md-sys-color-on-surface)' }}>
            Il tuo percorso — {LEVEL_LABELS[level]}
          </Typography>
        </Stack>
        <IconButton
          size="small"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Espandi percorso' : 'Comprimi percorso'}
        >
          <Box
            component="span"
            className="material-symbols-outlined"
            aria-hidden="true"
            sx={{ fontSize: '1.25rem' }}
          >
            {collapsed ? 'expand_more' : 'expand_less'}
          </Box>
        </IconButton>
      </Stack>

      <Collapse in={!collapsed}>
        {/* Progress bar */}
        {nextLevel && (
          <Stack spacing={0.5} sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="labelSmall" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                {LEVEL_LABELS[level]}
              </Typography>
              <Typography variant="labelSmall" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                {nextLevel}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={Math.round(progress * 100)}
              aria-label={`Progresso verso il livello ${nextLevel}: ${Math.round(progress * 100)}%`}
              sx={{ borderRadius: 1, height: 6, bgcolor: 'var(--md-sys-color-surface-container-high)' }}
            />
          </Stack>
        )}

        {/* Next actions */}
        {nextActions.length > 0 && (
          <Stack spacing={1}>
            <Typography variant="labelSmall" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Prossimi passi suggeriti
            </Typography>
            {nextActions.map((action) => (
              <Stack key={action.id} direction="row" spacing={1} alignItems="flex-start">
                <Chip
                  aria-label={action.message}
                  label={action.message}
                  size="small"
                  icon={
                    <Box
                      component="span"
                      className="material-symbols-outlined"
                      aria-hidden="true"
                      sx={{ fontSize: '1rem !important' }}
                    >
                      {action.icon}
                    </Box>
                  }
                  sx={{
                    height: 'auto',
                    whiteSpace: 'normal',
                    '& .MuiChip-label': { whiteSpace: 'normal', py: 0.5 },
                  }}
                />
                {action.targetView && (
                  <Button
                    size="small"
                    variant="text"
                    aria-label={`Vai a ${action.targetView}`}
                    sx={{ minWidth: 'auto', flexShrink: 0 }}
                  >
                    Vai
                  </Button>
                )}
              </Stack>
            ))}
          </Stack>
        )}
      </Collapse>
    </M3Surface>
  );
};

export default JourneyProgressPanel;
