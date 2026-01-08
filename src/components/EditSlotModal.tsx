import React, { useState, useMemo } from 'react';
import { Slot, Lezione, TimetableSettings, AiSettings, Uda, KnowledgeBaseEntry, PianoInclusione, Studente } from '../types';
import { M3ChoiceCard, InfoCard, SectionHeader, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, SelectField, TextArea } from './ui';

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

const EditSlotModal: React.FC<EditSlotModalProps> = ({
    slot,
    lesson,
    onClose,
    onDelete = () => {},
    onSaveLesson,
    timetableSettings,
    userClasses,
}) => {
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
                tipoLezione: (currentLesson.tipoLezione as Lezione['tipoLezione']) || 'Teoria',
                ...currentLesson,
            };
            onSaveLesson(newLesson, slotKey);
        } else if (activityType === 'disposizione') {
            const newLesson: Lezione = {
                id: lesson?.id || `disp-${Date.now()}`,
                classe: 'N/A',
                materia: 'Disposizione',
                contenuto: 'Sostituzione / Disposizione',
                svolta: true,
                tipoLezione: 'Disposizione',
                nota: currentLesson.nota || '',
            };
            onSaveLesson(newLesson, slotKey);
        } else {
            const newLesson: Lezione = {
                id: lesson?.id || `ricev-${Date.now()}`,
                classe: 'N/A',
                materia: 'Ricevimento',
                contenuto: 'Ricevimento Genitori',
                svolta: true,
                tipoLezione: 'Ricevimento',
                nota: currentLesson.nota || '',
            };
            onSaveLesson(newLesson, slotKey);
        }
        onClose();
    };

    return (
        <M3Dialog
            title="Pianificazione Slot"
            onClose={onClose}
            maxWidth="lg"
            level={1}
        >
            <M3DialogContent className="space-y-8">
                <div className="px-4">
                    <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-primary font-extrabold uppercase tracking-[0.2em]">{slot.giorno} • {slot.ora}</p>
                </div>

                <section>
                    <SectionHeader title="Tipologia Attività" icon="category" />
                    <div className="flex gap-6 overflow-x-auto pb-2 no-scrollbar mt-4">
                        <M3ChoiceCard icon="school" label="Lezione" selected={activityType === 'standard'} onClick={() => setActivityType('standard')} />
                        <M3ChoiceCard icon="pending_actions" label="Disp." selected={activityType === 'disposizione'} onClick={() => setActivityType('disposizione')} />
                        <M3ChoiceCard icon="diversity_3" label="Ricev." selected={activityType === 'ricevimento'} onClick={() => setActivityType('ricevimento')} />
                    </div>
                </section>

                <div className="bg-[var(--md-sys-color-surface-container-low)]est p-8 md:p-6 rounded-[var(--md-sys-shape-corner-extra-large)] md:rounded-4xl border border-[var(--md-sys-color-outline-variant)]/30 shadow-inner">
                    {activityType === 'standard' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <SelectField
                                    id="slot-class-select"
                                    label="Classe"
                                    value={currentSlot.classe || ''}
                                    onChange={e => setCurrentSlot({ ...currentSlot, classe: e.target.value })}
                                    required
                                >
                                    <option value="">Seleziona...</option>
                                    {userClasses.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </SelectField>

                                <SelectField
                                    id="slot-materia-select"
                                    label="Materia"
                                    value={currentSlot.materia || ''}
                                    onChange={e => setCurrentSlot({ ...currentSlot, materia: e.target.value })}
                                    required
                                >
                                    <option value="">Seleziona...</option>
                                    {timetableSettings.disciplines.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </SelectField>
                            </div>

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
                                leadingIcon="auto_awesome"
                            />
                        </div>
                    )}

                    {activityType === 'disposizione' && (
                        <div className="animate-in slide-in-from-bottom-4 space-y-4">
                            <InfoCard title="Ora di Disposizione" description="Registra la tua presenza per sostituzioni o attività di plesso." icon="pending_actions" variant="secondary" />
                            <TextArea
                                id="slot-disp-nota"
                                label="Note Disposizione"
                                value={currentLesson.nota || ''}
                                onChange={e => setCurrentLesson({ ...currentLesson, nota: e.target.value })}
                                placeholder="Es. Sostituzione in 2B"
                                rows={3}
                            />
                        </div>
                    )}

                    {activityType === 'ricevimento' && (
                        <div className="animate-in slide-in-from-bottom-4 space-y-4">
                            <InfoCard title="Colloquio Genitori" description="Spazio dedicato al ricevimento delle famiglie." icon="diversity_3" variant="tertiary" />
                            <TextArea
                                id="slot-ricev-nota"
                                label="Note / Orario"
                                value={currentLesson.nota || ''}
                                onChange={e => setCurrentLesson({ ...currentLesson, nota: e.target.value })}
                                placeholder="Es. Colloqui settimanali"
                                rows={3}
                            />
                        </div>
                    )}
                </div>
            </M3DialogContent>
            <M3DialogActions>
                {lesson && (
                    <M3Button onClick={() => { if (window.confirm('Eliminare?')) { onDelete(slotKey); onClose(); } }} variant="text" className="!text-error mr-auto">
                        Rimuovi
                    </M3Button>
                )}
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button onClick={handleSave} variant="filled" className="shadow-[var(--md-sys-elevation-level3)] !px-10">Conferma</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default EditSlotModal;


