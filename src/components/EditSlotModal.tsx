import React, { useState, useMemo } from 'react';
import { Slot, Lezione, TimetableSettings, AiSettings, Uda, KnowledgeBaseEntry, PianoInclusione, Studente } from '../types';
import { M3ChoiceCard, TextField, SelectField, InfoCard, TextArea } from './M3Components';

interface EditSlotModalProps {
  slot: Slot;
  lesson?: Lezione;
  allLessons: Record<string, Lezione>;
  allSlots: Record<string, Slot>;
  udas: Uda[];
  onClose: () => void;
  onSave: (slotKey: string, slotData: Slot) => void;
  onDelete: (slotKey: string) => void;
  onSaveLesson: (lesson: Lezione, slotKey: string) => void;
  onStartClassroom: (classe: string, materia: string, slotKey: string, lesson: Lezione) => void;
  timetableSettings: TimetableSettings;
  userClasses: string[];
  aiSettings: AiSettings;
  students: Studente[];
  knowledgeBase: KnowledgeBaseEntry[];
  pianiInclusione: Record<string, PianoInclusione>;
}

type ActivityType = 'standard' | 'disposizione' | 'ricevimento';

export const EditSlotModal: React.FC<EditSlotModalProps> = ({
  slot,
  lesson,
  onClose,
  onDelete,
  onSaveLesson,
  timetableSettings,
  userClasses,
}) => {
  const slotKey = `${slot.giorno}-${slot.ora}`;
  
  const initialType = useMemo(() => {
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
              alert("Classe e Materia sono obbligatorie.");
              return;
          }
          const newLesson: Lezione = {
              id: lesson?.id || `les-${Date.now()}`,
              classe: currentSlot.classe,
              materia: currentSlot.materia,
              contenuto: currentLesson.contenuto || 'Lezione',
              svolta: false,
              tipoLezione: currentLesson.tipoLezione as any || 'Teoria',
              ...currentLesson
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
              // FIX: Changed 'note' to 'nota' to match Lezione interface
              nota: currentLesson.nota || '' 
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
              // FIX: Changed 'note' to 'nota' to match Lezione interface
              nota: currentLesson.nota || '' 
          };
          onSaveLesson(newLesson, slotKey);
      }
      onClose();
  };

  return (
      <div className="dialog-backdrop">
          <div className="dialog-container w-full max-w-xl shadow-xl animate-in zoom-in-95 duration-400 overflow-hidden">
              <div className="dialog-header border-b border-outline-variant bg-surface-container-high p-6">
                  <div>
                      <h2 className="m3-headline-small font-extrabold leading-none text-on-surface">Pianificazione Slot</h2>
                      <p className="m3-body-medium text-primary mt-2 font-extrabold uppercase tracking-[0.2em]">{slot.giorno} • {slot.ora}</p>
                  </div>
                  <button onClick={onClose} className="icon-button">
                      <span className="material-symbols-outlined">close</span>
                  </button>
              </div>
              
              <div className="dialog-content p-6 space-y-8 bg-surface-container-low">
                  <section>
                      <label className="text-[11px] text-on-surface-variant font-extrabold uppercase tracking-[0.3em] mb-4 block px-1">Tipologia Attività</label>
                      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                          <M3ChoiceCard icon="school" label="Lezione" selected={activityType === 'standard'} onClick={() => setActivityType('standard')} />
                          <M3ChoiceCard icon="pending_actions" label="Disp." selected={activityType === 'disposizione'} onClick={() => setActivityType('disposizione')} />
                          <M3ChoiceCard icon="diversity_3" label="Ricev." selected={activityType === 'ricevimento'} onClick={() => setActivityType('ricevimento')} />
                      </div>
                  </section>

                  <div className="bg-surface p-6 rounded-[40px] border border-outline-variant shadow-inner">
                  {activityType === 'standard' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField 
                                id="slot-class-select"
                                label="Classe" 
                                value={currentSlot.classe || ''} 
                                onChange={e => setCurrentSlot({ ...currentSlot, classe: e.target.value })}
                            >
                                <option value="">Seleziona...</option>
                                {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                            </SelectField>
                            <SelectField 
                                id="slot-materia-select"
                                label="Materia" 
                                value={currentSlot.materia || ''} 
                                onChange={e => setCurrentSlot({ ...currentSlot, materia: e.target.value })}
                            >
                                <option value="">Seleziona...</option>
                                {timetableSettings.disciplines.map(d => <option key={d} value={d}>{d}</option>)}
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
                        {/* FIX: Changed 'note' to 'nota' to match Lezione interface */}
                        <TextField 
                            id="slot-disp-nota"
                            label="Note Disposizione" 
                            value={currentLesson.nota || ''} 
                            onChange={e => setCurrentLesson({ ...currentLesson, nota: e.target.value })} 
                            placeholder="Es. Sostituzione in 2B" 
                        />
                    </div>
                  )}

                  {activityType === 'ricevimento' && (
                    <div className="animate-in slide-in-from-bottom-4 space-y-4">
                        <InfoCard title="Colloquio Genitori" description="Spazio dedicato al ricevimento delle famiglie." icon="diversity_3" variant="tertiary" />
                        {/* FIX: Changed 'note' to 'nota' to match Lezione interface */}
                        <TextField 
                            id="slot-ricev-nota"
                            label="Note / Orario" 
                            value={currentLesson.nota || ''} 
                            onChange={e => setCurrentLesson({ ...currentLesson, nota: e.target.value })} 
                            placeholder="Es. Colloqui settimanali" 
                        />
                    </div>
                  )}
                  </div>
              </div>

              <div className="dialog-footer bg-surface-container-high p-6 border-t border-outline-variant">
                  {lesson && (
                      <button onClick={() => { if(confirm("Eliminare?")) { onDelete(slotKey); onClose(); } }} className="button button-text !text-error mr-auto !px-4">
                          Rimuovi
                      </button>
                  )}
                  <button onClick={onClose} className="button button-text !px-6 font-bold">Annulla</button>
                  <button onClick={handleSave} className="button button-filled shadow-xl !px-10 font-black">
                      Conferma
                  </button>
              </div>
          </div>
      </div>
  );
};
