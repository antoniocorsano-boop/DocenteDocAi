// MD3 Compliant
import React, { useState, useMemo } from 'react';
import { Lezione, RegisterEntry, Studente, Valutazione } from '../types';
import { TabGroup, TextArea, M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';

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
            level={1}
        >
            <M3DialogContent >
                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)' }}>
                    <TabGroup 
                        tabs={[{ id: 'text', label: 'Manuale', icon: 'content_paste' }, { id: 'json', label: 'Bridge AI', icon: 'extension' }]}
                        activeTab={activeTab}
                        onTabChange={(id: string) => {
                            if (id === 'text' || id === 'json') setActiveTab(id);
                        }}
                        variant="primary"
                        style={{ width: "100%" }}
                    />
                </div>

                <div >
                    <div style={{
                        padding: 'var(--md-sys-spacing-4)',
                        backgroundColor: 'var(--md-sys-color-on-primary)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        display: "flex",
                        flexWrap: "wrap",
                        border: "1px solid var(--md-sys-color-outline)"
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
                        containerClassName="!bg-[var(--md-sys-color-surfaceContainerHigh)]est shadow-inner font-mono text-xs"
                    />
                </div>
            </M3DialogContent>
            <M3DialogActions  style={{ paddingTop: "0" }}>
                <M3Button onClick={onClose} variant="text">Chiudi</M3Button>
                <M3Button onClick={() => handleCopy(activeTab === 'text' ? generatedText : generatedJson)} variant="filled" >
                    <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>content_copy</span> COPIA
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default CopyForRegisterModal;








