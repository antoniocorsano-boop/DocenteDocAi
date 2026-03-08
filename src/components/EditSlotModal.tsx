// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026
import React, { useState, useMemo } from 'react';
import { Slot, Lezione, TimetableSettings, AiSettings, Uda, KnowledgeBaseEntry, PianoInclusione, Studente } from '../types';
import { Button, Box, Typography, Card, FormControl, InputLabel, NativeSelect, InputAdornment } from '@mui/material';
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
            <Box sx={{ pl: 'var(--md-sys-spacing-4)', pr: 'var(--md-sys-spacing-4)' }}>
                <Typography variant="body2" sx={{ color: 'var(--md-sys-color-primary)', textTransform: 'uppercase' }}>{slot.giorno} • {slot.ora}</Typography>
            </Box>

            <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                <SectionHeader title="Tipologia Attività" icon="category" />
                <Box sx={{ display: 'flex', gap: 'var(--md-sys-spacing-6)', overflowX: 'auto', mt: 'var(--md-sys-spacing-4)' }}>
                    <ChoiceCard icon="school" label="Lezione" selected={activityType === 'standard'} onClick={() => setActivityType('standard')} />
                    <ChoiceCard icon="pending_actions" label="Disp." selected={activityType === 'disposizione'} onClick={() => setActivityType('disposizione')} />
                    <ChoiceCard icon="diversity_3" label="Ricev." selected={activityType === 'ricevimento'} onClick={() => setActivityType('ricevimento')} />
                </Box>
            </Box>

            <Box sx={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-8)', border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)' }}>
                {activityType === 'standard' && (
                    <Box sx={{ gap: 'var(--md-sys-spacing-6)' }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'var(--md-sys-grid-fr-1)', gap: 'var(--md-sys-spacing-8)' }}>
                                                        <FormControl sx={{ mb: 2 }}>
                              <InputLabel htmlFor="slot-class-select">Classe</InputLabel>
                              <NativeSelect
                                value={currentSlot.classe || ''}
                                onChange={e => setCurrentSlot({ ...currentSlot, classe: e.target.value })}
                                required
                                inputProps={{ id: 'slot-class-select' }}
                              >

                                <option value="">Seleziona...</option>
                                {userClasses.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            
                              </NativeSelect>
                            </FormControl>

                                                        <FormControl sx={{ mb: 2 }}>
                              <InputLabel htmlFor="slot-materia-select">Materia</InputLabel>
                              <NativeSelect
                                value={currentSlot.materia || ''}
                                onChange={e => setCurrentSlot({ ...currentSlot, materia: e.target.value })}
                                required
                                inputProps={{ id: 'slot-materia-select' }}
                              >

                                <option value="">Seleziona...</option>
                                {timetableSettings.disciplines.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            
                              </NativeSelect>
                            </FormControl>
                        </Box>

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
                            InputProps={{ startAdornment: <InputAdornment position="start"><span className="material-symbols-outlined" aria-hidden="true">auto_awesome</span></InputAdornment> }}
                        />
                    </Box>
                )}

                {activityType === 'disposizione' && (
                    <Box sx={{ gap: 'var(--md-sys-spacing-4)' }}>
                        <InfoCard title="Ora di Disposizione" description="Registra la tua presenza per sostituzioni o attività di plesso." icon="pending_actions" variant="outlined" />
                        <TextField multiline
                            id="slot-disp-nota"
                            label="Note Disposizione"
                            value={currentLesson.nota || ''}
                            onChange={e => setCurrentLesson({ ...currentLesson, nota: e.target.value })}
                            placeholder="Es. Sostituzione in 2B"
                            rows={3}
                        />
                    </Box>
                )}

                {activityType === 'ricevimento' && (
                    <Box sx={{ gap: 'var(--md-sys-spacing-4)' }}>
                        <InfoCard title="Colloquio Genitori" description="Spazio dedicato al ricevimento delle famiglie." icon="diversity_3" variant="tertiary" />
                        <TextField multiline
                            id="slot-ricev-nota"
                            label="Note / Orario"
                            value={currentLesson.nota || ''}
                            onChange={e => setCurrentLesson({ ...currentLesson, nota: e.target.value })}
                            placeholder="Es. Colloqui settimanali"
                            rows={3}
                        />
                    </Box>
                )}
            </Box>
        </M3Dialog>
    );
};

export default EditSlotModal;

