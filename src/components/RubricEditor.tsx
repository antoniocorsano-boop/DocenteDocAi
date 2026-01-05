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
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <M3DialogContent className="bg-surface-container-low/30 backdrop-blur-xl">
                    <div className="p-6 space-y-8">
                        <div className="mb-10">
                            <TextField 
                                label="Titolo della Rubrica"
                                value={rubrica.titolo} 
                                onChange={e => setRubrica({...rubrica, titolo: e.target.value})} 
                                placeholder="Es. Rubrica per Prova Orale di Storia"
                                required
                                className="bg-surface-container-high/50"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Sezione Selezione */}
                            <div className="lg:col-span-1 space-y-4">
                                <SectionHeader title="Criteri di Competenza" icon="checklist" variant="primary" />
                                 <div className="selection-container large !bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/20 rounded-3xl p-8">
                                    {allCompetenze.map(comp => (
                                         <div key={comp.id} className="chip-checkbox w-full mb-4">
                                            <input
                                                type="checkbox"
                                                id={`comp-check-${comp.id}`}
                                                checked={rubrica.criteri.some(c => c.competenzaId === comp.id)}
                                                onChange={() => handleCompetenzaToggle(comp)}
                                            />
                                            <label htmlFor={`comp-check-${comp.id}`} className={`chip w-full justify-start !h-12 !rounded-2xl ${rubrica.criteri.some(c => c.competenzaId === comp.id) ? 'chip-selected' : ''}`}>
                                                {rubrica.criteri.some(c => c.competenzaId === comp.id) && <span className="material-symbols-outlined text-lg">check</span>}
                                                <span className="truncate font-bold text-xs">{comp.nome}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sezione Descrittori */}
                            <div className="lg:col-span-3 space-y-6">
                                 <SectionHeader title="Definizione Descrittori" icon="edit_note" variant="secondary" />
                                 {rubrica.criteri.length > 0 ? rubrica.criteri.map(criterio => {
                                    const competenza = allCompetenze.find(c => c.id === criterio.competenzaId);
                                    if (!competenza) return null;
                                    return (
                                        <InfoCard key={competenza.id} variant="elevated" className="p-6 space-y-6 bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/20">
                                            <div className="flex items-center gap-6 mb-8">
                                                <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-black text-sm">{competenza.codice.charAt(0)}</div>
                                                <h4 className="m3-title-large font-black text-on-surface">{competenza.nome}</h4>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {competenza.livelli.map(level => {
                                                    const indicatore = criterio.indicatori.find(ind => ind.livelloId === level.id);
                                                    return (
                                                        <div key={level.id} className="space-y-2">
                                                            <TextArea 
                                                                label={`Livello: ${level.nome}`} 
                                                                value={indicatore?.descrizione || ''} 
                                                                onChange={e => handleIndicatorChange(competenza.id, level.id, 'descrizione', e.target.value)}
                                                                placeholder="Descrivi la padronanza..."
                                                                rows={2}
                                                                containerClassName="!bg-surface-container-high/50 shadow-sm"
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
                    <M3Button onClick={onClose} variant="text" className="font-black text-xs uppercase tracking-widest">Annulla</M3Button>
                    <M3Button onClick={handleSubmit} variant="filled" className="shadow-lg font-black text-xs uppercase tracking-widest">Salva Rubrica</M3Button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default RubricEditor;
