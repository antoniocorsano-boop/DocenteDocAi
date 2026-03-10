// MD3 Compliant - Block M Migration (6 violations eliminated)

import * as React from 'react';
import { useState } from 'react';
import { Studente, Valutazione } from '../types';
import { RATING_OPTIONS, EVALUATION_TYPES } from '../constants';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { M3Dialog, TextField } from './ui';
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
  <Paper
    elevation={selected ? 3 : 1}
    sx={{
      borderRadius: 'var(--md-sys-shape-corner-extra-large)',
      border: `2px solid ${selected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
      bgcolor: selected ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container)',
      color: selected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
      transition: 'all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
      minWidth: 'var(--md-sys-spacing-16)',
      transform: selected ? 'scale(1.05)' : 'none',
    }}
  >
    <ButtonBase
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label}
      sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 'var(--md-sys-spacing-2)', p: 'var(--md-sys-spacing-4)', width: '100%',
        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
        '&:hover': {
          bgcolor: selected
            ? 'color-mix(in srgb, var(--md-sys-color-primary) 8%, var(--md-sys-color-primary-container))'
            : 'var(--md-sys-color-surface-container-high)',
        },
      }}
    >
      <Box sx={{ width: 'var(--md-sys-spacing-12)', height: 'var(--md-sys-spacing-12)', borderRadius: 'var(--md-sys-shape-corner-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: selected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface)', color: selected ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-primary)', transition: 'all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)' }}>
        <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--icon-size-medium)', userSelect: 'none' }}>{icon}</Box>
      </Box>
      <Box component="span" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', fontFamily: 'var(--md-sys-typescale-body-small-font-family)' }}>{label}</Box>
    </ButtonBase>
  </Paper>
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
                <FormControl fullWidth>
                  <InputLabel id="eval-student-label" shrink>Studente</InputLabel>
                  <Select
                    labelId="eval-student-label"
                    id="eval-student-select"
                    value={selectedStudentId}
                    label="Studente"
                    displayEmpty
                    notched
                    required
                    onChange={(e: SelectChangeEvent) => setSelectedStudentId(e.target.value)}
                    renderValue={(v) => v
                      ? (students.find(s => s.id === v) ? `${students.find(s => s.id === v)!.cognome} ${students.find(s => s.id === v)!.nome}` : v)
                      : <Typography component="span" variant="body1" sx={{ color: 'var(--md-sys-color-on-surface-variant)', opacity: 0.6 }}>Seleziona studente...</Typography>
                    }
                  >
                    {students.map((s: Studente) => (
                      <MenuItem key={s.id} value={s.id}>{s.cognome} {s.nome}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)', gap: 'var(--md-sys-spacing-8)' }}>
                  <FormControl fullWidth>
                    <InputLabel id="eval-materia-label" shrink>Materia</InputLabel>
                    <Select
                      labelId="eval-materia-label"
                      id="eval-materia-select"
                      value={selectedMateria}
                      label="Materia"
                      displayEmpty
                      notched
                      required
                      onChange={(e: SelectChangeEvent) => setSelectedMateria(e.target.value)}
                      renderValue={(v) => v || <Typography component="span" variant="body1" sx={{ color: 'var(--md-sys-color-on-surface-variant)', opacity: 0.6 }}>Seleziona...</Typography>}
                    >
                      {discipline.map((d: string) => (
                        <MenuItem key={d} value={d}>{d}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="eval-voto-label" shrink>Voto / Giudizio</InputLabel>
                    <Select
                      labelId="eval-voto-label"
                      id="eval-voto-select"
                      value={voto}
                      label="Voto / Giudizio"
                      displayEmpty
                      notched
                      required
                      onChange={(e: SelectChangeEvent) => setVoto(e.target.value)}
                      renderValue={(v) => v || <Typography component="span" variant="body1" sx={{ color: 'var(--md-sys-color-on-surface-variant)', opacity: 0.6 }}>Seleziona...</Typography>}
                    >
                      {RATING_OPTIONS.map((o: string) => (
                        <MenuItem key={o} value={o}>{o}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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

                <TextField multiline
                    id="eval-note-textarea"
                    label="Note Aggiuntive"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={2}
                />
            </Box>
        </M3Dialog>
    );
};

export default AddEvaluationModal;

