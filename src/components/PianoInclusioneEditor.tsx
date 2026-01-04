import React, { useState } from 'react';
import { PianoInclusione, PianoInclusioneEditorProps } from '../types';
import { getPIPSuggestion } from '../services/aiService';
import { 
    M3Dialog, 
    M3DialogContent, 
    M3DialogActions, 
    M3Button, 
    TextArea, 
    InfoCard,
    SectionHeader,
    AiThinkingGem 
} from './ui';

type SectionKey = 'puntiDiForza' | 'areeDiIntervento' | 'misureCompensative' | 'misureDispensative' | 'criteriValutazionePersonalizzati';

const createEmptyPiano = (studentId: string): PianoInclusione => ({
    id: studentId,
    puntiDiForza: '',
    areeDiIntervento: '',
    misureCompensative: '',
    misureDispensative: '',
    criteriValutazionePersonalizzati: '',
    obiettiviPerMateria: {},
});

const PianoInclusioneEditor: React.FC<PianoInclusioneEditorProps> = ({ student, existingPiano, onClose, onSave, onDeletePiano, aiSettings, evaluations, competencyEvaluations, settings, showToast }) => {
    const [piano, setPiano] = useState<PianoInclusione>(existingPiano || createEmptyPiano(student.id));
    const [loadingSection, setLoadingSection] = useState<string | null>(null);

    const handleChange = (field: SectionKey, value: string) => {
        setPiano(prev => ({ ...prev, [field]: value }));
    };

    const handleMateriaChange = (materia: string, value: string) => {
        setPiano(prev => ({
            ...prev,
            obiettiviPerMateria: {
                ...(prev.obiettiviPerMateria || {}),
                [materia]: value
            }
        }));
    };

    const handleGenerateText = async (section: string) => {
        setLoadingSection(section);
        try {
            const studentEvaluations = evaluations.filter(e => e.studenteId === student.id);
            const studentCompetencies = competencyEvaluations.filter(e => e.studenteId === student.id);
            
            const text = await getPIPSuggestion(
                aiSettings,
                student,
                studentEvaluations,
                studentCompetencies,
                settings.competenze,
                section
            );

            if (section.startsWith('obj-')) {
                const materia = section.replace('obj-', '');
                handleMateriaChange(materia, text);
            } else {
                handleChange(section as SectionKey, text);
            }
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
        <M3Dialog
            title="Piano di Inclusione"
            onClose={onClose}
            maxWidth="lg"
        >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <M3DialogContent className="bg-surface-container-high/30 backdrop-blur-sm p-6 space-y-8 overflow-y-auto">
                    {/* Subtitle */}
                    <div className="pb-4 border-b border-outline-variant/30">
                        <SectionHeader 
                            title={`${student.cognome} ${student.nome}`}
                            subtitle={`Classe ${student.classe} • Redazione Piano di Inclusione Personalizzato`}
                            variant="small"
                        />
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                        {sections.map(section => (
                            <InfoCard key={section.key} variant="elevated" className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                                        {section.label}
                                    </h3>
                                    <M3Button
                                        type="button"
                                        onClick={() => handleGenerateText(section.key)}
                                        disabled={loadingSection === section.key}
                                        variant="tonal"
                                        size="small"
                                        className="!rounded-full"
                                    >
                                        {loadingSection === section.key ? (
                                            <AiThinkingGem size="small" inline text="Generando..." />
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined mr-1 text-sm">auto_awesome</span>
                                                AI
                                            </>
                                        )}
                                    </M3Button>
                                </div>
                                <TextArea
                                    id={section.key}
                                    label=""
                                    value={piano[section.key]}
                                    onChange={e => handleChange(section.key, e.target.value)}
                                    rows={5}
                                    placeholder={section.placeholder}
                                    className="bg-surface-container-lowest/50"
                                />
                            </InfoCard>
                        ))}

                        {/* Obiettivi per Materia */}
                        <InfoCard variant="elevated" className="p-6 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-primary">subject</span>
                                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                                    Obiettivi per Materia (PEI/PDP)
                                </h3>
                            </div>
                            <p className="text-xs text-on-surface-variant mb-4">
                                Definire gli obiettivi minimi o differenziati per ciascuna disciplina, se previsto dal piano.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {settings.disciplines.map(materia => (
                                    <div key={materia} className="space-y-2 p-4 rounded-xl bg-surface-container-lowest/50 border border-outline-variant/30">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold text-primary flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px]">book</span>
                                                {materia}
                                            </label>
                                            <M3Button
                                                type="button"
                                                onClick={() => handleGenerateText(`obj-${materia}`)}
                                                disabled={loadingSection === `obj-${materia}`}
                                                variant="text"
                                                size="small"
                                                className="!min-w-0 !p-1"
                                            >
                                                {loadingSection === `obj-${materia}` ? (
                                                    <AiThinkingGem size="small" inline />
                                                ) : (
                                                    <span className="material-symbols-outlined text-sm text-primary/70 hover:text-primary">auto_awesome</span>
                                                )}
                                            </M3Button>
                                        </div>
                                        <TextArea
                                            id={`obj-${materia}`}
                                            label=""
                                            value={piano.obiettiviPerMateria?.[materia] || ''}
                                            onChange={e => handleMateriaChange(materia, e.target.value)}
                                            rows={3}
                                            placeholder={`Obiettivi per ${materia}...`}
                                            className="!bg-transparent"
                                        />
                                    </div>
                                ))}
                            </div>
                        </InfoCard>
                    </div>
                </M3DialogContent>

                {/* Actions */}
                <M3DialogActions className="bg-surface-container-high/80 backdrop-blur-md p-6 border-t border-outline-variant/30">
                    {existingPiano && (
                        <M3Button
                            type="button"
                            onClick={handleDelete}
                            variant="outlined"
                            className="mr-auto !text-error !border-error/30 hover:!bg-error/5"
                        >
                            <span className="material-symbols-outlined mr-2">delete</span>
                            Elimina
                        </M3Button>
                    )}
                    <M3Button
                        type="button"
                        onClick={onClose}
                        variant="text"
                    >
                        Annulla
                    </M3Button>
                    <M3Button
                        type="submit"
                        variant="filled"
                        className="!px-8"
                    >
                        Salva Piano
                    </M3Button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default PianoInclusioneEditor;
