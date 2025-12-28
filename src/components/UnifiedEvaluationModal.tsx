
import { useState, useMemo } from 'react';
import type { Studente, Prova, Valutazione, ValutazioneCompetenza, TimetableSettings } from '../types';
import { RATING_OPTIONS } from '../constants';
import { M3Dialog, SelectField } from './M3Components';

interface UnifiedEvaluationModalProps {
    student: Studente;
    prova: Prova;
    settings: TimetableSettings;
    existingGrade: Valutazione | undefined;
    existingCompetencyEvals: ValutazioneCompetenza[];
    onClose: () => void;
    onSave: (data: {
        grade: string;
        competencyEvals: Record<string, string>; // competenzaId -> livelloId
    }) => void;
}

const getTestTypeIcon = (tipo: string) => {
    switch (tipo) {
        case 'Scritto': return 'edit_note';
        case 'Orale': return 'record_voice_over';
        case 'Pratico': return 'build';
        case 'Test': return 'quiz';
        default: return 'assignment';
    }
};

const UnifiedEvaluationModal: React.FC<UnifiedEvaluationModalProps> = ({
    student,
    prova,
    settings,
    existingGrade,
    existingCompetencyEvals,
    onClose,
    onSave,
}) => {
    const [grade, setGrade] = useState(existingGrade?.voto || '');
    const [selectedLevels, setSelectedLevels] = useState<Record<string, string>>(() => {
        return existingCompetencyEvals.reduce((acc, curr) => {
            acc[curr.competenzaId] = curr.livelloId;
            return acc;
        }, {} as Record<string, string>);
    });

    const relevantCompetencies = useMemo(() => {
        return settings.competenze.filter(c =>
            !c.disciplines || c.disciplines.length === 0 || c.disciplines.includes(prova.materia)
        );
    }, [settings.competenze, prova.materia]);

    const handleLevelChange = (competenzaId: string, livelloId: string) => {
        setSelectedLevels(prev => ({
            ...prev,
            [competenzaId]: livelloId
        }));
    };

    const handleSubmit = () => {
        onSave({ grade, competencyEvals: selectedLevels });
    };

    return (
        <M3Dialog
            isOpen={true}
            onClose={onClose}
            title={`Valutazione ${prova.tipo}`}
            headline={`${student.cognome} ${student.nome} - ${prova.materia}`}
            buttons={
                <>
                    <button type="button" onClick={onClose} className="button button-text">Annulla</button>
                    <button type="button" onClick={handleSubmit} className="button button-filled">Salva Valutazione</button>
                </>
            }
            fullscreen={false}
        >
            <div className="flex flex-col gap-6 pt-2">
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-2xl">{getTestTypeIcon(prova.tipo)}</span>
                    </div>
                    <div className="flex-grow">
                        <SelectField
                            id="grade-select"
                            label="Voto Numerico"
                            value={grade}
                            onChange={e => setGrade(e.target.value)}
                            containerClassName="!mb-0 w-full max-w-[150px]"
                        >
                            <option value="">Nessun Voto</option>
                            {RATING_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </SelectField>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <span className="material-symbols-outlined text-primary">verified</span>
                        <h3 className="m3-title-medium font-bold">Competenze Valutate</h3>
                    </div>

                    {relevantCompetencies.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                            {relevantCompetencies.map(competenza => (
                                <div key={competenza.id} className="p-5 border rounded-[20px] border-outline-variant/30 bg-surface-container/50 hover:bg-surface-container-high/50 transition-colors">
                                    <h4 className="m3-label-large uppercase tracking-wide text-primary mb-3 font-bold flex justify-between items-center">
                                        {competenza.nome}
                                        {selectedLevels[competenza.id] && (
                                            <button
                                                type="button"
                                                onClick={() => setSelectedLevels(prev => {
                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                    const { [competenza.id]: _removed, ...rest } = prev;
                                                    return rest;
                                                })}
                                                className="text-xs text-error font-medium hover:underline opacity-80"
                                            >
                                                Rimuovi
                                            </button>
                                        )}
                                    </h4>
                                    <div className="space-y-2">
                                        {competenza.livelli.map(level => {
                                            const isSelected = selectedLevels[competenza.id] === level.id;
                                            return (
                                                <label
                                                    key={level.id}
                                                    className={`flex items-start cursor-pointer p-3 rounded-xl transition-all border border-transparent ${isSelected ? 'bg-primary-container text-on-primary-container border-primary/20 shadow-sm' : 'hover:bg-surface-container-highest'}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`competenza-${competenza.id}`}
                                                        value={level.id}
                                                        checked={isSelected}
                                                        onChange={() => handleLevelChange(competenza.id, level.id)}
                                                        className="sr-only"
                                                    />
                                                    <div className={`w-4 h-4 rounded-full border-2 mt-1 mr-3 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-outline'}`}>
                                                        {isSelected && <div className="w-1.5 h-1.5 bg-on-primary rounded-full" />}
                                                    </div>
                                                    <div>
                                                        <span className={`m3-body-medium font-bold block ${isSelected ? 'text-on-primary-container' : 'text-on-surface'}`}>{level.nome}</span>
                                                        <p className={`m3-body-small text-xs mt-0.5 ${isSelected ? 'text-on-primary-container opacity-80' : 'text-on-surface-variant opacity-70'}`}>{level.descrizione}</p>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 bg-surface-container-low/30 rounded-2xl border border-dashed border-outline-variant/50">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-20 mb-2">playlist_remove</span>
                            <p className="m3-body-medium text-on-surface-variant italic text-center opacity-60">Nessuna competenza associata alla materia "{prova.materia}".</p>
                        </div>
                    )}
                </div>
            </div>
        </M3Dialog>
    );
};

export default UnifiedEvaluationModal;
