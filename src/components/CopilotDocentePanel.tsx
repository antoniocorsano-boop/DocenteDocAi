import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import InfoCard from './ui/InfoCard';
import SectionHeader from './ui/SectionHeader';
import CopilotPerformancePanel from './copilot/CopilotPerformancePanel';
import CopilotHealthOverviewPanel from './copilot/CopilotHealthOverviewPanel';

import type { AISuggestion } from '../ai/contextEngine/types';
import type { ClassHealthIndex } from '../ai/classHealth/types';
import type { AISnapshot } from '../stores/useAISnapshotStore';
interface CopilotDocentePanelProps {
  suggestions: AISuggestion[];
  classHealth: ClassHealthIndex;
  snapshots: AISnapshot[];
  className: string;
  studentId: string;
}

export default function CopilotDocentePanel({ suggestions, classHealth, snapshots, className, studentId }: CopilotDocentePanelProps): JSX.Element {
  const [tab, setTab] = React.useState<number>(0);

  return (
    <InfoCard variant="outlined" sx={{ mt: 'var(--md-sys-spacing-6)' }}>
      <SectionHeader
        title="Copilot Docente"
        subtitle="AI per pianificazione, gestione e automazioni didattiche."
      />
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        aria-label="Copilot Docente Tabs"
        sx={{ mb: 'var(--md-sys-spacing-4)' }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Performance" />
        <Tab label="Overview" />
        <Tab label="Planning" />
        <Tab label="Aggregated Insights" />
      </Tabs>
      <Box sx={{ minHeight: 80 }}>
        {tab === 0 && (
          <CopilotPerformancePanel suggestions={suggestions} className={className} studentId={studentId} />
        )}
        {tab === 1 && (
          <CopilotHealthOverviewPanel classHealth={classHealth} snapshots={snapshots} className={className} />
        )}
        {tab > 1 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            Funzionalità in arrivo: suggerimenti AI, automazioni, analisi avanzate e pianificazione didattica intelligente.
          </Typography>
        )}
      </Box>
    </InfoCard>
  );
}
