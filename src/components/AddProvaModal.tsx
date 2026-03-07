// MD3 Compliant - Block G Migration (13 violations eliminated)

import React, { useState } from 'react';
import { Valutazione } from '../types';
import { EVALUATION_TYPES } from '../constants';
import { Button, Box, Typography } from '@mui/material';
import { M3Dialog, M3ChoiceCard as Card, TextField, SelectField } from './ui';
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
            buttons={
                <>
                    <Button type="button" onClick={onClose} variant="text">Annulla</Button>
                    <Button type="submit" form="add-prova-form" variant="contained">Crea Prova</Button>
                </>
            }
        >
            <Box id="add-prova-form" component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-6)' }}>
                <Typography variant="body2" component="p" sx={{
                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                    fontWeight: 'var(--md-sys-typescale-body-large-font-weight)',
                    lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
                    color: 'var(--md-sys-color-on-surface-variant)'
                }}>
                    Stai creando una nuova colonna nella griglia di valutazione per la classe selezionata.
                </Typography>

                <TextField
                    id="prova-argomento"
                    name="argomento"
                    label="Titolo / Argomento"
                    value={argomento}
                    onChange={e => setArgomento(e.target.value)}
                    placeholder="Es. 'Verifica sul Barocco'"
                    required
                />

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'var(--md-sys-grid-fr-1)',
                    gap: 'var(--md-sys-spacing-4)'
                }}>
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
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <Typography component="label" sx={{
                        fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                        fontWeight: 'var(--md-sys-typescale-body-large-font-weight)',
                        lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
                        color: 'var(--md-sys-color-on-surface)',
                        mb: 'var(--md-sys-spacing-3)'
                    }}>Tipo Prova</Typography>
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--md-sys-spacing-4)'
                    }}>
                        {EVALUATION_TYPES.map(t => (
                            <Card
                                key={t}
                                icon={getTestTypeIcon(t)}
                                label={t}
                                onClick={() => setTipo(t)}
                                selected={tipo === t}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>
        </M3Dialog>
    );
};

export default AddProvaModal;

