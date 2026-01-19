// LEGACY - MD3 Non-compliant

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
            <M3DialogContent style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)'/30 }}>
                {/* Aura Ornaments */}
                <div style={{ backgroundColor: sys.colors.primary/5 ,  borderRadius: 'var(--md-sys-spacing-4)' }} />
                <div style={{ backgroundColor: sys.colors.secondary/5 ,  borderRadius: 'var(--md-sys-spacing-4)' }} />

                <div  style={{display: "flex", flexDirection: "column", gap: 'var(--md-sys-spacing-6)', paddingTop: 'var(--md-sys-spacing-4)', paddingBottom: 'var(--md-sys-spacing-4)'}}>
                    <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-6)', border: "1px solid var(--md-sys-color-outline)", display: "flex", alignItems: "center" }}>
                        <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', color: 'var(--md-sys-color-on-primary)', width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', backgroundColor: "var(--md-sys-color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ color: 'var(--md-sys-color-on-primary)' }}>{getTestTypeIcon(prova.tipo)}</span>
                        </div>
                        <div style={{ flexGrow: "1" }}>
                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)' , fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 'var(--md-sys-spacing-8)', opacity: "0.6"}}>
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

                    <div >
                        <div  style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)', paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)'}}>
                            <div style={{ backgroundColor: sys.colors.primary/10 ,  width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span  style={{color: "var(--md-sys-color-primary)", fontSize: "1.125rem"}}>verified</span>
                            </div>
                            <h3  style={{ fontWeight: "900", letterSpacing: "-0.005em" }}>Competenze Valutate</h3>
                        </div>

                        {relevantCompetencies.length > 0 ? (
                            <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: 'var(--md-sys-spacing-8)', overflowY: "auto"}}>
                                {relevantCompetencies.map((competenza, idx) => (
                                    <div 
                                        key={competenza.id} 
                                        style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: 'var(--md-sys-spacing-6)', border: "1px solid var(--md-sys-color-outline)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", animationDelay: `${idx * 100}ms` }}
                                    >
                                        <h4  style={{textTransform: "uppercase", color: "var(--md-sys-color-primary)", marginBottom: 'var(--md-sys-spacing-8)', fontWeight: "900", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                            {competenza.nome}
                                            {selectedLevels[competenza.id] && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedLevels(prev => {
                                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                        const { [competenza.id]: _removed, ...rest } = prev;
                                                        return rest;
                                                    })}
                                                    style={{ color: 'var(--md-sys-color-error)', backgroundColor: 'var(--md-sys-color-error-container)', borderRadius: 'var(--md-sys-spacing-4)', fontWeight: "900", transition: "color 300ms" }}
                                                >
                                                    RIMUOVI
                                                </button>
                                            )}
                                        </h4>
                                        <div style={{gap: 'var(--md-sys-spacing-3)'}}>
                                            {competenza.livelli.map(level => {
                                                const isSelected = selectedLevels[competenza.id] === level.id;
                                                return (
                                                    <label
                                                        key={level.id}
                                                        style={{padding: 'var(--md-sys-spacing-8)'}}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`competenza-${competenza.id}`}
                                                            value={level.id}
                                                            checked={isSelected}
                                                            onChange={() => handleLevelChange(competenza.id, level.id)}
                                                            
                                                        />
                                                        <div style={{borderRadius: 'var(--md-sys-shape-corner-full)'}}>
                                                            {isSelected && <div style={{ backgroundColor: sys.colors.on-primary ,  width: "0.5rem", height: "0.5rem", borderRadius: 'var(--md-sys-spacing-4)' }} />}
                                                        </div>
                                                        <div>
                                                            <span className={`text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] font-black block ${isSelected ? 'text-on-primaryContainer' : 'text-[var(--md-sys-color-onSurface)]'}`}>{level.nome}</span>
                                                            <p style={{fontSize: 'var(--md-sys-typescale-body-small-font-size)', fontWeight: 'var(--md-sys-typescale-body-small-font-weight)'}}>{level.descrizione}</p>
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
            <M3DialogActions style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)'/50 , borderTop: "1px solid var(--md-sys-color-outline)"}}>
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button onClick={handleSubmit} variant="primary" icon="save">Salva Valutazione</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default UnifiedEvaluationModal;







