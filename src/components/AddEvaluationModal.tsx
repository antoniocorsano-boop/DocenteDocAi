// MD3 Compliant - Block M Migration (6 violations eliminated)

import * as React from 'react';
import { useState } from 'react';
import { Studente, Valutazione } from '../types';
import { RATING_OPTIONS, EVALUATION_TYPES } from '../constants';
import { Button, Box, Typography, Card } from '@mui/material';
import { M3Dialog, SelectField, TextField, TextArea } from './ui';
interface AddEvaluationModalProps {
    students: Studente[];
    discipline: string[];
    onClose: () => void;
    onSave: (evaluation: Omit<Valutazione, 'id'>) => void;
}

interface AddEvaluationModalProps {
    students: Studente[];
    discipline: string[];
    onClose: () => void;
    onSave: (evaluation: Omit<Valutazione, 'id'>) => void;
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

const ChoiceCard: React.FC<{ icon: string; label: string; onClick: () => void; selected: boolean }> = ({ icon, label, onClick, selected }) => (
  <Card
    component="button"
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      p: 4, borderRadius: 'var(--md-sys-shape-corner-extra-large)',
      border: `2px solid ${selected ? 'var(--md-sys-color-primary)' : 'color-mix(in srgb, var(--md-sys-color-outline-variant) 19%, transparent)'}`,
      bgcolor: selected ? 'var(--md-sys-color-primary-container)' : 'color-mix(in srgb, var(--md-sys-color-surface-container) 50%, transparent)',
      color: selected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
      boxShadow: selected ? 'var(--md-sys-elevation-level4)' : 'none',
      transform: selected ? 'scale(1.05)' : 'scale(1)',
      transition: 'all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
      gap: 2, minWidth: 'var(--md-sys-spacing-16)', cursor: 'pointer',
      '&:hover': { border: `2px solid var(--md-sys-color-outline)`, bgcolor: selected ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container-high)' },
    }}
  >
    <Box sx={{ width: 'var(--md-sys-spacing-12)', height: 'var(--md-sys-spacing-12)', borderRadius: 'var(--md-sys-shape-corner-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: selected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface)', color: selected ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-primary)', boxShadow: selected ? 'var(--md-sys-elevation-level2)' : 'none', transition: 'all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)' }}>
      <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--icon-size-medium)', userSelect: 'none', fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>{icon}</Box>
    </Box>
    <Box component="span" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', fontFamily: 'var(--md-sys-typescale-body-small-font-family)' }}>{label}</Box>
  </Card>
);

const AddEvaluationModal: React.FC<AddEvaluationModalProps> = ({
    students,
    discipline,
    onClose,
    onSave
}: AddEvaluationModalProps) => {
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [selectedMateria, setSelectedMateria] = useState<string>(discipline[0] || '');
    const [tipo, setTipo] = useState<Valutazione['tipo']>('Orale');
    const [voto, setVoto] = useState<string>('');
    const [argomento, setArgomento] = useState<string>('');
    const [note, setNote] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudentId || !selectedMateria || !voto) {
            alert("Compila tutti i campi obbligatori (Studente, Materia, Voto).");
            return;
        }
        onSave({
            studenteId: selectedStudentId,
            materia: selectedMateria,
            data: new Date().toISOString(),
            tipo,
            voto,
            argomento,
            note });
        onClose();
    };

    return (
        <M3Dialog
            title="Aggiungi Valutazione"
            onClose={onClose}
            maxWidth="sm"
            buttons={<>
                <Button variant="text" onClick={onClose} type="button">Annulla</Button>
                <Button variant="contained" form="add-evaluation-form" type="submit">Salva Valutazione</Button>
            </>}
        >
            <Box
                component="form"
                id="add-evaluation-form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-6)', overflowY: 'auto', maxHeight: 'var(--md-sys-viewport-60)' }}
            >
                <SelectField
                    id="eval-student-select"
                    label="Studente"
                    value={selectedStudentId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStudentId(e.target.value)}
                    required
                >
                    <option value="">Seleziona studente...</option>
                    {students.map((s: Studente) => <option key={s.id} value={s.id}>{s.cognome} {s.nome}</option>)}
                </SelectField>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)', gap: 'var(--md-sys-spacing-8)' }}>
                    <SelectField
                        id="eval-materia-select"
                        label="Materia"
                        value={selectedMateria}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMateria(e.target.value)}
                        required
                    >
                        <option value="">Seleziona...</option>
                        {discipline.map((d: string) => <option key={d} value={d}>{d}</option>)}
                    </SelectField>
                    <SelectField
                        id="eval-voto-select"
                        label="Voto / Giudizio"
                        value={voto}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVoto(e.target.value)}
                        required
                    >
                        <option value="">Seleziona...</option>
                        {RATING_OPTIONS.map((o: string) => <option key={o} value={o}>{o}</option>)}
                    </SelectField>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <Typography
                        variant="caption"
                        component="span"
                        sx={{
                            color: 'var(--md-sys-color-primary)',
                            fontWeight: 'var(--md-sys-typescale-weight-black)',
                            textTransform: 'uppercase',
                            letterSpacing: 'var(--md-sys-typescale-label-large-tracking)',
                            px: 'var(--md-sys-spacing-4)',
                            mb: 'var(--md-sys-spacing-6)',
                            display: 'block' }}
                    >
                        Tipo Prova
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 'var(--md-sys-spacing-8)',
                            overflowX: 'auto',
                            pb: 'var(--md-sys-spacing-2)',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none' }}
                    >
                        {EVALUATION_TYPES.map(t => (
                            <ChoiceCard
                                key={t}
                                icon={getTestTypeIcon(t)}
                                label={t}
                                onClick={() => setTipo(t)}
                                selected={tipo === t}
                            />
                        ))}
                    </Box>
                </Box>

                <TextField
                    id="eval-argomento-input"
                    label="Argomento"
                    value={argomento}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArgomento(e.target.value)}
                    placeholder="Es. 'Il Barocco in Italia'"
                />

                <TextArea
                    id="eval-note-textarea"
                    label="Note Aggiuntive"
                    value={note}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
                    rows={2}
                />
            </Box>
        </M3Dialog>
    );
};

export default AddEvaluationModal;

