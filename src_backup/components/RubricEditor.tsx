// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { Rubrica, Criterio, Indicatore, Competenza } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, TextField, TextArea, EmptyState, SectionHeader } from './ui';
import { useTheme } from '../theme/theme';

interface RubricEditorProps {
    rubricToEdit?: Rubrica;
    allCompetenze: Competenza[];
    onClose: () => void;
    onSave: (rubrica: Rubrica) => void;
}

const createEmptyRubric = (): Rubrica => ({
    id: `rubrica-${Date.now()}`,
    titolo: '',
    criteri: [],
});

const RubricEditor: React.FC<RubricEditorProps> = ({ rubricToEdit, allCompetenze, onClose, onSave }) => {
  const { layers } = useTheme();
    const [rubrica, setRubrica] = useState<Rubrica>(
        rubricToEdit ? { ...rubricToEdit } : createEmptyRubric()
    );

    const handleCompetenzaToggle = (competenza: Competenza) => {
        setRubrica(prev => {
            const isSelected = prev.criteri.some(c => c.competenzaId === competenza.id);
            let newCriteri: Criterio[];

            if (isSelected) {
                newCriteri = prev.criteri.filter(c => c.competenzaId !== competenza.id);
            } else {
                const newCriterion: Criterio = {
                    competenzaId: competenza.id,
                    indicatori: competenza.livelli.map(level => ({
                        livelloId: level.id,
                        descrizione: ''
                    }))
                };
                newCriteri = [...prev.criteri, newCriterion];
            }
            return { ...prev, criteri: newCriteri };
        });
    };

    const handleIndicatorChange = (competenzaId: string, livelloId: string, field: keyof Omit<Indicatore, 'livelloId'>, value: string) => {
        setRubrica(prev => {
            const newCriteri = prev.criteri.map(criterio => {
                if (criterio.competenzaId === competenzaId) {
                    const newIndicatori = criterio.indicatori.map(indicatore =>
                        indicatore.livelloId === livelloId
                            ? { ...indicatore, [field]: value }
                            : indicatore
                    );
                    return { ...criterio, indicatori: newIndicatori };
                }
                return criterio;
            });
            return { ...prev, criteri: newCriteri };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rubrica.titolo.trim()) { alert("Inserisci un titolo."); return; }
        if (rubrica.criteri.length === 0) { alert("Seleziona almeno un criterio."); return; }
        onSave(rubrica);
    };

    return (
        <M3Dialog
            title={rubricToEdit ? 'Modifica Rubrica' : 'Crea Nuova Rubrica'}
            onClose={onClose}
            maxWidth="2xl"
            mode="fullscreen"
        >
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <M3DialogContent style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]/30 }}>
                    <div style={{padding: layers.ref.spacing['6'], gap: layers.ref.spacing['8']}}>
                        <div >
                            <TextField 
                                label="Titolo della Rubrica"
                                value={rubrica.titolo} 
                                onChange={e => setRubrica({...rubrica, titolo: e.target.value})} 
                                placeholder="Es. Rubrica per Prova Orale di Storia"
                                required
                                style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)]/50 }}
                            />
                        </div>
                        
                        <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['8']}}>
                            {/* Sezione Selezione */}
                            <div  style={{gap: layers.ref.spacing['4']}}>
                                <SectionHeader title="Criteri di Competenza" icon="checklist" variant="primary" />
                                 <div style={{ borderRadius: ref.shape[] }} style={{border: "1px solid layers.sys.colors.outline", padding: layers.ref.spacing['8']}}>
                                    {allCompetenze.map(comp => (
                                         <div key={comp.id}  style={{width: "100%", marginBottom: layers.ref.spacing['4']}}>
                                            <input
                                                type="checkbox"
                                                id={`comp-check-${comp.id}`}
                                                checked={rubrica.criteri.some(c => c.competenzaId === comp.id)}
                                                onChange={() => handleCompetenzaToggle(comp)}
                                            />
                                            <label htmlFor={`comp-check-${comp.id}`} className={`chip w-full justify-start !h-12 !rounded-[var(--md-sys-shape-corner-large)] ${rubrica.criteri.some(c => c.competenzaId === comp.id) ? 'chip-selected' : ''}`}>
                                                {rubrica.criteri.some(c => c.competenzaId === comp.id) && <span  style={{ fontSize: "1.125rem" }}>check</span>}
                                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: "bold", fontSize: "0.75rem" }}>{comp.nome}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sezione Descrittori */}
                            <div  style={{gap: layers.ref.spacing['6']}}>
                                 <SectionHeader title="Definizione Descrittori" icon="edit_note" variant="secondary" />
                                 {rubrica.criteri.length > 0 ? rubrica.criteri.map(criterio => {
                                    const competenza = allCompetenze.find(c => c.id === criterio.competenzaId);
                                    if (!competenza) return null;
                                    return (
                                        <InfoCard key={competenza.id} variant="elevated" style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]/50 }} style={{padding: layers.ref.spacing['6'], gap: layers.ref.spacing['6'], border: "1px solid layers.sys.colors.outline"}}>
                                            <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6'], marginBottom: layers.ref.spacing['8']}}>
                                                <div style={{ borderRadius: ref.shape[], backgroundColor: sys.colors.secondary/10 }} style={{width: "2.5rem", height: "2.5rem", color: "layers.sys.colors.secondary", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "0.875rem"}}>{competenza.codice.charAt(0)}</div>
                                                <h4 style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{ fontWeight: "900" }}>{competenza.nome}</h4>
                                            </div>
                                            
                                            <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['8']}}>
                                                {competenza.livelli.map(level => {
                                                    const indicatore = criterio.indicatori.find(ind => ind.livelloId === level.id);
                                                    return (
                                                        <div key={level.id} style={{gap: layers.ref.spacing['2']}}>
                                                            <TextArea 
                                                                label={`Livello: ${level.nome}`} 
                                                                value={indicatore?.descrizione || ''} 
                                                                onChange={e => handleIndicatorChange(competenza.id, level.id, 'descrizione', e.target.value)}
                                                                placeholder="Descrivi la padronanza..."
                                                                rows={2}
                                                                containerClassName="!bg-[var(--md-sys-color-surface-container-high)]/50 shadow-sm"
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </InfoCard>
                                    )
                                 }) : (
                                    <EmptyState title="Nessun criterio" description="Seleziona le competenze dalla lista a sinistra." icon="checklist" />
                                 )}
                            </div>
                        </div>
                    </div>
                </M3DialogContent>
                <M3DialogActions>
                    <M3Button onClick={onClose} variant="text" style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Annulla</M3Button>
                    <M3Button onClick={handleSubmit} variant="filled"  style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Salva Rubrica</M3Button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default RubricEditor;



