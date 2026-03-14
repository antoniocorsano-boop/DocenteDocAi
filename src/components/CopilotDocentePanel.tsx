import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import InfoCard from './ui/InfoCard';
import SectionHeader from './ui/SectionHeader';
import CopilotPerformancePanel from './copilot/CopilotPerformancePanel';
import CopilotHealthOverviewPanel from './copilot/CopilotHealthOverviewPanel';
import AITrendPanel from './AITrendPanel';
import Button from '@mui/material/Button';
import ExportModal from './ExportModal';
import PlanningAssistantPanel from './copilot/PlanningAssistantPanel';
import CommunicationHelperPanel from './copilot/CommunicationHelperPanel';
import TrendPredictionPanel from './copilot/TrendPredictionPanel';
import AggregatedDashboard from './copilot/AggregatedDashboard';
import CopilotActionsBar from './copilot/CopilotActionsBar';

import type { AISuggestion } from '../ai/contextEngine/types';
import type { ClassHealthIndex } from '../ai/classHealth/types';
import type { AISnapshot } from '../stores/useAISnapshotStore';
import type { Studente, Valutazione, Uda, Competenza, TimetableSettings } from '../types';

interface CopilotDocentePanelProps {
  suggestions: AISuggestion[];
  classHealth: ClassHealthIndex;
  snapshots: AISnapshot[];
  className: string;
  studentId: string;
  students: Studente[];
  evaluations: Valutazione[];
  udas: Uda[];
  competenze: Competenza[];
  settings: TimetableSettings;
}

export default function CopilotDocentePanel({ suggestions, classHealth, snapshots, className, studentId, students, evaluations, udas, settings }: Omit<CopilotDocentePanelProps, 'competenze'>): JSX.Element {
  const [tab, setTab] = React.useState<number>(0);
  const [exportOpen, setExportOpen] = React.useState(false);

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
        <Tab label="Andamento" />
        <Tab label="Esportazione" />
        <Tab label="Planning" />
        <Tab label="Comunicazione" />
        <Tab label="Predizione" />
        <Tab label="Dashboard" />
        <Tab label="Azioni" />
      </Tabs>
      <Box sx={{ minHeight: 80 }}>
        {tab === 0 && (
          <CopilotPerformancePanel
            suggestions={suggestions}
            className={className}
            studentId={studentId}
            students={students}
            evaluations={evaluations}
          />
        )}
        {tab === 1 && (
          <CopilotHealthOverviewPanel classHealth={classHealth} snapshots={snapshots} className={className} />
        )}
        {tab === 2 && (
          <AITrendPanel snapshots={snapshots} className={className} />
        )}
        {tab === 3 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Esporta lo storico AI della classe come report PDF/CSV.
            </Typography>
            <Button variant="contained" onClick={() => setExportOpen(true)} aria-label="Esporta report classe">
              Esporta Report Classe
            </Button>
            {exportOpen && (
              <ExportModal
                onClose={() => setExportOpen(false)}
                students={students}
                evaluations={evaluations}
                competencyEvaluations={[]}
                settings={settings}
                selectedClass={className}
                prove={[]}
              />
            )}
          </Box>
        )}
        {tab === 4 && (
          <PlanningAssistantPanel
            suggestions={suggestions}
            students={students}
            evaluations={evaluations}
            udas={udas}
            className={className}
            studentId={studentId}
          />
        )}
        {tab === 5 && (
          <CommunicationHelperPanel
            suggestions={suggestions}
            students={students}
            evaluations={evaluations}
            className={className}
            studentId={studentId}
          />
        )}
        {tab === 6 && (
          <TrendPredictionPanel
            students={students}
            evaluations={evaluations}
            className={className}
            studentId={studentId}
          />
        )}
        {tab === 7 && (
          <AggregatedDashboard
            suggestions={suggestions}
            classHealth={classHealth}
            snapshots={snapshots}
            students={students}
            evaluations={evaluations}
            udas={udas}
            className={className}
            studentId={studentId}
          />
        )}
        {tab === 8 && (
          <CopilotActionsBar
            riskSuggestions={suggestions}
            students={students}
            evaluations={evaluations}
          />
        )}
      </Box>
    </InfoCard>
  );
}
