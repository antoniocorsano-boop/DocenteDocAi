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
import AIExplainabilityPanel from './copilot/AIExplainabilityPanel';
import AIDevToolsPanel from './copilot/AIDevToolsPanel';
import CopilotRecommendationPanel from './copilot/CopilotRecommendationPanel';
import { AITabErrorBoundary } from './copilot/AITabErrorBoundary';
import FundingPanel from './copilot/FundingPanel';

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
        <Tab label="Spiegabilità" />
        <Tab label="Dev Tools" />
        <Tab label="Raccomandazioni AI" />
        <Tab label="Finanziamenti" />
      </Tabs>
      <Box sx={{ minHeight: 80 }}>
        {tab === 0 && (
          <AITabErrorBoundary tabName="Performance">
            <CopilotPerformancePanel
              suggestions={suggestions}
              className={className}
              studentId={studentId}
              students={students}
              evaluations={evaluations}
            />
          </AITabErrorBoundary>
        )}
        {tab === 1 && (
          <AITabErrorBoundary tabName="Overview">
            <CopilotHealthOverviewPanel classHealth={classHealth} snapshots={snapshots} className={className} />
          </AITabErrorBoundary>
        )}
        {tab === 2 && (
          <AITabErrorBoundary tabName="Andamento">
            <AITrendPanel snapshots={snapshots} className={className} />
          </AITabErrorBoundary>
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
          <AITabErrorBoundary tabName="Planning">
            <PlanningAssistantPanel
              suggestions={suggestions}
              students={students}
              evaluations={evaluations}
              udas={udas}
              className={className}
              studentId={studentId}
            />
          </AITabErrorBoundary>
        )}
        {tab === 5 && (
          <AITabErrorBoundary tabName="Comunicazione">
            <CommunicationHelperPanel
              suggestions={suggestions}
              students={students}
              evaluations={evaluations}
              className={className}
              studentId={studentId}
            />
          </AITabErrorBoundary>
        )}
        {tab === 6 && (
          <AITabErrorBoundary tabName="Predizione">
            <TrendPredictionPanel
              students={students}
              evaluations={evaluations}
              className={className}
              studentId={studentId}
            />
          </AITabErrorBoundary>
        )}
        {tab === 7 && (
          <AITabErrorBoundary tabName="Dashboard">
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
          </AITabErrorBoundary>
        )}
        {tab === 8 && (
          <AITabErrorBoundary tabName="Azioni">
            <CopilotActionsBar
              riskSuggestions={suggestions}
              students={students}
              evaluations={evaluations}
            />
          </AITabErrorBoundary>
        )}
        {tab === 9 && (
          <AITabErrorBoundary tabName="Spiegabilità">
            <AIExplainabilityPanel suggestions={suggestions} defaultFirstExpanded />
          </AITabErrorBoundary>
        )}
        {tab === 10 && (
          <AITabErrorBoundary tabName="Dev Tools">
            <AIDevToolsPanel />
          </AITabErrorBoundary>
        )}
        {tab === 11 && (
          <AITabErrorBoundary tabName="Raccomandazioni AI">
            <CopilotRecommendationPanel
              students={students}
              evaluations={evaluations}
              udas={udas}
              className={className}
            />
          </AITabErrorBoundary>
        )}
        {tab === 12 && (
          <AITabErrorBoundary tabName="Finanziamenti">
            <FundingPanel
              students={students}
              udas={udas}
              className={className}
            />
          </AITabErrorBoundary>
        )}
      </Box>
    </InfoCard>
  );
}
