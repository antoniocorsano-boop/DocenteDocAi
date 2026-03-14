/**
 * CopilotPerformancePanel v2 — Sprint 1 Performance Insights
 *
 * Three inner tabs:
 *   1. Analisi     — risk/excellence suggestion cards
 *   2. Heatmap     — grade heatmap per student × subject
 *   3. Trend       — moving-average grade line chart
 */
import React from 'react';
import InfoCard from '../ui/InfoCard';
import SectionHeader from '../ui/SectionHeader';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import type { AISuggestion } from '../../ai/contextEngine/types';
import type { Studente, Valutazione } from '../../types';
import PerformanceHeatmap from './PerformanceHeatmap';
import StudentTrendChart from './StudentTrendChart';

// ── suggestion meta ───────────────────────────────────────────────────────────

const SUGGESTION_META: Record<
  AISuggestion['type'],
  { icon: string; bg: string; fg: string; chipLabel: string }
> = {
  student_at_risk: {
    icon: 'warning',
    bg: 'var(--md-sys-color-error-container)',
    fg: 'var(--md-sys-color-on-error-container)',
    chipLabel: 'Rischio',
  },
  student_excellence: {
    icon: 'star',
    bg: 'var(--md-sys-color-tertiary-container)',
    fg: 'var(--md-sys-color-on-tertiary-container)',
    chipLabel: 'Eccellenza',
  },
  missing_assessment: {
    icon: 'assignment_late',
    bg: 'var(--md-sys-color-secondary-container)',
    fg: 'var(--md-sys-color-on-secondary-container)',
    chipLabel: 'Val. mancante',
  },
  learning_gap: {
    icon: 'school',
    bg: 'var(--md-sys-color-surface-container-high)',
    fg: 'var(--md-sys-color-on-surface-variant)',
    chipLabel: 'Lacuna',
  },
};

// ── props ─────────────────────────────────────────────────────────────────────

interface CopilotPerformancePanelProps {
  suggestions: AISuggestion[];
  className: string;
  studentId: string;
  students: Studente[];
  evaluations: Valutazione[];
}

// ── sub-tab: analisi ──────────────────────────────────────────────────────────

