// LEGACY - MD3 Non-compliant

import React, { useState, useMemo } from 'react';
import type { Studente, Prova, Valutazione, ValutazioneCompetenza, TimetableSettings } from '../types';
import { RATING_OPTIONS } from '../constants';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, SelectField, InfoCard } from './ui';
import { useTheme } from '../theme/theme';

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
  const { layers } = useTheme();
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
            <M3DialogContent style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]/30 }}>
                {/* Aura Ornaments */}
                <div style={{ backgroundColor: sys.colors.primary/5 }} style={{ borderRadius: ref.spacing[9999] }} />
                <div style={{ backgroundColor: sys.colors.secondary/5 }} style={{ borderRadius: ref.spacing[9999] }} />

                <div  style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['6'], paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4']}}>
                    <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]est/40, borderRadius: ref.shape[] }} style={{padding: layers.ref.spacing['6'], border: "1px solid layers.sys.colors.outline", display: "flex", alignItems: "center"}}>
                        <div style={{ borderRadius: ref.shape[], color: sys.colors.on-primary-container }} style={{width: ref.spacing[64], height: ref.spacing[64], backgroundColor: "layers.sys.colors.primary-container", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <span style={{ color: sys.colors.3xl }}>{getTestTypeIcon(prova.tipo)}</span>
                        </div>
                        <div style={{ flexGrow: "1" }}>
                            <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: layers.ref.spacing['8'], opacity: "0.6"}}>
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
                        <div  style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6'], paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4']}}>
                            <div style={{ backgroundColor: sys.colors.primary/10 }} style={{ width: ref.spacing[32], height: ref.spacing[32], borderRadius: ref.spacing[9999], display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span  style={{color: "layers.sys.colors.primary", fontSize: "1.125rem"}}>verified</span>
                            </div>
                            <h3  style={{ fontWeight: "900", letterSpacing: "-0.005em" }}>Competenze Valutate</h3>
                        </div>

                        {relevantCompetencies.length > 0 ? (
                            <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['8'], overflowY: "auto"}}>
                                {relevantCompetencies.map((competenza, idx) => (
                                    <div 
                                        key={competenza.id} 
                                        style={{ borderRadius: ref.shape[], backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]est/30 }} style={{padding: layers.ref.spacing['6'], border: "1px solid layers.sys.colors.outline", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", animationDelay: `${idx * 100}ms` }}
                                    >
                                        <h4  style={{textTransform: "uppercase", color: "layers.sys.colors.primary", marginBottom: layers.ref.spacing['8'], fontWeight: "900", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                            {competenza.nome}
                                            {selectedLevels[competenza.id] && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedLevels(prev => {
                                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                        const { [competenza.id]: _removed, ...rest } = prev;
                                                        return rest;
                                                    })}
                                                    style={{ color: sys.colors.[10px], backgroundColor: sys.colors.error/10 }} style={{color: "layers.sys.colors.error", borderRadius: ref.spacing[9999], fontWeight: "900", transition: "color 300ms"}}
                                                >
                                                    RIMUOVI
                                                </button>
                                            )}
                                        </h4>
                                        <div style={{gap: layers.ref.spacing['3']}}>
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
                                                            
                                                        />
                                                        <div className={`w-5 h-5 rounded-full border-2 mt-4 mr-4 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'border-primary bg-primary' : 'border-[var(--md-sys-color-outline-variant)] group-hover:border-primary/50'}`}>
                                                            {isSelected && <div style={{ backgroundColor: sys.colors.on-primary }} style={{ width: "0.5rem", height: "0.5rem", borderRadius: ref.spacing[9999] }} />}
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
            <M3DialogActions style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]/50 }} style={{borderTop: "1px solid layers.sys.colors.outline"}}>
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button onClick={handleSubmit} variant="primary" icon="save">Salva Valutazione</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default UnifiedEvaluationModal;



