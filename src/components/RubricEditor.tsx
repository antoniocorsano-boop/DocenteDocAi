import React, { useState } from 'react';
import { Rubrica, Criterio, Indicatore, Competenza } from '../types';
import { TextField, TextArea, EmptyState } from './M3Components';

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
        <div className="dialog-backdrop">
            <form onSubmit={handleSubmit} className="dialog-container w-full max-w-6xl h-[90vh] flex flex-col">
                <div className="dialog-header border-b border-outline-variant flex-shrink-0">
                    <h2 className="m3-headline-medium font-black">{rubricToEdit ? 'Modifica Rubrica' : 'Crea Nuova Rubrica'}</h2>
                    <button type="button" onClick={onClose} className="icon-button">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="dialog-content overflow-y-auto p-6">
                    <div className="mb-10">
                        <TextField 
                            label="Titolo della Rubrica"
                            value={rubrica.titolo} 
                            onChange={e => setRubrica({...rubrica, titolo: e.target.value})} 
                            placeholder="Es. Rubrica per Prova Orale di Storia"
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sezione Selezione */}
                        <div className="lg:col-span-1 space-y-4">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary px-2">Criteri di Competenza</h3>
                             <div className="selection-container large !bg-surface-container-low">
                                {allCompetenze.map(comp => (
                                     <div key={comp.id} className="chip-checkbox w-full">
                                        <input
                                            type="checkbox"
                                            id={`comp-check-${comp.id}`}
                                            checked={rubrica.criteri.some(c => c.competenzaId === comp.id)}
                                            onChange={() => handleCompetenzaToggle(comp)}
                                        />
                                        <label htmlFor={`comp-check-${comp.id}`} className={`chip w-full justify-start !h-12 ${rubrica.criteri.some(c => c.competenzaId === comp.id) ? 'chip-selected' : ''}`}>
                                            {rubrica.criteri.some(c => c.competenzaId === comp.id) && <span className="material-symbols-outlined text-lg">check</span>}
                                            <span className="truncate font-bold text-xs">{comp.nome}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sezione Descrittori */}
                        <div className="lg:col-span-3 space-y-6">
                             <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary px-2">Definizione Descrittori per Livello</h3>
                             {rubrica.criteri.length > 0 ? rubrica.criteri.map(criterio => {
                                const competenza = allCompetenze.find(c => c.id === criterio.competenzaId);
                                if (!competenza) return null;
                                return (
                                    <div key={competenza.id} className="p-6 rounded-[32px] bg-surface-container border border-outline-variant space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-black text-xs">{competenza.codice.charAt(0)}</div>
                                            <h4 className="m3-title-large font-black text-on-surface">{competenza.nome}</h4>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                            containerClassName="!bg-surface shadow-sm"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                             }) : (
                                <EmptyState title="Nessun criterio" description="Seleziona le competenze dalla lista a sinistra." icon="checklist" />
                             )}
                        </div>
                    </div>
                </div>
                <div className="dialog-footer border-t border-outline-variant">
                    <button type="button" onClick={onClose} className="button button-text">Annulla</button>
                    <button type="submit" className="button button-filled shadow-lg">Salva Rubrica</button>
                </div>
            </form>
        </div>
    );
};

export default RubricEditor;
