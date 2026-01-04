
import React, { useState, useMemo } from 'react';
import type { Studente, Prova, Valutazione, ValutazioneCompetenza, TimetableSettings } from '../types';
import { RATING_OPTIONS } from '../constants';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, SelectField, InfoCard } from './ui';

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
            onClose={onClose}
            title={`Valutazione ${prova.tipo}`}
            maxWidth="sm"
            level={1}
        >
            <M3DialogContent className="bg-surface-container-low/30 backdrop-blur-xl relative overflow-hidden">
                {/* Aura Ornaments */}
                <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex flex-col gap-6 py-2 relative z-10">
                    <div className="bg-surface-container-lowest/40 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/20 flex items-center gap-5 shadow-lg animate-in slide-in-from-top-4 duration-500">
                        <div className="w-16 h-16 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-md rotate-3">
                            <span className="material-symbols-outlined text-3xl">{getTestTypeIcon(prova.tipo)}</span>
                        </div>
                        <div className="flex-grow">
                            <p className="m3-label-large text-on-surface-variant font-black uppercase tracking-widest mb-2 opacity-60">
                                {student.cognome} {student.nome} • {prova.materia}
                            </p>
                            <SelectField
                                label="Voto Numerico"
                                value={grade}
                                onChange={e => setGrade(e.target.value)}
                                options={[
                                    { value: '', label: 'Nessun Voto' },
                                    ...RATING_OPTIONS.map(o => ({ value: o, label: o }))
                                ]}
                                fullWidth
                            />
                        </div>
                    </div>

                    <div className="animate-in fade-in duration-700 delay-200">
                        <div className="flex items-center gap-3 mb-5 px-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-lg">verified</span>
                            </div>
                            <h3 className="m3-title-medium font-black tracking-tight">Competenze Valutate</h3>
                        </div>

                        {relevantCompetencies.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                {relevantCompetencies.map((competenza, idx) => (
                                    <div 
                                        key={competenza.id} 
                                        className="p-6 border rounded-2xl border-outline-variant/20 bg-surface-container-lowest/30 hover:bg-surface-container-high/40 transition-all duration-300 group animate-in slide-in-from-bottom-4"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <h4 className="m3-label-large uppercase tracking-[0.15em] text-primary mb-4 font-black flex justify-between items-center">
                                            {competenza.nome}
                                            {selectedLevels[competenza.id] && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedLevels(prev => {
                                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                        const { [competenza.id]: _removed, ...rest } = prev;
                                                        return rest;
                                                    })}
                                                    className="text-[10px] bg-error/10 text-error px-3 py-1 rounded-full font-black hover:bg-error hover:text-on-error transition-colors"
                                                >
                                                    RIMUOVI
                                                </button>
                                            )}
                                        </h4>
                                        <div className="space-y-3">
                                            {competenza.livelli.map(level => {
                                                const isSelected = selectedLevels[competenza.id] === level.id;
                                                return (
                                                    <label
                                                        key={level.id}
                                                        className={`flex items-start cursor-pointer p-4 rounded-2xl transition-all border-2 ${isSelected ? 'bg-primary-container/80 text-on-primary-container border-primary/30 shadow-md scale-[1.02]' : 'bg-surface-container-lowest/50 border-transparent hover:border-outline-variant/30 hover:bg-surface-container-high/50'}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`competenza-${competenza.id}`}
                                                            value={level.id}
                                                            checked={isSelected}
                                                            onChange={() => handleLevelChange(competenza.id, level.id)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-5 h-5 rounded-full border-2 mt-1 mr-4 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'border-primary bg-primary' : 'border-outline-variant group-hover:border-primary/50'}`}>
                                                            {isSelected && <div className="w-2 h-2 bg-on-primary rounded-full" />}
                                                        </div>
                                                        <div>
                                                            <span className={`m3-body-medium font-black block ${isSelected ? 'text-on-primary-container' : 'text-on-surface'}`}>{level.nome}</span>
                                                            <p className={`m3-body-small text-xs mt-1 leading-relaxed ${isSelected ? 'text-on-primary-container opacity-80' : 'text-on-surface-variant opacity-70'}`}>{level.descrizione}</p>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <InfoCard 
                                type="info" 
                                message={`Nessuna competenza associata alla materia "${prova.materia}".`} 
                            />
                        )}
                    </div>
                </div>
            </M3DialogContent>
            <M3DialogActions className="bg-surface-container-low/50 backdrop-blur-xl border-t border-outline-variant/10">
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button onClick={handleSubmit} variant="primary" icon="save">Salva Valutazione</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default UnifiedEvaluationModal;
