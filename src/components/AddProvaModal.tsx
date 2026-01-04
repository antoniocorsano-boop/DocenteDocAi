
import React, { useState } from 'react';
import { Valutazione } from '../types';
import { EVALUATION_TYPES } from '../constants';
import { M3ChoiceCard, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, SelectField } from './ui';

interface AddProvaModalProps {
    disciplines: string[];
    onClose: () => void;
    onSave: (prova: Omit<Valutazione, 'id' | 'studenteId' | 'voto'>) => void;
}

const getTestTypeIcon = (tipo: string) => {
    switch (tipo) {
        case 'Scritto': return 'edit_note';
        case 'Orale': return 'record_voice_over';
        case 'Pratico': return 'build';
        case 'Test': return 'quiz';
        case 'Verifica': return 'assignment_late';
        default: return 'assignment';
    }
};

const AddProvaModal: React.FC<AddProvaModalProps> = ({ disciplines, onClose, onSave }) => {
    const [materia, setMateria] = useState<string>((disciplines && disciplines[0]) || '');
    const [tipo, setTipo] = useState<Valutazione['tipo']>('Scritto');
    const [data, setData] = useState<string>(new Date().toISOString().split('T')[0]);
    const [argomento, setArgomento] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            materia,
            tipo,
            data,
            argomento
        });
        onClose();
    };

    return (
        <M3Dialog 
            onClose={onClose} 
            title="Aggiungi Prova di Valutazione" 
            level={1}
        >
            <form id="add-prova-form" onSubmit={handleSubmit}>
                <M3DialogContent className="space-y-6 bg-surface-container-high/30 backdrop-blur-sm">
                    <p className="m3-body-medium text-on-surface-variant">
                        Stai creando una nuova colonna nella griglia di valutazione per la classe selezionata.
                    </p>

                    <TextField
                        id="prova-argomento"
                        name="argomento"
                        label="Titolo / Argomento"
                        value={argomento}
                        onChange={e => setArgomento(e.target.value)}
                        placeholder="Es. 'Verifica sul Barocco'"
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            id="prova-data"
                            name="data"
                            label="Data"
                            type="date"
                            value={data}
                            onChange={e => setData(e.target.value)}
                            required
                        />
                        <SelectField
                            id="prova-materia"
                            name="materia"
                            label="Materia"
                            value={materia}
                            onChange={e => setMateria(e.target.value)}
                            required
                        >
                            {(disciplines || []).map(d => <option key={d} value={d}>{d}</option>)}
                        </SelectField>
                    </div>

                    <div>
                        <label className="text-[10px] text-primary font-extrabold uppercase tracking-[0.3em] px-5 text-left opacity-70 mb-2 block">Tipo Prova</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {EVALUATION_TYPES.map(t => (
                                <M3ChoiceCard
                                    key={t}
                                    icon={getTestTypeIcon(t)}
                                    label={t}
                                    onClick={() => setTipo(t)}
                                    selected={tipo === t}
                                    className="!min-w-[100px] !p-4"
                                />
                            ))}
                        </div>
                    </div>
                </M3DialogContent>
                <M3DialogActions>
                    <M3Button type="button" onClick={onClose} variant="text">Annulla</M3Button>
                    <M3Button type="submit" variant="filled">Crea Prova</M3Button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default AddProvaModal;
