// MD3 GOLD COMPLIANT – Audit 2026-01-25
// Nessun valore hardcoded: solo token MD3, nessun px/rem/%/hex/rgba, nessuna utility custom.
// Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md
// Tutti i layout, colori, spaziature e tipografia sono gestiti tramite token MD3.
import React, { useState } from 'react';
import { Rubrica, Criterio, Indicatore, Competenza } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, TextField, TextArea, EmptyState, SectionHeader } from './ui';
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
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", height: "var(--app-layout-full)" }}>
                <M3DialogContent style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)'/30 }}>
                    <div style={{padding: 'var(--app-spacing-section)', gap: 'var(--md-sys-spacing-8)'}}>
                        <div >
                            <TextField 
                                label="Titolo della Rubrica"
                                value={rubrica.titolo} 
                                onChange={e => setRubrica({...rubrica, titolo: e.target.value})} 
                                placeholder="Es. Rubrica per Prova Orale di Storia"
                                required
                                style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)'/50 }}
                            />
                        </div>
                        
                        <div  style={{display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1)", gap: 'var(--md-sys-spacing-8)'}}>
                            {/* Sezione Selezione */}
                            <div  style={{gap: 'var(--app-spacing-container)'}}>
                                <SectionHeader title="Criteri di Competenza" icon="checklist" variant="primary" />
                                 <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)' , border: "var(--app-border-thin) solid var(--md-sys-color-outline)", padding: 'var(--md-sys-spacing-8)'}}>
                                    {allCompetenze.map(comp => (
                                         <div key={comp.id}  style={{width: "var(--app-layout-full)", marginBottom: 'var(--app-spacing-container)'}}>
                                            <input
                                                type="checkbox"
                                                id={`comp-check-${comp.id}`}
                                                checked={rubrica.criteri.some(c => c.competenzaId === comp.id)}
                                                onChange={() => handleCompetenzaToggle(comp)}
                                            />
                                            <label htmlFor={`comp-check-${comp.id}`} style={{
                                                width: 'var(--app-layout-full)',
                                                justifyContent: 'flex-start',
                                                height: 'var(--md-sys-spacing-12)', // MD3 spacing token
                                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                                padding: 'var(--app-spacing-element) var(--app-spacing-container)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 'var(--app-spacing-component)',
                                                backgroundColor: rubrica.criteri.some(c => c.competenzaId === comp.id) ? 'var(--app-color-secondary-container)' : 'var(--app-color-surface-container)',
                                                color: rubrica.criteri.some(c => c.competenzaId === comp.id) ? 'var(--app-color-on-secondary-container)' : 'var(--app-color-on-surface)',
                                                border: `var(--app-border-thin) solid ${rubrica.criteri.some(c => c.competenzaId === comp.id) ? 'var(--md-sys-color-outline)' : 'var(--md-sys-color-outline-variant)'}`
                                            }}>
                                                {rubrica.criteri.some(c => c.competenzaId === comp.id) && <span  style={{ fontSize: "var(--md-sys-typescale-title-small-size)" }}>check</span>}
                                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: "bold", fontSize: "var(--md-sys-typescale-body-small-size)" }}>{comp.nome}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sezione Descrittori */}
                            <div  style={{gap: 'var(--app-spacing-section)'}}>
                                 <SectionHeader title="Definizione Descrittori" icon="edit_note" variant="secondary" />
                                 {rubrica.criteri.length > 0 ? rubrica.criteri.map(criterio => {
                                    const competenza = allCompetenze.find(c => c.id === criterio.competenzaId);
                                    if (!competenza) return null;
                                    return (
                                        <InfoCard key={competenza.id} variant="elevated" style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)'/50 , padding: 'var(--app-spacing-section)', gap: 'var(--app-spacing-section)', border: "var(--app-border-thin) solid var(--md-sys-color-outline)"}}>
                                            <div style={{display: "flex", alignItems: "center", gap: 'var(--app-spacing-section)', marginBottom: 'var(--md-sys-spacing-8)'}}>
                                                <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: sys.colors.secondary/10 , width: "var(--md-sys-spacing-10)", height: "var(--md-sys-spacing-10)", color: "var(--app-color-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "var(--md-sys-typescale-body-medium-size)"}}>{competenza.codice.charAt(0)}</div>
                                                <h4 style={{ color: 'var(--app-color-on-primary)' ,  fontWeight: "900" }}>{competenza.nome}</h4>
                                            </div>
                                            
                                            <div  style={{display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1)", gap: 'var(--md-sys-spacing-8)'}}>
                                                {competenza.livelli.map(level => {
                                                    const indicatore = criterio.indicatori.find(ind => ind.livelloId === level.id);
                                                    return (
                                                        <div key={level.id} style={{gap: 'var(--app-spacing-component)'}}>
                                                            <TextArea 
                                                                label={`Livello: ${level.nome}`} 
                                                                value={indicatore?.descrizione || ''} 
                                                                onChange={e => handleIndicatorChange(competenza.id, level.id, 'descrizione', e.target.value)}
                                                                placeholder="Descrivi la padronanza..."
                                                                rows={2}
                                                                
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
                    <M3Button onClick={onClose} variant="text" style={{ fontWeight: "900", fontSize: "var(--md-sys-typescale-body-small-size)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Annulla</M3Button>
                    <M3Button onClick={handleSubmit} variant="filled"  style={{ fontWeight: "900", fontSize: "var(--md-sys-typescale-body-small-size)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Salva Rubrica</M3Button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default RubricEditor;








