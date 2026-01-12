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
            <M3DialogContent className="space-y-12 px-12 pt-12 pb-0">
                <div className="px-12 py-8 bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-large)] mb-12">
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

                <div className="space-y-12">
                    <div className="gap-12 p-12 bg-[var(--md-sys-color-surface-container)] rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)] shadow-inner" style={{ display: "flex", flexWrap: "wrap", border: "1px solid var(--md-sys-color-outline)" }}>
                        <label className="chip has-checkbox select-none" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <input type="checkbox" checked={includeAbsents} onChange={e => setIncludeAbsents(e.target.checked)} className="mr-4 accent-primary" /> 
                            Assenti
                        </label>
                        <label className="chip has-checkbox select-none" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <input type="checkbox" checked={includeGrades} onChange={e => setIncludeGrades(e.target.checked)} className="mr-4 accent-primary" /> 
                            Voti
                        </label>
                        <label className="chip has-checkbox select-none" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <input type="checkbox" checked={includeHomework} onChange={e => setIncludeHomework(e.target.checked)} className="mr-4 accent-primary" /> 
                            Compiti
                        </label>
                    </div>

                    <TextArea 
                        label={activeTab === 'text' ? "Testo da incollare" : "Codice Bridge (JSON)"}
                        value={activeTab === 'text' ? generatedText : generatedJson} 
                        readOnly 
                        rows={10}
                        containerClassName="!bg-[var(--md-sys-color-surface-container-high)]est shadow-inner font-mono text-xs"
                    />
                </div>
            </M3DialogContent>
            <M3DialogActions className="gap-12 px-12 pb-12" style={{ paddingTop: "0" }}>
                <M3Button onClick={onClose} variant="text">Chiudi</M3Button>
                <M3Button onClick={() => handleCopy(activeTab === 'text' ? generatedText : generatedJson)} variant="filled" className="shadow-[var(--md-sys-elevation-level3)] !px-16">
                    <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>content_copy</span> COPIA
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default CopyForRegisterModal;


