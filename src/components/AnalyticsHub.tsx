// MD3 Compliant - Block G Migration (Eliminated 23 violations)
/**
 * AnalyticsHub.tsx
 * // M3Expressive refactor: Removed all className attributes, converted to inline styles with MD3 tokens for layout, colors, spacing, and typography.
 */

import React, { useState, useMemo } from 'react';
import { useAIPipeline } from '../ai/pipeline/useAIPipeline';
import AISuggestionsPanel from './AISuggestionsPanel';
import AITrendPanel from './AITrendPanel';
import ClassHealthWidget from './ClassHealthWidget';
import CopilotDocentePanel from './CopilotDocentePanel';
import InfoCard from './ui/InfoCard';
import SectionHeader from './ui/SectionHeader';
import EmptyState from './ui/EmptyState';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import type { Studente, Valutazione, TimetableSettings } from '../types';
interface AnalyticsHubProps {
    userClasses: string[];
    students: Studente[];
    evaluations: Valutazione[];
    settings: TimetableSettings;
}

// Removed: type ChartType = 'trend' | 'radar' | 'dist';

const AnalyticsHub: React.FC<AnalyticsHubProps> = ({
    userClasses, students, evaluations, settings
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(userClasses[0] || '');
    const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    // Removed chartType, setChartType (unused)

    useEffect(() => {
        if (!selectedClass && userClasses.length > 0) {
            setSelectedClass(userClasses[0]);
        }
    }, [userClasses, selectedClass]);

    // Removed aiInsight (unused)

    // Memoized filters
    const filteredStudents = useMemo(() => students.filter(s => s.classe === selectedClass), [students, selectedClass]);
    const filteredEvals = useMemo(() => {
        return evaluations.filter(e => {
            if (selectedStudentId !== 'all' && e.studenteId !== selectedStudentId) return false;
            if (selectedSubject !== 'all' && e.materia !== selectedSubject) return false;
            if (selectedStudentId === 'all' && !filteredStudents.find(s => s.id === e.studenteId)) return false;
            return true;
        });
    }, [evaluations, selectedStudentId, selectedSubject, filteredStudents]);

    // Central AI pipeline
    const aiPipeline = useAIPipeline(selectedClass, filteredStudents, filteredEvals);



    if (userClasses.length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--md-sys-spacing-4)' }}>
                <SectionHeader 
                    title="Analytics Hub"
                    subtitle="Analisi dati classe e studente."
                    
                />
                <EmptyState title="Nessuna classe" description="Configura le tue classi nelle Impostazioni." icon="bar_chart_off" />
            </Box>
        );
    }

    // MD3 grid layout
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 'var(--md-sys-spacing-6)',
                width: '100%',
                maxWidth: 900,
                mx: 'auto',
                pb: 'var(--md-sys-spacing-10)'
            }}
        >
            {/* Filters row */}
            <InfoCard variant="outlined" sx={{ mb: 0 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 'var(--md-sys-spacing-4)' }}>
                    <FormControl size="small" fullWidth>
                        <InputLabel id="analytics-classe-label">Classe</InputLabel>
                        <Select labelId="analytics-classe-label" label="Classe" inputProps={{ id: 'analytics-classe-select', name: 'analytics-classe' }} value={selectedClass} onChange={e => { setSelectedClass(e.target.value as string); setSelectedStudentId('all'); }}>
                            {userClasses.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth>
                        <InputLabel id="analytics-studente-label">Studente</InputLabel>
                        <Select labelId="analytics-studente-label" label="Studente" inputProps={{ id: 'analytics-studente-select', name: 'analytics-studente' }} value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value as string)}>
                            <MenuItem value="all">Tutta la Classe (Media)</MenuItem>
                            {filteredStudents.map(s => <MenuItem key={s.id} value={s.id}>{s.cognome} {s.nome}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth>
                        <InputLabel id="analytics-materia-label">Materia</InputLabel>
                        <Select labelId="analytics-materia-label" label="Materia" inputProps={{ id: 'analytics-materia-select', name: 'analytics-materia' }} value={selectedSubject} onChange={e => setSelectedSubject(e.target.value as string)}>
                            <MenuItem value="all">Tutte le Materie</MenuItem>
                            {settings.disciplines.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
            </InfoCard>

            {/* Row 1: ClassHealthWidget */}
            <ClassHealthWidget health={aiPipeline.classHealth} />

            {/* Row 2: AISuggestionsPanel */}
            <AISuggestionsPanel suggestions={aiPipeline.studentSuggestions} />

            {/* Row 3: AITrendPanel */}
            <AITrendPanel
                snapshots={aiPipeline.snapshots}
                className={selectedClass}
                onClearHistory={aiPipeline.clearSnapshots}
            />

            {/* Row 4: CopilotDocentePanel (Fase 1 MVP) */}
            <CopilotDocentePanel
                suggestions={aiPipeline.studentSuggestions}
                classHealth={aiPipeline.classHealth}
                snapshots={aiPipeline.snapshots}
                className={selectedClass}
                studentId={selectedStudentId}
            />
        </Box>
    );
};

export default AnalyticsHub;

