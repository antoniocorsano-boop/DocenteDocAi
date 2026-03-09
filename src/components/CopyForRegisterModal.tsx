// MD3 Compliant
import React, { useState, useMemo } from 'react';
import { Lezione, RegisterEntry, Studente, Valutazione } from '../types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import { M3Dialog } from './ui';

interface CopyForRegisterModalProps {
    lesson: Lezione;
    entry: RegisterEntry;
    students: Studente[];
    todaysEvaluations: Valutazione[];
    onClose: () => void;
}

const CopyForRegisterModal: React.FC<CopyForRegisterModalProps> = ({ lesson, entry, students, todaysEvaluations, onClose }) => {
    const [activeTab, setActiveTab] = useState<'text' | 'json'>('text');
    const [includeAbsents, setIncludeAbsents] = useState(true);
    const [includeGrades, setIncludeGrades] = useState(true);
    const [includeHomework, setIncludeHomework] = useState(true);

    const generatedText = useMemo(() => {
        const lines: string[] = [];
        lines.push(`ARGOMENTO: ${lesson.contenuto}`);
        if (lesson.obiettivi) lines.push(`OBIETTIVI: ${lesson.obiettivi.replace(/- /g, '').replace(/\n/g, '; ')}`); 
        if (includeHomework && lesson.compiti) lines.push(`COMPITI: ${lesson.compiti}`);
        if (includeAbsents) {
            const absentNames = students.filter(s => entry.studentAttendance[s.id] === 'assente').map(s => s.cognome).join(', ');
            if (absentNames) lines.push(`ASSENTI: ${absentNames}`);
        }
        if (includeGrades && todaysEvaluations.length > 0) {
            const gradesText = todaysEvaluations.map(ev => `${students.find(st => st.id === ev.studenteId)?.cognome}: ${ev.voto}`).join(' | ');
            lines.push(`VOTI: ${gradesText}`);
        }
        return lines.join('\n\n');
    }, [lesson, entry, students, todaysEvaluations, includeAbsents, includeGrades, includeHomework]);

    const generatedJson = useMemo(() => {
        return JSON.stringify({
            app: "OrarioDocAI",
            payload: { topic: lesson.contenuto, homework: lesson.compiti, absentees: students.filter(s => entry.studentAttendance[s.id] === 'assente').map(s => s.cognome) }
        }, null, 2);
    }, [lesson, entry, students]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copiato negli appunti!");
    };

    return (
        <M3Dialog
            title="Esporta per Registro"
            onClose={onClose}
            maxWidth="md"
            buttons={<>
                <Button onClick={onClose} variant="text">Chiudi</Button>
                <Button onClick={() => handleCopy(activeTab === 'text' ? generatedText : generatedJson)} variant="contained">
                    <span style={{ marginRight: 'var(--md-sys-spacing-2)' }}>content_copy</span> COPIA
                </Button>
            </>}
        >
                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)' }}>
                                        <Tabs
                      value={activeTab}
                      onChange={(_, v: string) => ((id: string) => {
                            if (id === 'text' || id === 'json') setActiveTab(id);
                        })(v)}
                      indicatorColor="primary"
                      textColor="primary"
                      aria-label="Sezioni di navigazione"
                      sx={{
                        bgcolor: 'var(--md-sys-color-surface-container-low)',
                        borderRadius: 'var(--md-sys-shape-corner-full)',
                        border: '1px solid var(--md-sys-color-outline-variant)',
                        minHeight: 'auto',
                        p: 0.5,
                        ...{ width: "var(--md-sys-percent-100)" },
                      }}
                    >
                      {([{ id: 'text', label: 'Manuale', icon: 'content_paste' }, { id: 'json', label: 'Bridge AI', icon: 'extension' }]).map((tab: { id: string; label: string; icon?: string; badge?: number | string }) => (
                        <Tab
                          key={tab.id}
                          value={tab.id}
                          id={`tab-${tab.id}`}
                          aria-controls={`panel-${tab.id}`}
                          data-testid={`tab-${tab.id}`}
                          label={(
                            <Badge badgeContent={tab.badge} color="error">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {tab.icon && <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-label-large-font-size)' }}>{tab.icon}</Box>}
                                {tab.label}
                              </Box>
                            </Badge>
                          )}
                          sx={{
                            borderRadius: 'var(--md-sys-shape-corner-full)',
                            minHeight: 'auto',
                            py: 1,
                            px: 2,
                            textTransform: 'uppercase',
                            fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                          }}
                        />
                      ))}
                    </Tabs>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <div style={{
                        padding: 'var(--md-sys-spacing-4)',
                        backgroundColor: 'var(--md-sys-color-on-primary)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        display: "flex",
                        flexWrap: "wrap",
                        border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)"
                    }}>
                        <label  style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <input type="checkbox" checked={includeAbsents} onChange={e => setIncludeAbsents(e.target.checked)}  /> 
                            Assenti
                        </label>
                        <label  style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <input type="checkbox" checked={includeGrades} onChange={e => setIncludeGrades(e.target.checked)}  /> 
                            Voti
                        </label>
                        <label  style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <input type="checkbox" checked={includeHomework} onChange={e => setIncludeHomework(e.target.checked)}  /> 
                            Compiti
                        </label>
                    </div>

                    <TextField multiline 
                        label={activeTab === 'text' ? "Testo da incollare" : "Codice Bridge (JSON)"}
                        value={activeTab === 'text' ? generatedText : generatedJson} 
                        slotProps={{ htmlInput: { readOnly: true } }}
                        rows={10}
                        sx={{ mb: 2, backgroundColor: 'var(--md-sys-color-surface-container-high)', fontFamily: 'monospace', fontSize: 'var(--md-sys-typescale-body-small-font-size)' }}
                    />
                </div>
            </M3Dialog>
    );
};

export default CopyForRegisterModal;

