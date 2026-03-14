import React from 'react';
import InfoCard from '../ui/InfoCard';
import SectionHeader from '../ui/SectionHeader';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import type { AISuggestion } from '../../ai/contextEngine/types';

interface CopilotPerformancePanelProps {
  suggestions: AISuggestion[];
  className: string;
  studentId: string;
}

export default function CopilotPerformancePanel({ suggestions, className, studentId }: CopilotPerformancePanelProps): JSX.Element {
  const filtered = React.useMemo(() => {
    if (studentId === 'all') return suggestions;
    return suggestions.filter(s => s.studentId === studentId);
  }, [suggestions, studentId]);

  if (!filtered.length) {
    return (
      <InfoCard variant="outlined">
        <SectionHeader title="Studenti a rischio / eccellenza" subtitle="Nessun suggerimento disponibile per la selezione attuale." />
      </InfoCard>
    );
  }

  return (
    <InfoCard variant="outlined">
      <SectionHeader title="Studenti a rischio / eccellenza" subtitle={`Classe ${className}`} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map(s => (
          <Box key={s.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, borderRadius: 2, backgroundColor: s.type === 'warning' ? 'var(--md-sys-color-error-container)' : 'var(--md-sys-color-tertiary-container)' }}>
            <Typography variant="subtitle2" sx={{ color: s.type === 'warning' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-tertiary)' }}>
              {s.type === 'warning' ? 'Rischio' : 'Eccellenza'}
            </Typography>
            <Typography variant="body2" sx={{ flex: 1 }}>{s.message}</Typography>
            <Button size="small" variant="text" aria-label="Approfondisci" sx={{ color: 'var(--md-sys-color-primary)' }}>
              Approfondisci
            </Button>
          </Box>
        ))}
      </Box>
    </InfoCard>
  );
}
