
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
            <M3DialogContent className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl relative overflow-hidden">
                {/* Aura Ornaments */}
                <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-primary/5 blur-[100px] pointer-events-none" style={{ borderRadius: "9999px" }} />
                <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-secondary/5 blur-[100px] pointer-events-none" style={{ borderRadius: "9999px" }} />

                <div className="relative z-10" style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-6)", paddingTop: "var(--md-sys-spacing-4)", paddingBottom: "var(--md-sys-spacing-4)" }}>
                    <div className="bg-[var(--md-sys-color-surface-container-low)]est/40 backdrop-blur-md rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)]/20 gap-5 shadow-[var(--md-sys-elevation-level2)] animate-in slide-in-from-top-4 duration-500" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)", display: "flex", alignItems: "center" }}>
                        <div className="rounded-[var(--md-sys-shape-corner-medium)] text-on-primary-container shadow-[var(--md-sys-elevation-level1)] rotate-3" style={{ width: "4rem", height: "4rem", backgroundColor: "var(--md-sys-color-primary-container)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span className="material-symbols-outlined text-3xl">{getTestTypeIcon(prova.tipo)}</span>
                        </div>
                        <div style={{ flexGrow: "1" }}>
                            <p className="m3-label-large text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "var(--md-sys-spacing-8)", opacity: "0.6" }}>
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
                        <div className="mb-5" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)" }}>
                            <div className="bg-primary/10" style={{ width: "2rem", height: "2rem", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-primary)", fontSize: "1.125rem" }}>verified</span>
                            </div>
                            <h3 className="m3-title-medium" style={{ fontWeight: "900", letterSpacing: "-0.005em" }}>Competenze Valutate</h3>
                        </div>

                        {relevantCompetencies.length > 0 ? (
                            <div className="max-h-[50vh] pr-2 custom-scrollbar" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-8)", overflowY: "auto" }}>
                                {relevantCompetencies.map((competenza, idx) => (
                                    <div 
                                        key={competenza.id} 
                                        className="rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)]/20 bg-[var(--md-sys-color-surface-container-low)]est/30 hover:bg-[var(--md-sys-color-surface-container-high)]/40 duration-300 group animate-in slide-in-from-bottom-4" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <h4 className="m3-label-large tracking-[0.15em]" style={{ textTransform: "uppercase", color: "var(--md-sys-color-primary)", marginBottom: "var(--md-sys-spacing-8)", fontWeight: "900", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            {competenza.nome}
                                            {selectedLevels[competenza.id] && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedLevels(prev => {
                                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                        const { [competenza.id]: _removed, ...rest } = prev;
                                                        return rest;
                                                    })}
                                                    className="text-[10px] bg-error/10 px-3 py-1 hover:bg-error hover:text-on-error" style={{ color: "var(--md-sys-color-error)", borderRadius: "9999px", fontWeight: "900", transition: "color 300ms" }}
                                                >
                                                    RIMUOVI
                                                </button>
                                            )}
                                        </h4>
                                        <div style={{ gap: "var(--md-sys-spacing-3)" }}>
                                            {competenza.livelli.map(level => {
                                                const isSelected = selectedLevels[competenza.id] === level.id;
                                                return (
                                                    <label
                                                        key={level.id}
                                                        className={`flex items-start cursor-pointer p-8 rounded-[var(--md-sys-shape-corner-large)] transition-all border-2 ${isSelected ? 'bg-primary-container/80 text-on-primary-container border-primary/30 shadow-[var(--md-sys-elevation-level1)] scale-[1.02]' : 'bg-[var(--md-sys-color-surface-container-low)]est/50 border-transparent hover:border-[var(--md-sys-color-outline-variant)]/30 hover:bg-[var(--md-sys-color-surface-container-high)]/50'}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`competenza-${competenza.id}`}
                                                            value={level.id}
                                                            checked={isSelected}
                                                            onChange={() => handleLevelChange(competenza.id, level.id)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-5 h-5 rounded-full border-2 mt-4 mr-4 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'border-primary bg-primary' : 'border-[var(--md-sys-color-outline-variant)] group-hover:border-primary/50'}`}>
                                                            {isSelected && <div className="bg-on-primary" style={{ width: "0.5rem", height: "0.5rem", borderRadius: "9999px" }} />}
                                                        </div>
                                                        <div>
                                                            <span className={`text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] font-black block ${isSelected ? 'text-on-primary-container' : 'text-[var(--md-sys-color-on-surface)]'}`}>{level.nome}</span>
                                                            <p className={`m3-body-small text-xs mt-4 leading-relaxed ${isSelected ? 'text-on-primary-container opacity-80' : 'text-[var(--md-sys-color-on-surface)]-variant opacity-70'}`}>{level.descrizione}</p>
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
            <M3DialogActions className="bg-[var(--md-sys-color-surface-container-low)]/50 backdrop-blur-xl border-[var(--md-sys-color-outline-variant)]/10" style={{ borderTop: "1px solid var(--md-sys-color-outline)" }}>
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button onClick={handleSubmit} variant="primary" icon="save">Salva Valutazione</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default UnifiedEvaluationModal;


