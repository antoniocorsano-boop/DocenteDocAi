// MD3 Compliant
/**
 * CopilotView.tsx
 * Vista standalone per il Copilot Docente — registrata come View 'copilot'.
 * Self-contained: legge direttamente dagli store Zustand,
 * stesso pattern di AnalyticsHub.tsx.
 */

import React, { useState, useMemo, useEffect } from 'react';
import CopilotDocentePanel from '../CopilotDocentePanel';
import { useAIPipeline } from '../../ai/pipeline/useAIPipeline';
import { useStudentStore } from '../../stores/useStudentStore';
import { useAcademicStore } from '../../stores/useAcademicStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';

const CopilotView: React.FC = () => {
    const students = useStudentStore((s) => s.students);
    const evaluations = useStudentStore((s) => s.evaluations);
    const udas = useAcademicStore((s) => s.uda);
    const settings = useSettingsStore((s) => s.settings);

    const userClasses = useMemo(
        () => [...new Set(students.map((s) => s.classe).filter(Boolean))].sort(),
        [students],
    );

    const [selectedClass, setSelectedClass] = useState<string>(userClasses[0] || '');
    const [selectedStudentId, setSelectedStudentId] = useState<string>('all');

    useEffect(() => {
        if (!selectedClass && userClasses.length > 0) {
            setSelectedClass(userClasses[0]);
        }
    }, [userClasses, selectedClass]);

    const filteredStudents = useMemo(
        () => students.filter((s) => s.classe === selectedClass),
        [students, selectedClass],
    );

    const filteredEvals = useMemo(
        () =>
            evaluations.filter((e) => {
                if (selectedStudentId !== 'all' && e.studenteId !== selectedStudentId) return false;
                if (!filteredStudents.find((s) => s.id === e.studenteId)) return false;
                return true;
            }),
        [evaluations, selectedStudentId, filteredStudents],
    );

    const aiPipeline = useAIPipeline(selectedClass, filteredStudents, filteredEvals);

    if (userClasses.length === 0) {
        return (
            <Box sx={{ p: 'var(--md-sys-spacing-6)' }}>
                <EmptyState
                    icon="smart_toy"
                    title="Nessuna classe disponibile"
                    description="Aggiungi studenti per accedere al Copilot Docente."
                />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)', p: 'var(--md-sys-spacing-4)' }}>
            <SectionHeader
                title="Copilot Docente"
                subtitle="AI adattiva per pianificazione, analisi e supporto didattico."
            />

            {/* Selettori classe / studente */}
            <Box sx={{ display: 'flex', gap: 'var(--md-sys-spacing-3)', flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="copilot-view-classe-label">Classe</InputLabel>
                    <Select
                        labelId="copilot-view-classe-label"
                        label="Classe"
                        value={selectedClass}
                        inputProps={{ id: 'copilot-view-classe-select', name: 'copilot-view-classe' }}
                        onChange={(e) => {
                            setSelectedClass(e.target.value as string);
                            setSelectedStudentId('all');
                        }}
                    >
                        {userClasses.map((c) => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="copilot-view-studente-label">Studente</InputLabel>
                    <Select
                        labelId="copilot-view-studente-label"
                        label="Studente"
                        value={selectedStudentId}
                        inputProps={{ id: 'copilot-view-studente-select', name: 'copilot-view-studente' }}
                        onChange={(e) => setSelectedStudentId(e.target.value as string)}
                    >
                        <MenuItem value="all">Tutta la classe</MenuItem>
                        {filteredStudents.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                                {s.cognome} {s.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <CopilotDocentePanel
                suggestions={aiPipeline.studentSuggestions}
                classHealth={aiPipeline.classHealth}
                snapshots={aiPipeline.snapshots}
                className={selectedClass}
                studentId={selectedStudentId}
                students={filteredStudents}
                evaluations={filteredEvals}
                udas={udas}
                settings={settings}
            />
        </Box>
    );
};

export default CopilotView;