const AnalisiTab: React.FC<{ suggestions: AISuggestion[]; studentId: string }> = ({
  suggestions,
  studentId,
}) => {
  const filtered = React.useMemo(() => {
    if (studentId === 'all') return suggestions;
    return suggestions.filter((s) => s.studentId === studentId);
  }, [suggestions, studentId]);

  if (!filtered.length) {
    return (
      <Box sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          Nessun suggerimento disponibile per la selezione corrente.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-3)' }}>
      {filtered.map((s) => {
        const meta = SUGGESTION_META[s.type] ?? SUGGESTION_META.learning_gap;
        const conf = Math.round(s.confidence * 100);
        return (
          <Box
            key={s.id}
            sx={{
              display: 'flex',
              gap: 'var(--md-sys-spacing-3)',
              alignItems: 'flex-start',
              p: 'var(--md-sys-spacing-3)',
              borderRadius: 'var(--md-sys-shape-corner-medium)',
              backgroundColor: meta.bg,
            }}
          >
            {/* Icon */}
            <Box
              component="span"
              className="material-symbols-outlined"
              aria-hidden="true"
              sx={{ color: meta.fg, fontSize: 20, mt: 0.25, flexShrink: 0 }}
            >
              {meta.icon}
            </Box>

            {/* Body */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                <Chip
                  label={meta.chipLabel}
                  size="small"
                  sx={{
                    backgroundColor: 'transparent',
                    color: meta.fg,
                    border: `1px solid ${meta.fg}`,
                    fontWeight: 'var(--md-sys-typescale-weight-medium)',
                    height: 20,
                    fontSize: 11,
                  }}
                />
                <Typography variant="caption" sx={{ color: meta.fg, opacity: 0.75 }}>
                  Confidence {conf}%
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: meta.fg }}>
                {s.message}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

// ── main component ────────────────────────────────────────────────────────────

export default function CopilotPerformancePanel({
  suggestions,
  className,
  studentId,
  students,
  evaluations,
}: CopilotPerformancePanelProps): JSX.Element {
  const [innerTab, setInnerTab] = React.useState(0);

  // Quick KPI counters
  const atRisk = React.useMemo(
    () =>
      suggestions.filter(
        (s) =>
          s.type === 'student_at_risk' &&
          (studentId === 'all' || s.studentId === studentId),
      ).length,
    [suggestions, studentId],
  );
  const excellent = React.useMemo(
    () =>
      suggestions.filter(
        (s) =>
          s.type === 'student_excellence' &&
          (studentId === 'all' || s.studentId === studentId),
      ).length,
    [suggestions, studentId],
  );

  return (
    <InfoCard variant="outlined">
      <SectionHeader
        title="Performance Insights"
        subtitle={`Classe ${className}`}
      />

      {/* KPI row */}
      <Box sx={{ display: 'flex', gap: 'var(--md-sys-spacing-3)', mb: 'var(--md-sys-spacing-4)', flexWrap: 'wrap' }}>
        <Box
          sx={{
            flex: 1,
            minWidth: 100,
            p: 'var(--md-sys-spacing-3)',
            borderRadius: 'var(--md-sys-shape-corner-medium)',
            backgroundColor: 'var(--md-sys-color-error-container)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ color: 'var(--md-sys-color-on-error-container)', lineHeight: 1 }}>
            {atRisk}
          </Typography>
          <Typography variant="labelSmall" sx={{ color: 'var(--md-sys-color-on-error-container)', opacity: 0.8 }}>
            A rischio
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 100,
            p: 'var(--md-sys-spacing-3)',
            borderRadius: 'var(--md-sys-shape-corner-medium)',
            backgroundColor: 'var(--md-sys-color-tertiary-container)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ color: 'var(--md-sys-color-on-tertiary-container)', lineHeight: 1 }}>
            {excellent}
          </Typography>
          <Typography variant="labelSmall" sx={{ color: 'var(--md-sys-color-on-tertiary-container)', opacity: 0.8 }}>
            Eccellenza
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 100,
            p: 'var(--md-sys-spacing-3)',
            borderRadius: 'var(--md-sys-shape-corner-medium)',
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ color: 'var(--md-sys-color-on-surface)', lineHeight: 1 }}>
            {students.length}
          </Typography>
          <Typography variant="labelSmall" sx={{ color: 'var(--md-sys-color-on-surface-variant)', opacity: 0.8 }}>
            Studenti
          </Typography>
        </Box>
      </Box>

      {/* Inner tabs */}
      <Tabs
        value={innerTab}
        onChange={(_, v: number) => setInnerTab(v)}
        aria-label="Performance Insights tabs"
        sx={{ mb: 'var(--md-sys-spacing-3)', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Analisi" id="perf-tab-0" aria-controls="perf-panel-0" />
        <Tab label="Heatmap" id="perf-tab-1" aria-controls="perf-panel-1" />
        <Tab label="Trend" id="perf-tab-2" aria-controls="perf-panel-2" />
      </Tabs>

      <Box role="tabpanel" id={`perf-panel-${innerTab}`} aria-labelledby={`perf-tab-${innerTab}`}>
        {innerTab === 0 && (
          <AnalisiTab suggestions={suggestions} studentId={studentId} />
        )}
        {innerTab === 1 && (
          <PerformanceHeatmap
            students={students}
            evaluations={evaluations}
            selectedStudentId={studentId}
          />
        )}
        {innerTab === 2 && (
          <StudentTrendChart
            students={students}
            evaluations={evaluations}
            studentId={studentId}
            className={className}
          />
        )}
      </Box>
    </InfoCard>
  );
}
