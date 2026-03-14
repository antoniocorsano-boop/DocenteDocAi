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
      </Tabs>
      <Box sx={{ minHeight: 80 }}>
        {tab === 0 && (
          <CopilotPerformancePanel suggestions={suggestions} className={className} studentId={studentId} />
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
                students={[]}
                evaluations={[]}
                competencyEvaluations={[]}
                  settings={{
                    timeSlots: [],
                    defaultView: '',
                    schoolType: '',
                    livelli: [],
                    sezioni: [],
                    classi: [],
                    disciplines: [],
                    teachingAssignments: [],
                    competenze: [],
                    nomeInsegnante: '',
                    cognomeInsegnante: '',
                    email: '',
                    nomeIstituto: '',
                    cittaIstituto: '',
                    anniScolastici: [],
                    annoScolasticoCorrente: '',
                    activityStartDate: '',
                    activityEndDate: '',
                    notificationSettings: { enabled: false, reminders: [], desktopNotifications: false },
                    showGuidanceTips: false,
                    visualTheme: '',
                    uiMode: 'classic',
                    visualPreferences: { font: '', shape: '' },
                    backupFolderId: '',
                    backupFolderName: '',
                    googleClientId: '',
                    googleApiKey: '',
                    autoSyncEnabled: false,
                    autoSyncInterval: 0,
                    securityPin: '',
                    oreGiornaliere: 0,
                    orarioInizio: '',
                    onboarded: false,
                  }}
                selectedClass={className}
                prove={[]}
              />
            )}
          </Box>
        )}
      </Box>
    </InfoCard>
  );
}
