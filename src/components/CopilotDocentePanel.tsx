import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import InfoCard from './ui/InfoCard';
import SectionHeader from './ui/SectionHeader';

export default function CopilotDocentePanel(): JSX.Element {
  const [tab, setTab] = React.useState<number>(0);

  return (
    <InfoCard variant="outlined" sx={{ mt: 'var(--md-sys-spacing-6)' }}>
      <SectionHeader
        title="Copilot Docente (Prossimamente)"
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
        {['Pianificazione', 'Gestione classe', 'Analisi avanzata', 'Automazioni'].map((label, i) => (
          <Tab key={label} label={label} id={`copilot-tab-${i}`} aria-controls={`copilot-panel-${i}`} />
        ))}
      </Tabs>
      <Box sx={{ minHeight: 80 }}>
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          Funzionalità in arrivo: suggerimenti AI, automazioni, analisi avanzate e pianificazione didattica intelligente.
        </Typography>
      </Box>
    </InfoCard>
  );
}
