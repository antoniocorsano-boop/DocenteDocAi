// MD3 Compliant
import React, { useState, useMemo } from 'react';
import { Lezione, RegisterEntry, Studente, Valutazione } from '../types';
import { Button  } from '@mui/material';
import { M3Dialog, TabGroup, TextArea } from './ui';

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
                    <TabGroup 
                        tabs={[{ id: 'text', label: 'Manuale', icon: 'content_paste' }, { id: 'json', label: 'Bridge AI', icon: 'extension' }]}
                        activeTab={activeTab}
                        onTabChange={(id: string) => {
                            if (id === 'text' || id === 'json') setActiveTab(id);
                        }}
                        variant="contained"
                        style={{ width: "var(--md-sys-percent-100)" }}
                    />
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

                    <TextArea 
                        label={activeTab === 'text' ? "Testo da incollare" : "Codice Bridge (JSON)"}
                        value={activeTab === 'text' ? generatedText : generatedJson} 
                        readOnly 
                        rows={10}
                        style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', fontFamily: 'monospace', fontSize: 'var(--md-sys-typescale-body-small-font-size)' }}
                    />
                </div>
            </M3Dialog>
    );
};

export default CopyForRegisterModal;

