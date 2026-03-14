import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import type { AISuggestion } from '../ai/contextEngine/types'
import { InfoCard, AiMemoryChip, EmptyState } from './ui'

interface AISuggestionsPanelProps {
  suggestions: AISuggestion[]
  className?: string
}

const SUGGESTION_META: Record<
  AISuggestion['type'],
  { icon: string; color: string; bg: string; label: string }
> = {
  student_at_risk: {
    icon: 'warning',
    color: 'var(--md-sys-color-on-error-container)',
    bg: 'var(--md-sys-color-error-container)',
    label: 'A rischio',
  },
  student_excellence: {
    icon: 'star',
    color: 'var(--md-sys-color-on-tertiary-container)',
    bg: 'var(--md-sys-color-tertiary-container)',
    label: 'Eccellenza',
  },
  missing_assessment: {
    icon: 'assignment_late',
    color: 'var(--md-sys-color-on-secondary-container)',
    bg: 'var(--md-sys-color-secondary-container)',
    label: 'Valutazione mancante',
  },
  learning_gap: {
    icon: 'school',
    color: 'var(--md-sys-color-on-surface-variant)',
    bg: 'var(--md-sys-color-surface-container-high)',
    label: 'Lacuna apprendimento',
  },
}

const SuggestionItem: React.FC<{ suggestion: AISuggestion }> = ({ suggestion }) => {
  const meta = SUGGESTION_META[suggestion.type]
  const confidencePct = Math.round(suggestion.confidence * 100)

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 'var(--md-sys-spacing-4)',
        alignItems: 'flex-start',
        padding: 'var(--md-sys-spacing-4)',
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        border: '1px solid var(--md-sys-color-outline-variant)',
        backgroundColor: 'var(--md-sys-color-surface-container)',
      }}
    >
      {/* Icon badge */}
      <Box
        sx={{
          width: 'var(--md-sys-spacing-10)',
          height: 'var(--md-sys-spacing-10)',
          borderRadius: 'var(--md-sys-shape-corner-medium)',
          backgroundColor: meta.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Box
          component="span"
          className="material-symbols-outlined"
          aria-hidden="true"
          sx={{ color: meta.color, fontSize: 'var(--md-sys-typescale-label-large-font-size)' }}
        >
          {meta.icon}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--md-sys-spacing-2)',
            marginBottom: 'var(--md-sys-spacing-1)',
            flexWrap: 'wrap',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: meta.color,
              backgroundColor: meta.bg,
              borderRadius: 'var(--md-sys-shape-corner-full)',
              padding: '2px 8px',
              fontWeight: 'var(--md-sys-typescale-weight-medium)',
            }}
          >
            {meta.label}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            {confidencePct}% confidenza
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{ color: 'var(--md-sys-color-on-surface)' }}
        >
          {suggestion.message}
        </Typography>
      </Box>
    </Box>
  )
}

const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({ suggestions, className }) => {
  const atRisk = suggestions.filter((s) => s.type === 'student_at_risk')
  const excellent = suggestions.filter((s) => s.type === 'student_excellence')
  const other = suggestions.filter(
    (s) => s.type !== 'student_at_risk' && s.type !== 'student_excellence',
  )

  return (
    <InfoCard
      elevation={1}
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-4)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--md-sys-spacing-3)',
        }}
      >
        <Box
          component="span"
          className="material-symbols-outlined"
          aria-hidden="true"
          sx={{ color: 'var(--md-sys-color-primary)' }}
        >
          auto_awesome
        </Box>
        <Typography
          variant="h6"
          sx={{ color: 'var(--md-sys-color-on-surface)', flex: 1 }}
        >
          Suggerimenti AI
        </Typography>
        <AiMemoryChip label={`${suggestions.length} suggeriment${suggestions.length === 1 ? 'o' : 'i'}`} />
      </Box>

      {suggestions.length === 0 ? (
        <EmptyState
          title="Nessun suggerimento"
          description="Il motore AI non ha rilevato situazioni critiche o di eccellenza per la selezione corrente."
          icon="check_circle"
        />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-3)' }}>
          {atRisk.length > 0 && (
            <>
              <Typography
                variant="overline"
                sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                Studenti a rischio ({atRisk.length})
              </Typography>
              {atRisk.map((s) => (
                <SuggestionItem key={s.id} suggestion={s} />
              ))}
            </>
          )}

          {excellent.length > 0 && (
            <>
              <Typography
                variant="overline"
                sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                Eccellenze ({excellent.length})
              </Typography>
              {excellent.map((s) => (
                <SuggestionItem key={s.id} suggestion={s} />
              ))}
            </>
          )}

          {other.map((s) => (
            <SuggestionItem key={s.id} suggestion={s} />
          ))}
        </Box>
      )}
    </InfoCard>
  )
}

export default AISuggestionsPanel
