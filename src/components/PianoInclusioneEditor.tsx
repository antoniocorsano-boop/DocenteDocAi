import React, { useState } from 'react';
import { PianoInclusione, PianoInclusioneEditorProps } from '../types';
import { getPIPSuggestion } from '../services/aiService';
import { TextArea } from './M3Components';
import AiThinkingGem from './AiThinkingGem';
import './dialog-container.css';

type SectionKey = 'puntiDiForza' | 'areeDiIntervento' | 'misureCompensative' | 'misureDispensative' | 'criteriValutazionePersonalizzati';

const createEmptyPiano = (studentId: string): PianoInclusione => ({
    id: studentId,
    puntiDiForza: '',
    areeDiIntervento: '',
    misureCompensative: '',
    misureDispensative: '',
    criteriValutazionePersonalizzati: '',
});

const PianoInclusioneEditor: React.FC<PianoInclusioneEditorProps> = ({ student, existingPiano, onClose, onSave, onDeletePiano, aiSettings, evaluations, competencyEvaluations, settings, showToast }) => {
    const [piano, setPiano] = useState<PianoInclusione>(existingPiano || createEmptyPiano(student.id));
    const [loadingSection, setLoadingSection] = useState<SectionKey | null>(null);

    const handleChange = (field: SectionKey, value: string) => {
        setPiano(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerateText = async (section: SectionKey) => {
        setLoadingSection(section);
        try {
            const studentEvaluations = evaluations.filter(e => e.studenteId === student.id);
            const studentCompetencies = competencyEvaluations.filter(e => e.studenteId === student.id);
            // FIX: Ensure correct types are passed to getPIPSuggestion
            const text = await getPIPSuggestion(
                aiSettings,
                student,
                studentEvaluations,
                studentCompetencies,
                settings.competenze,
                section
            );
            handleChange(section, text);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error generating text for ${section}`, error);
            } else {
                console.error(`Error generating text for ${section}`, String(error));
            }
            showToast("Si è verificato un errore durante la generazione del testo.", "error");
        } finally {
            setLoadingSection(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(piano);
        showToast("Piano di Inclusione salvato con successo!", "success");
        onClose();
    };

    const handleDelete = () => {
        onDeletePiano(student.id);
        onClose();
    }

    const sections: { key: SectionKey; label: string; placeholder: string; }[] = [
        { key: 'puntiDiForza', label: 'Punti di Forza', placeholder: "Descrivere le abilità e le aree in cui lo studente eccelle..." },
        { key: 'areeDiIntervento', label: 'Aree di Intervento e Fragilità', placeholder: "Descrivere le difficoltà, le aree di potenziamento e gli obiettivi specifici..." },
        { key: 'misureCompensative', label: 'Misure Compensative', placeholder: "Elencare gli strumenti e le strategie per compensare le difficoltà (es. mappe concettuali, calcolatrice)..." },
        { key: 'misureDispensative', label: 'Misure Dispensative', placeholder: "Elencare le attività da cui lo studente è dispensato (es. lettura ad alta voce, tempo ridotto)..." },
        { key: 'criteriValutazionePersonalizzati', label: 'Criteri di Valutazione Personalizzati', placeholder: "Descrivere come verranno adattate le verifiche e le valutazioni..." }
    ];

    return (
        <div className="dialog-backdrop">
            <form onSubmit={handleSubmit} className="dialog-container w-full max-w-2xl shadow-xl">
                <div className="dialog-header border-b border-outline-variant p-6 bg-surface-container-high">
                    <div>
                        <h2 className="m3-headline-medium font-black">Piano di Inclusione</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-1 opacity-80">{student.cognome} {student.nome} - Classe {student.classe}</p>
                    </div>
                    <button type="button" onClick={onClose} className="icon-button">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="dialog-content p-8 space-y-8 overflow-y-auto bg-surface">
                    {sections.map(section => (
                        <div key={section.key}>
                            <div className="flex justify-end items-end mb-4">
                                <button
                                    type="button"
                                    onClick={() => handleGenerateText(section.key)}
                                    disabled={loadingSection === section.key}
                                    className="button button-text !h-auto !py-1 !px-2 flex items-center gap-1 font-black uppercase text-xs rounded-full hover:shadow-md transition-all"
                                    title="Usa l'AI per compilare questa sezione"
                                >
                                    {loadingSection === section.key ? (
                                        <AiThinkingGem size="small" inline text="Generando..." />
                                    ) : (
                                        <span className="material-symbols-outlined mr-1 text-base">auto_awesome</span>
                                    )}
                                    {loadingSection === section.key ? '' : 'Compila con AI'}
                                </button>
                            </div>
                            <TextArea
                                id={section.key}
                                label={section.label}
                                value={piano[section.key]}
                                onChange={e => handleChange(section.key, e.target.value)}
                                rows={5}
                                placeholder={section.placeholder}
                                containerClassName="shadow-inner !bg-surface-container-lowest"
                            />
                        </div>
                    ))}
                </div>
                <div className="dialog-footer bg-surface-container-high p-6 border-t border-outline-variant">
                    {existingPiano && (
                        <button type="button" onClick={handleDelete} className="button button-outlined-error mr-auto rounded-lg hover:shadow-md transition-all">
                            <span className="material-symbols-outlined mr-2">delete</span> Elimina Piano
                        </button>
                    )}
                    <button type="button" onClick={onClose} className="button button-text font-bold">Annulla</button>
                    <button type="submit" className="button button-filled shadow-xl font-black !px-10">Salva Piano</button>
                </div>
            </form>
        </div>
    );
};

export default PianoInclusioneEditor;
