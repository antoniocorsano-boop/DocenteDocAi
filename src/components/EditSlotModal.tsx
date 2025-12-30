import React, { useState, useMemo, useRef } from 'react';
import { Slot, Lezione, TimetableSettings, AiSettings, Uda, KnowledgeBaseEntry, PianoInclusione, Studente } from '../types';
import { M3ChoiceCard, InfoCard, SectionHeader } from './M3Components';
import { TextField as MuiTextField, Select as MuiSelect, MenuItem, FormControl, InputLabel, InputAdornment } from '@mui/material';
import M3ExpressiveProvider from '../design-system/M3ExpressiveProvider';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

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

    const overlayRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    useModalAccessibility({ isOpen: true, onClose, overlayRef, containerRef, onOverlayClick: onClose });

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

    const themeState = useSettingsStore(state => state.themeState);
    return (
        <div className="dialog-backdrop" ref={overlayRef}>
            <M3ExpressiveProvider themeState={themeState}>
                <div
                    ref={containerRef}
                    role="dialog"
                    aria-modal="true"
                    tabIndex={-1}
                    className="dialog-container w-full max-w-xl md:max-w-lg lg:max-w-xl mx-auto shadow-xl animate-in zoom-in-95 duration-400 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="dialog-header border-b border-outline-variant bg-surface-container-high p-6">
                        <div>
                            <h2 className="m3-headline-small font-extrabold leading-none text-on-surface">Pianificazione Slot</h2>
                            <p className="m3-body-medium text-primary mt-2 font-extrabold uppercase tracking-[0.2em]">{slot.giorno} • {slot.ora}</p>
                        </div>
                        <button onClick={onClose} className="icon-button" aria-label="Chiudi">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="dialog-content p-6 space-y-8 bg-surface-container-low overflow-auto flex-1">
                        <SectionHeader title="Tipologia Attività" icon="category" />
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            <M3ChoiceCard icon="school" label="Lezione" selected={activityType === 'standard'} onClick={() => setActivityType('standard')} />
                            <M3ChoiceCard icon="pending_actions" label="Disp." selected={activityType === 'disposizione'} onClick={() => setActivityType('disposizione')} />
                            <M3ChoiceCard icon="diversity_3" label="Ricev." selected={activityType === 'ricevimento'} onClick={() => setActivityType('ricevimento')} />
                        </div>

                        <div className="bg-surface p-6 rounded-[40px] border border-outline-variant shadow-inner">
                            {activityType === 'standard' && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel id="slot-class-select-label">Classe</InputLabel>
                                            <MuiSelect
                                                labelId="slot-class-select-label"
                                                id="slot-class-select"
                                                label="Classe"
                                                value={currentSlot.classe || ''}
                                                onChange={e => setCurrentSlot({ ...currentSlot, classe: e.target.value as string })}
                                            >
                                                <MenuItem value=""><em>Seleziona...</em></MenuItem>
                                                {userClasses.map(c => (
                                                    <MenuItem key={c} value={c}>{c}</MenuItem>
                                                ))}
                                            </MuiSelect>
                                        </FormControl>

                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel id="slot-materia-select-label">Materia</InputLabel>
                                            <MuiSelect
                                                labelId="slot-materia-select-label"
                                                id="slot-materia-select"
                                                label="Materia"
                                                value={currentSlot.materia || ''}
                                                onChange={e => setCurrentSlot({ ...currentSlot, materia: e.target.value as string })}
                                            >
                                                <MenuItem value=""><em>Seleziona...</em></MenuItem>
                                                {timetableSettings.disciplines.map(d => (
                                                    <MenuItem key={d} value={d}>{d}</MenuItem>
                                                ))}
                                            </MuiSelect>
                                        </FormControl>
                                    </div>

                                    <MuiTextField
                                        id="slot-argomento-input"
                                        label="Argomento (Opzionale)"
                                        value={currentLesson.contenuto || ''}
                                        onChange={e => setCurrentLesson({ ...currentLesson, contenuto: e.target.value })}
                                        placeholder="Cosa spiegherai?"
                                        fullWidth
                                        variant="outlined"
                                    />

                                    <MuiTextField
                                        id="slot-ai-link-input"
                                        label="Link AI NotebookLM"
                                        value={currentLesson.externalLink || ''}
                                        onChange={e => setCurrentLesson({ ...currentLesson, externalLink: e.target.value })}
                                        placeholder="Incolla URL deliverable..."
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <span className="material-symbols-outlined">auto_awesome</span>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </div>
                            )}

                            {activityType === 'disposizione' && (
                                <div className="animate-in slide-in-from-bottom-4 space-y-4">
                                    <InfoCard title="Ora di Disposizione" description="Registra la tua presenza per sostituzioni o attività di plesso." icon="pending_actions" variant="secondary" />
                                    <MuiTextField
                                        id="slot-disp-nota"
                                        label="Note Disposizione"
                                        value={currentLesson.nota || ''}
                                        onChange={e => setCurrentLesson({ ...currentLesson, nota: e.target.value })}
                                        placeholder="Es. Sostituzione in 2B"
                                        fullWidth
                                        variant="outlined"
                                    />
                                </div>
                            )}

                            {activityType === 'ricevimento' && (
                                <div className="animate-in slide-in-from-bottom-4 space-y-4">
                                    <InfoCard title="Colloquio Genitori" description="Spazio dedicato al ricevimento delle famiglie." icon="diversity_3" variant="tertiary" />
                                    <MuiTextField
                                        id="slot-ricev-nota"
                                        label="Note / Orario"
                                        value={currentLesson.nota || ''}
                                        onChange={e => setCurrentLesson({ ...currentLesson, nota: e.target.value })}
                                        placeholder="Es. Colloqui settimanali"
                                        fullWidth
                                        variant="outlined"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="dialog-footer bg-surface-container-high p-6 border-t border-outline-variant flex-shrink-0">
                        {lesson && (
                            <button onClick={() => { if (window.confirm('Eliminare?')) { onDelete(slotKey); onClose(); } }} className="button button-text !text-error mr-auto !px-4">
                                Rimuovi
                            </button>
                        )}
                        <button onClick={onClose} className="button button-text !px-6 font-bold">Annulla</button>
                        <button onClick={handleSave} className="button button-filled shadow-xl !px-10 font-black">
                            Conferma
                        </button>
                    </div>
                </div>
            </M3ExpressiveProvider>
        </div>
    );
};

export default EditSlotModal;
