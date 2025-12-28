import React, { useState, useMemo } from 'react';
import { Lezione, RegisterEntry, Studente, Valutazione } from '../types';
import { TabGroup, TextArea } from './M3Components';

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
        <div className="dialog-backdrop">
            <div
                className="dialog-container w-full max-w-lg shadow-xl"
                style={{
                    maxWidth: '95vw',
                    width: '100%',
                    maxHeight: '95vh',
                    margin: '0 auto',
                    padding: '0',
                    overflowY: 'auto',
                    borderRadius: '16px',
                    boxShadow: '0 2px 24px rgba(0,0,0,0.18)',
                    background: 'var(--sys-surface)',
                }}
            >
                <div className="dialog-header border-b border-outline-variant p-6">
                    <h2 className="m3-headline-small font-black">Esporta per Registro</h2>
                    <button onClick={onClose} className="icon-button"><span className="material-symbols-outlined">close</span></button>
                </div>
                
                <div className="px-6 py-4 bg-surface-container-low">
                    <TabGroup 
                        tabs={[{ id: 'text', label: 'Manuale', icon: 'content_paste' }, { id: 'json', label: 'Bridge AI', icon: 'extension' }]}
                        activeTab={activeTab}
                        onTabChange={(id) => setActiveTab(id as any)}
                        variant="primary"
                        className="w-full"
                    />
                </div>

                <div className="dialog-content p-6 space-y-6">
                    <div className="flex flex-wrap gap-2 p-4 bg-surface-container rounded-[24px] border border-outline-variant shadow-inner">
                        <label className="chip cursor-pointer has-checkbox select-none"><input type="checkbox" checked={includeAbsents} onChange={e => setIncludeAbsents(e.target.checked)} className="mr-2 accent-primary" /> Assenti</label>
                        <label className="chip cursor-pointer has-checkbox select-none"><input type="checkbox" checked={includeGrades} onChange={e => setIncludeGrades(e.target.checked)} className="mr-2 accent-primary" /> Voti</label>
                        <label className="chip cursor-pointer has-checkbox select-none"><input type="checkbox" checked={includeHomework} onChange={e => setIncludeHomework(e.target.checked)} className="mr-2 accent-primary" /> Compiti</label>
                    </div>

                    <TextArea 
                        label={activeTab === 'text' ? "Testo da incollare" : "Codice Bridge (JSON)"}
                        value={activeTab === 'text' ? generatedText : generatedJson} 
                        readOnly 
                        rows={10}
                        containerClassName="!bg-surface-container-highest shadow-inner font-mono text-xs"
                    />
                </div>

                <div className="dialog-footer bg-surface-container-high p-6 border-t border-outline-variant">
                    <button onClick={onClose} className="button button-text font-bold">Chiudi</button>
                    <button onClick={() => handleCopy(activeTab === 'text' ? generatedText : generatedJson)} className="button button-filled shadow-xl font-black !px-10">
                        <span className="material-symbols-outlined mr-2">content_copy</span> COPIA
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CopyForRegisterModal;
