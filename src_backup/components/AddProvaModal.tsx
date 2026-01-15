// LEGACY - MD3 Non-compliant

import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTheme } from '../hooks/useTheme';
import { Valutazione } from '../types';
import { EVALUATION_TYPES } from '../constants';
import { M3ChoiceCard, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, SelectField } from './ui';
import { useTheme } from '../theme/theme';

interface AddProvaModalProps {
    disciplines: string[];
    onClose: () => void;
    onSave: (prova: Omit<Valutazione, 'id' | 'studenteId' | 'voto'>) => void;
}

const getTestTypeIcon = (tipo: string) => {
  const { layers } = useTheme();
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
                <M3DialogContent style={{display: 'flex', flexDirection: 'column', gap: layers.ref.spacing['6']}}>
                    <p style={{fontFamily: 'var(--md-sys-typescale-body-medium-font-family)',
                        fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                        fontWeight: 'var(--md-sys-typescale-body-medium-font-weight)',
                        lineHeight: 'var(--md-sys-typescale-body-medium-line-height)',
                        letterSpacing: 'var(--md-sys-typescale-body-medium-letter-spacing)',
                        color: 'layers.sys.colors.on-surface-variant'}}>
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

                    <div style={{display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: layers.ref.spacing['8']}}>
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
                        <label style={{fontFamily: 'var(--md-sys-typescale-label-small-font-family)',
                            fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                            lineHeight: 'var(--md-sys-typescale-label-small-line-height)',
                            color: 'layers.sys.colors.primary',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3em',
                            paddingLeft: layers.ref.spacing['5'],
                            paddingRight: layers.ref.spacing['5'],
                            textAlign: 'left',
                            opacity: 0.7,
                            marginBottom: layers.ref.spacing['8'],
                            display: 'block'}}>Tipo Prova</label>
                        <div style={{display: 'flex',
                            gap: layers.ref.spacing['8'],
                            overflowX: 'auto',
                            paddingBottom: layers.ref.spacing['2']}}>
                            {EVALUATION_TYPES.map(t => (
                                <M3ChoiceCard
                                    key={t}
                                    icon={getTestTypeIcon(t)}
                                    label={t}
                                    onClick={() => setTipo(t)}
                                    selected={tipo === t}
                                    
                                />
                            ))}
                        </div>
                    </div>
                </M3DialogContent>
                <M3DialogActions>
                    <M3Button type="button" onClick={onClose} variant="text">Annulla</M3Button>
                    <M3Button type="submit" variant="primary">Crea Prova</M3Button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default AddProvaModal;



