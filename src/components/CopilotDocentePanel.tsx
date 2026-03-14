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
import LessonAssistantPanel from './LessonAssistantPanel';
import UdaPlanner from './UdaPlanner';
import AISuggestionsPanel from './AISuggestionsPanel';
import TeacherCopilotPanel from './TeacherCopilotPanel';

import type { AISuggestion } from '../ai/contextEngine/types';
import type { ClassHealthIndex } from '../ai/classHealth/types';
import type { AISnapshot } from '../stores/useAISnapshotStore';
import type { LessonAssistantResponse } from '../ai/lessonAssistant/types';
import type { Studente, Valutazione, Uda, Competenza, TimetableSettings } from '../types';

interface CopilotDocentePanelProps {
  suggestions: AISuggestion[];
  classHealth: ClassHealthIndex;
  snapshots: AISnapshot[];
  className: string;
  studentId: string;
  lessonAssistant: LessonAssistantResponse;
  students: Studente[];
  evaluations: Valutazione[];
  udas: Uda[];
  competenze: Competenza[];
  settings: TimetableSettings;
}

export default function CopilotDocentePanel({ suggestions, classHealth, snapshots, className, studentId, lessonAssistant, students, evaluations, udas, competenze, settings }: CopilotDocentePanelProps): JSX.Element {
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
        <Tab label="Aggregated Insights" />
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
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, py: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <LessonAssistantPanel data={lessonAssistant} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <UdaPlanner
                uda={udas}
                onSaveUda={() => {}}
                onDeleteUda={() => {}}
                aiSettings={{ model: 'gemini' }}
                competenze={competenze}
                settings={settings}
                onSaveReport={() => {}}
                showGuidanceTips={false}
                lessons={{}}
                onNavigate={() => {}}
                knowledgeBase={[]}
                showToast={() => {}}
                setIsLoadingModalOpen={() => {}}
                setLoadingModalMessage={() => {}}
                eventi={[]}
                onAddLessons={() => {}}
                onSaveEvent={() => {}}
                curricula={[]}
              />
            </Box>
          </Box>
        )}
        {tab === 5 && (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, py: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <AISuggestionsPanel suggestions={suggestions} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <TeacherCopilotPanel students={students} evaluations={evaluations} className={className} />
            </Box>
          </Box>
        )}
      </Box>
    </InfoCard>
  );
}
