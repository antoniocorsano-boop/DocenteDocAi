/**
 * IntelligentDashboard.tsx — Sprint 10: Copilot Brain Intelligent Dashboard.
 *
 * Assembles the 4 main blocks of the cognitive dashboard:
 *   Block 1 — Primary action (PrimaryActionCard + SecondaryActionsList)
 *   Block 2 — System health (SystemStatusPanel)
 *   Block 3 — Recent decisions timeline (RecentDecisions)
 *
 * Architecture rules:
 *   - Zero business logic — reads only from hooks
 *   - All navigation via optional onNavigate prop
 *   - MD3 Gold Compliant
 *
 * @example
 * <IntelligentDashboard onNavigate={(view) => navigate(view)} />
 */

import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useNextAction }        from '../../hooks/useNextAction';
import { useCopilotDashboard }  from '../../hooks/useCopilotDashboard';
import PrimaryActionCard        from './PrimaryActionCard';
import SecondaryActionsList     from './SecondaryActionsList';
import SystemStatusPanel        from './SystemStatusPanel';
import RecentDecisions          from './RecentDecisions';

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  onNavigate?: (view: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const IntelligentDashboard: React.FC<Props> = ({ onNavigate }) => {
  // Primary action with full NextAction richness (icon, cta, reason)
  const primaryAction = useNextAction();

  // Secondary actions + system status + signals (reactive to DecisionMemory)
  const { secondaries, systemStatus, recentSignals } = useCopilotDashboard();

  return (
    <Box sx={{ py: 'var(--md-sys-spacing-2)' }}>
      <Stack gap="var(--md-sys-spacing-4)">

        {/* ── Dashboard header ── */}
        <Stack direction="row" alignItems="center" gap="var(--md-sys-spacing-2)">
          <Box
            component="span"
            className="material-symbols-outlined"
            aria-hidden="true"
            sx={{ fontSize: 'var(--md-sys-icon-size-md)', color: 'var(--md-sys-color-primary)' }}
          >
            neurology
          </Box>
          <Stack>
            <Typography variant="titleMedium" sx={{ color: 'var(--md-sys-color-on-surface)' }}>
              Brain Dashboard
            </Typography>
            <Typography variant="bodySmall" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Decisioni, stato sistema e attività recenti
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: 'var(--md-sys-color-outline-variant)' }} />

        {/* ── Block 1a: Primary action ── */}
        <PrimaryActionCard action={primaryAction} onNavigate={onNavigate} />

        {/* ── Block 1b: Secondary actions ── */}
        <SecondaryActionsList actions={secondaries} onNavigate={onNavigate} />

        <Divider sx={{ borderColor: 'var(--md-sys-color-outline-variant)' }} />

        {/* ── Block 2: System status ── */}
        <SystemStatusPanel status={systemStatus} />

        <Divider sx={{ borderColor: 'var(--md-sys-color-outline-variant)' }} />

        {/* ── Block 3: Recent decisions ── */}
        <RecentDecisions signals={recentSignals} />

      </Stack>
    </Box>
  );
};

export default IntelligentDashboard;
