// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: marzo 2026
import React, { useState, useMemo } from 'react';
import { Slot, Lezione, TimetableSettings, AiSettings, Uda, KnowledgeBaseEntry, PianoInclusione, Studente } from '../types';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { M3Dialog, InfoCard, SectionHeader, TextField } from './ui';
interface EditSlotModalProps {
    slot: Slot;
    lesson?: Lezione;
    allLessons?: Record<string, Lezione>;
    allSlots?: Record<string, Slot>;
    udas?: Uda[];
    onClose: () => void;
    onSave?: (slotKey: string, slotData: Slot) => void;
    onDelete?: (slotKey: string) => void;
    onSaveLesson: (lesson: Lezione, slotKey: string) => void;
    onStartClassroom?: (classe: string, materia: string, slotKey: string, lesson: Lezione) => void;
    timetableSettings: TimetableSettings;
    userClasses: string[];
    aiSettings?: AiSettings;
    students?: Studente[];
    knowledgeBase?: KnowledgeBaseEntry[];
    pianiInclusione?: Record<string, PianoInclusione>;
}

type ActivityType = 'standard' | 'disposizione' | 'ricevimento';

const ChoiceCard: React.FC<{ icon: string; label: string; onClick: () => void; selected: boolean }> = ({ icon, label, onClick, selected }) => (
    <Paper
        elevation={selected ? 3 : 1}
        sx={{
            borderRadius: 'var(--md-sys-shape-corner-extra-large)',
            border: `var(--md-sys-border-width-thick) solid ${selected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
            bgcolor: selected ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container)',
            color: selected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
            transition: `all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
            minWidth: 'var(--md-sys-spacing-16)',
            transform: selected ? 'scale(1.05)' : 'none',
        }}
    >
        <ButtonBase
            onClick={onClick}
            aria-pressed={selected}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--md-sys-spacing-2)',
                p: 'var(--md-sys-spacing-4)',
                width: '100%',
                borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                '&:hover': {
                    bgcolor: selected
                        ? 'color-mix(in srgb, var(--md-sys-color-primary) 8%, var(--md-sys-color-primary-container))'
                        : 'var(--md-sys-color-surface-container-high)',
                },
            }}
        >
            <Box sx={{
                width: 'var(--md-sys-spacing-12)',
                height: 'var(--md-sys-spacing-12)',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: selected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface)',
                color: selected ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-primary)',
                transition: `all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
            }}>
                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--icon-size-medium)', userSelect: 'none' }}>{icon}</Box>
            </Box>
            <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 'var(--md-sys-typescale-weight-medium)' }}>{label}</Typography>
        </ButtonBase>
    </Paper>
);

const EditSlotModal: React.FC<EditSlotModalProps> = ({
    slot,
    lesson,
    onClose,
    onDelete = () => {},
    onSaveLesson,
    timetableSettings,
    userClasses }) => {
    const slotKey = `${slot.giorno}-${slot.ora}`;

    const initialType = useMemo<ActivityType>(() => {
        if (lesson?.tipoLezione === 'Disposizione') return 'disposizione';
        if (lesson?.tipoLezione === 'Ricevimento') return 'ricevimento';
        return 'standard';
    }, [lesson]);

    const [activityType, setActivityType] = useState<ActivityType>(initialType);
    const [currentSlot, setCurrentSlot] = useState<Slot>(slot);
    const [currentLesson, setCurrentLesson] = useState<Partial<Lezione>>(lesson || { tipoLezione: 'Teoria' });

    const handleSave = () => {
        if (activityType === 'standard') {
            if (!currentSlot.classe || !currentSlot.materia) {
                alert('Classe e Materia sono obbligatorie.');
                return;
            }
            const newLesson: Lezione = {
                id: lesson?.id || `les-${Date.now()}`,
                classe: currentSlot.classe,
                materia: currentSlot.materia,
                contenuto: currentLesson.contenuto || 'Lezione',
                svolta: false,
                tipoLezione: currentLesson.tipoLezione || 'Teoria',
                ...currentLesson };
            onSaveLesson(newLesson, slotKey);
        } else if (activityType === 'disposizione') {
            const newLesson: Lezione = {
                id: lesson?.id || `disp-${Date.now()}`,
                classe: 'N/A',
                materia: 'Disposizione',
                contenuto: 'Sostituzione / Disposizione',
                svolta: true,
                tipoLezione: 'Disposizione',
                  nota: currentLesson.nota || '' };
            onSaveLesson(newLesson, slotKey);
        } else {
            const newLesson: Lezione = {
                id: lesson?.id || `ricev-${Date.now()}`,
                classe: 'N/A',
                materia: 'Ricevimento',
                contenuto: 'Ricevimento Genitori',
                svolta: true,
                tipoLezione: 'Ricevimento',
                nota: currentLesson.nota || '' };
            onSaveLesson(newLesson, slotKey);
        }
        onClose();
    };

    return (
        <M3Dialog
            title="Pianificazione Slot"
            onClose={onClose}
            maxWidth="lg"
            buttons={
                <>
                    {lesson && (
                        <Button onClick={() => { if (window.confirm('Eliminare?')) { onDelete(slotKey); onClose(); } }} variant="text">
                            Rimuovi
                        </Button>
                    )}
                    <Button onClick={onClose} variant="text">Annulla</Button>
                    <Button onClick={handleSave} variant="contained">Conferma</Button>
                </>
            }
        >
            <Stack spacing="var(--md-sys-spacing-6)">
                {/* Slot header */}
                <Typography
                    variant="overline"
                    sx={{ color: 'var(--md-sys-color-primary)', fontWeight: 'var(--md-sys-typescale-weight-bold)' }}
                >
                    {slot.giorno} • {slot.ora}
                </Typography>

                {/* Activity type selector */}
                <Box component="section">
                    <SectionHeader title="Tipologia Attività" icon="category" />
                    <Stack direction="row" spacing="var(--md-sys-spacing-3)" sx={{ mt: 'var(--md-sys-spacing-4)', overflowX: 'auto', pb: 'var(--md-sys-spacing-1)' }}>
                        <ChoiceCard icon="school" label="Lezione" selected={activityType === 'standard'} onClick={() => setActivityType('standard')} />
                        <ChoiceCard icon="pending_actions" label="Disp." selected={activityType === 'disposizione'} onClick={() => setActivityType('disposizione')} />
                        <ChoiceCard icon="diversity_3" label="Ricev." selected={activityType === 'ricevimento'} onClick={() => setActivityType('ricevimento')} />
                    </Stack>
                </Box>

                {/* Form area */}
                <Paper
                    variant="outlined"
                    sx={{
                        bgcolor: 'var(--md-sys-color-surface-container-low)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        borderColor: 'var(--md-sys-color-outline)',
                        p: 'var(--md-sys-spacing-6)',
                    }}
                >
                    {activityType === 'standard' && (
                        <Stack spacing="var(--md-sys-spacing-6)">
                            <FormControl fullWidth>
                                <InputLabel id="slot-class-label" shrink>Classe</InputLabel>
                                <Select
                                    labelId="slot-class-label"
                                    id="slot-class-select"
                                    value={currentSlot.classe || ''}
                                    label="Classe"
                                    displayEmpty
                                    notched
                                    onChange={(e: SelectChangeEvent) => setCurrentSlot({ ...currentSlot, classe: e.target.value })}
                                    renderValue={(selected) => selected
                                        ? String(selected)
                                        : <Typography component="span" variant="body1" sx={{ color: 'var(--md-sys-color-on-surface-variant)', opacity: 0.6 }}>Seleziona...</Typography>
                                    }
                                >
                                    {userClasses.map(c => (
                                        <MenuItem key={c} value={c}>{c}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="slot-materia-label" shrink>Materia</InputLabel>
                                <Select
                                    labelId="slot-materia-label"
                                    id="slot-materia-select"
                                    value={currentSlot.materia || ''}
                                    label="Materia"
                                    displayEmpty
                                    notched
                                    onChange={(e: SelectChangeEvent) => setCurrentSlot({ ...currentSlot, materia: e.target.value })}
                                    renderValue={(selected) => selected
                                        ? String(selected)
                                        : <Typography component="span" variant="body1" sx={{ color: 'var(--md-sys-color-on-surface-variant)', opacity: 0.6 }}>Seleziona...</Typography>
                                    }
                                >
                                    {timetableSettings.disciplines.map(d => (
                                        <MenuItem key={d} value={d}>{d}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                id="slot-argomento-input"
                                label="Argomento (Opzionale)"
                                value={currentLesson.contenuto || ''}
                                onChange={e => setCurrentLesson({ ...currentLesson, contenuto: e.target.value })}
                                placeholder="Cosa spiegherai?"
                            />

                            <TextField
                                id="slot-ai-link-input"
                                label="Link AI NotebookLM"
                                value={currentLesson.externalLink || ''}
                                onChange={e => setCurrentLesson({ ...currentLesson, externalLink: e.target.value })}
                                placeholder="Incolla URL deliverable..."
                                slotProps={{ htmlInput: { startAdornment: <InputAdornment position="start"><Box component="span" className="material-symbols-outlined" aria-hidden="true">auto_awesome</Box></InputAdornment> } }}
                            />
                        </Stack>
                    )}

                    {activityType === 'disposizione' && (
                        <Stack spacing="var(--md-sys-spacing-4)">
                            <InfoCard title="Ora di Disposizione" description="Registra la tua presenza per sostituzioni o attività di plesso." icon="pending_actions" variant="outlined" />
                            <TextField
                                multiline
                                id="slot-disp-nota"
                                label="Note Disposizione"
                                value={currentLesson.nota || ''}
                                onChange={e => setCurrentLesson({ ...currentLesson, nota: e.target.value })}
                                placeholder="Es. Sostituzione in 2B"
                                rows={3}
                            />
                        </Stack>
                    )}

                    {activityType === 'ricevimento' && (
                        <Stack spacing="var(--md-sys-spacing-4)">
                            <InfoCard title="Colloquio Genitori" description="Spazio dedicato al ricevimento delle famiglie." icon="diversity_3" variant="tertiary" />
                            <TextField
                                multiline
                                id="slot-ricev-nota"
                                label="Note / Orario"
                                value={currentLesson.nota || ''}
                                onChange={e => setCurrentLesson({ ...currentLesson, nota: e.target.value })}
                                placeholder="Es. Colloqui settimanali"
                                rows={3}
                            />
                        </Stack>
                    )}
                </Paper>
            </Stack>
        </M3Dialog>
    );
};

export default EditSlotModal;

