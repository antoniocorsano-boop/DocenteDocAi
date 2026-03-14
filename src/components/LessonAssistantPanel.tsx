import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
import ButtonBase from '@mui/material/ButtonBase'
import { InfoCard, AiMemoryChip, EmptyState } from './ui'
import type { LessonAssistantResponse, LessonSuggestion, LessonActivityType, GapSeverity } from '../ai/lessonAssistant/types'

interface LessonAssistantPanelProps {
  data: LessonAssistantResponse
  className?: string
}

// ── Activity type tokens ──────────────────────────────────────────────────────
const ACTIVITY_META: Record<LessonActivityType, { label: string; icon: string; bg: string; fg: string }> = {
  recupero: {
    label: 'Recupero',
    icon: 'healing',
    bg: 'var(--md-sys-color-error-container)',
    fg: 'var(--md-sys-color-on-error-container)',
  },
  attivita: {
    label: 'Attività',
    icon: 'auto_stories',
    bg: 'var(--md-sys-color-secondary-container)',
    fg: 'var(--md-sys-color-on-secondary-container)',
  },
  verifica: {
    label: 'Verifica',
    icon: 'fact_check',
    bg: 'var(--md-sys-color-tertiary-container)',
    fg: 'var(--md-sys-color-on-tertiary-container)',
  },
}

// ── Severity tokens ───────────────────────────────────────────────────────────
const SEVERITY_META: Record<GapSeverity, { dot: string; label: string }> = {
  high:   { dot: 'var(--md-sys-color-error)',            label: 'Alta' },
  medium: { dot: 'var(--md-sys-color-secondary)',        label: 'Media' },
  low:    { dot: 'var(--md-sys-color-on-surface-variant)', label: 'Bassa' },
}

// ── Single suggestion row ─────────────────────────────────────────────────────
const SuggestionRow: React.FC<{ s: LessonSuggestion }> = ({ s }) => {
  const [open, setOpen] = useState(false)
  const meta = ACTIVITY_META[s.type]

  return (
    <Box
      sx={{
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        border: '1px solid var(--md-sys-color-outline-variant)',
        overflow: 'hidden',
      }}
    >
      {/* Header row — clickable */}
      <ButtonBase
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`${meta.label}: ${s.subject}`}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--md-sys-spacing-3)',
          padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
          backgroundColor: 'var(--md-sys-color-surface-container)',
          textAlign: 'left',
        }}
      >
        {/* Activity badge */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'var(--md-sys-spacing-9)',
            height: 'var(--md-sys-spacing-9)',
            borderRadius: 'var(--md-sys-shape-corner-medium)',
            backgroundColor: meta.bg,
            flexShrink: 0,
          }}
        >
          <Box
            component="span"
            className="material-symbols-outlined"
            aria-hidden="true"
            sx={{ color: meta.fg, fontSize: 'var(--md-sys-typescale-label-large-font-size)' }}
          >
            {meta.icon}
          </Box>
        </Box>

        {/* Subject + type label */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-medium)' }}
            noWrap
          >
            {s.subject}
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {meta.label}
          </Typography>
        </Box>

        {/* Chevron */}
        <Box
          component="span"
          className="material-symbols-outlined"
          aria-hidden="true"
          sx={{
            color: 'var(--md-sys-color-on-surface-variant)',
            fontSize: 'var(--md-sys-typescale-label-large-font-size)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          expand_more
        </Box>
      </ButtonBase>

      {/* Expandable detail */}
      <Collapse in={open}>
        <Box
          sx={{
            padding: 'var(--md-sys-spacing-4)',
            backgroundColor: 'var(--md-sys-color-surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--md-sys-spacing-2)',
          }}
        >
          <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface)' }}>
            {s.description}
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            <Box component="span" sx={{ fontWeight: 'var(--md-sys-typescale-weight-medium)' }}>
              Perché:{' '}
            </Box>
            {s.rationale}
          </Typography>
        </Box>
      </Collapse>
    </Box>
  )
}

// ── Severity group header ─────────────────────────────────────────────────────
const SeverityGroup: React.FC<{
  severity: GapSeverity
  suggestions: LessonSuggestion[]
}> = ({ severity, suggestions }) => {
  const meta = SEVERITY_META[severity]
  if (suggestions.length === 0) return null

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-2)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: meta.dot,
            flexShrink: 0,
          }}
        />
        <Typography variant="overline" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          Priorità {meta.label} ({suggestions.length})
        </Typography>
      </Box>
      {suggestions.map((s) => (
        <SuggestionRow key={s.id} s={s} />
      ))}
    </Box>
  )
}

// ── Main panel ────────────────────────────────────────────────────────────────
const LessonAssistantPanel: React.FC<LessonAssistantPanelProps> = ({ data, className }) => {
  // Group suggestions by activity type to infer severity for grouping
  // recupero = high priority, verifica = tertiary, attivita = medium
  const severityMap: Record<LessonActivityType, GapSeverity> = {
    recupero: 'high',
    verifica: 'medium',
    attivita: 'low',
  }

  const grouped: Record<GapSeverity, LessonSuggestion[]> = { high: [], medium: [], low: [] }
  data.suggestions.forEach((s) => {
    grouped[severityMap[s.type]].push(s)
  })

  return (
    <InfoCard
      elevation={1}
      className={className}
      sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
        <Box
          component="span"
          className="material-symbols-outlined"
          aria-hidden="true"
          sx={{ color: 'var(--md-sys-color-secondary)' }}
        >
          school
        </Box>
        <Typography variant="h6" sx={{ color: 'var(--md-sys-color-on-surface)', flex: 1 }}>
          Assistente Lezioni
        </Typography>
        <AiMemoryChip
          label={`${data.gapsFound} lacun${data.gapsFound === 1 ? 'a' : 'e'} rilevat${data.gapsFound === 1 ? 'a' : 'e'}`}
        />
      </Box>

      {/* Summary */}
      <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
        {data.summary}
      </Typography>

      {/* Content */}
      {data.suggestions.length === 0 ? (
        <EmptyState
          title="Nessuna attività suggerita"
          description="Non sono state rilevate lacune significative per la selezione corrente."
          icon="check_circle"
        />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
          <SeverityGroup severity="high" suggestions={grouped.high} />
          <SeverityGroup severity="medium" suggestions={grouped.medium} />
          <SeverityGroup severity="low" suggestions={grouped.low} />
        </Box>
      )}
    </InfoCard>
  )
}

export default LessonAssistantPanel
