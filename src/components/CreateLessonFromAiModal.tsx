import React, { useState, useEffect, useMemo } from 'react';
import { Lezione, AiSettings, Studente, PianoInclusione, Slot, CurriculumSubject } from '../types';
import { generateInclusivityAdaptations } from '../services/aiService';
import { DAYS_OF_WEEK } from '../constants';
import { parseClassString } from '../utils/schoolUtils'; 
import { TextField, SelectField, TextArea, M3Dialog, M3DialogContent, M3DialogActions, M3Button, AiThinkingGem } from './ui';

interface CreateLessonFromAiModalProps {
    content: { title: string; htmlContent: string };
    onClose: () => void;
    onSave: (lessonData: Omit<Lezione, 'id' | 'svolta'>) => void;
    userClasses: string[];
    disciplines: string[];
    students: Studente[];
    pianiInclusione: Record<string, PianoInclusione>;
    aiSettings: AiSettings;
    slots?: Record<string, Slot>;
    onSchedule?: (lesson: Lezione, slotKey: string) => void;
    curricula: CurriculumSubject[]; 
}

const CreateLessonFromAiModal: React.FC<CreateLessonFromAiModalProps> = ({ content, onClose, onSave, userClasses, disciplines, students, pianiInclusione, aiSettings, slots, onSchedule, curricula }) => {
    const [argomento, setArgomento] = useState('');
    const [obiettivi, setObiettivi] = useState('');
    const [classe, setClasse] = useState(userClasses[0] || '');
    const [materia, setMateria] = useState(disciplines[0] || '');
    const [adattamenti, setAdattamenti] = useState('');
    const [isAdaptationsLoading, setIsAdaptationsLoading] = useState(false);
    const [selectedSlotKey, setSelectedSlotKey] = useState<string>('');
    
    // Objective Picker State
    const [isObjectivePickerOpen, setIsObjectivePickerOpen] = useState(false);

    useEffect(() => {
        // AI-powered pre-fill
        setArgomento(content.title);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content.htmlContent;
        
        let extractedObjectives = '';
        // Try to find a list, which is a good candidate for objectives
        const list = tempDiv.querySelector('ul, ol');
        if (list) {
            extractedObjectives = Array.from(list.querySelectorAll('li'))
                .map(li => `- ${li.textContent?.trim()}`)
                .join('\n');
        } else {
            // Fallback: take the first few lines of text
            extractedObjectives = (tempDiv.textContent || '')
                .split('\n')
                .filter(line => line.trim().length > 10) // Filter out short/empty lines
                .slice(0, 3)
                .map(line => `- ${line.trim()}`)
                .join('\n');
        }
        setObiettivi(extractedObjectives);

    }, [content]);

    // Find free slots for the selected class
    const availableSlots = useMemo(() => {
        if (!slots || !classe) return [];
        // FIX: Casting esplicito di entries per TS
        const entries = Object.entries(slots) as [string, Slot][];
        return entries
            .filter(([, slot]) => !slot.lezioneId && (!slot.classe || slot.classe === classe)) // Filter out already assigned slots
            .sort((a: [string, Slot], b: [string, Slot]) => {
                const dayOrder = DAYS_OF_WEEK.indexOf(a[1].giorno) - DAYS_OF_WEEK.indexOf(b[1].giorno);
                if (dayOrder !== 0) return dayOrder;
                return a[1].ora.localeCompare(b[1].ora);
            })
            .slice(0, 4); // Show only a few for quick selection
    }, [slots, classe]);

    // Logic to find matching curriculum
    const matchingCurriculum = useMemo(() => {
        if (!classe || !materia || !curricula) return null;
        
        // 1. Try exact match on subject
        const subjectMatch = curricula.filter(c => c.subject === materia);
        if (subjectMatch.length === 0) return null;

        // 2. Try to match grade level (e.g. "1A" -> "1" or "Prime")
        const parsed = parseClassString(classe);
        if (!parsed) return subjectMatch[0]; // Fallback to first

        // Fuzzy match grade level string
        return subjectMatch.find(c => {
            const gradeStr = parsed.grade.toString();
            return c.gradeLevel.includes(gradeStr) || 
                   (parsed.grade === 1 && c.gradeLevel.toLowerCase().includes('prime')) ||
                   (parsed.grade === 2 && c.gradeLevel.toLowerCase().includes('seconde')) ||
                   (parsed.grade === 3 && c.gradeLevel.toLowerCase().includes('terze')) ||
                   (parsed.grade === 4 && c.gradeLevel.toLowerCase().includes('quarte')) ||
                   (parsed.grade === 5 && c.gradeLevel.toLowerCase().includes('quinte'));
        }) || subjectMatch[0];

    }, [curricula, classe, materia]);

    const handleAddObjective = (text: string) => {
        setObiettivi(prev => {
            const prefix = prev.trim() ? '\n' : '';
            return `${prev}${prefix}- ${text}`;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!argomento.trim() || !classe || !materia) {
            alert('Per favore, compila Argomento, Classe e Materia.');
            return;
        }
        
        const lessonData: Omit<Lezione, 'id' | 'svolta'> = {
            contenuto: argomento,
            obiettivi,
            classe,
            materia,
            adattamenti,
            tipoLezione: 'Teoria', // Default type
            compiti: '',
        };

        if (selectedSlotKey && onSchedule) {
            const fullLesson: Lezione = {
                ...lessonData,
                id: `lesson-ai-${Date.now()}`,
                svolta: false
            };
            onSchedule(fullLesson, selectedSlotKey);
        } else {
            onSave(lessonData);
        }
        onClose();
    };

    const handleGenerateAdaptations = async () => {
        if (!classe || !argomento) {
            alert("Definisci la classe e l'argomento della lezione prima di chiedere suggerimenti.");
            return;
        }
    
        setIsAdaptationsLoading(true);
        try {
            const pianiInclusionePerClasse = (Object.values(pianiInclusione) as PianoInclusione[]).filter(p => {
                const student = students.find(s => s.id === p.id);
                return student && student.classe === classe;
            });
    
            if (pianiInclusionePerClasse.length === 0) {
                alert("Nessun Piano di Inclusione attivo trovato per questa classe. Aggiungine uno dalla sezione 'Didattica Inclusiva' per ricevere suggerimenti mirati.");
                return; 
            }
    
            const lessonContext = {
                contenuto: argomento,
                classe: classe,
            };
    
            const adaptations = await generateInclusivityAdaptations(aiSettings, lessonContext, pianiInclusionePerClasse);
            
            setAdattamenti(prev => prev ? `${prev}\n${adaptations}` : adaptations);
    
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Errore sconosciuto';
            console.error("Error generating inclusivity adaptations:", errorMsg);
            alert("Si è verificato un errore durante la generazione dei suggerimenti per l'inclusività.");
        } finally {
            setIsAdaptationsLoading(false);
        }
    };


    return (
        <>
            <M3Dialog
                title="Crea Bozza Lezione"
                onClose={onClose}
                maxWidth="lg"
                level={1}
            >
                <form id="create-lesson-ai-form" onSubmit={handleSubmit} className="w-full">
                    <M3DialogContent className="space-y-12 px-12 pt-12 pb-0">
                        <TextField 
                            label="Argomento" 
                            value={argomento} 
                            onChange={e => setArgomento(e.target.value)} 
                            required 
                        />
                        
                        <div className="grid grid-cols-2 gap-12">
                            <SelectField label="Classe" value={classe} onChange={e => setClasse(e.target.value)} required>
                                {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                            </SelectField>
                            <SelectField label="Materia" value={materia} onChange={e => setMateria(e.target.value)} required>
                                {disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                            </SelectField>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-12">
                                <label className="m3-label-small text-primary font-extrabold uppercase tracking-[0.2em] px-8 !mb-0">Obiettivi</label>
                                {matchingCurriculum && (
                                    <M3Button 
                                        type="button" 
                                        onClick={() => setIsObjectivePickerOpen(true)}
                                        variant="tonal"
                                        className="!h-10 !px-6 !text-xs font-extrabold uppercase tracking-widest rounded-full"
                                        title="Seleziona dal curricolo"
                                    >
                                        <span className="material-symbols-outlined mr-1 text-sm">library_add</span>
                                        Curricolo
                                    </M3Button>
                                )}
                            </div>
                            <TextArea
                                label="Elenco obiettivi didattici per la lezione..."
                                value={obiettivi}
                                onChange={e => setObiettivi(e.target.value)}
                                rows={5}
                                placeholder="Elenco obiettivi didattici per la lezione..."
                                containerClassName="shadow-inner !bg-[var(--md-sys-color-surface-container-low)]est"
                            />
                            {matchingCurriculum && !obiettivi && (
                                <p className="text-xs text-primary mt-4 flex items-center gap-8 font-bold px-8 cursor-pointer" onClick={() => setIsObjectivePickerOpen(true)}>
                                    <span className="material-symbols-outlined text-sm">info</span> 
                                    Curricolo disponibile: {matchingCurriculum.gradeLevel} di {matchingCurriculum.subject}
                                </p>
                            )}
                        </div>
                        
                        {slots && availableSlots.length > 0 && (
                            <div className="bg-secondary-container/10 p-12 rounded-4xl border border-secondary/20 space-y-6">
                                <label className="m3-label-small text-[var(--md-sys-color-on-surface)]-variant font-black uppercase tracking-[0.2em] px-8">Pianificazione Rapida (Opzionale)</label>
                                <div className="flex flex-wrap gap-12">
                                    {availableSlots.map(([key, slot]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setSelectedSlotKey(prev => prev === key ? '' : key)}
                                            className={`chip !h-12 !px-8 ${selectedSlotKey === key ? 'chip-selected border-primary' : 'bg-[var(--md-sys-color-surface-container-high)]'}`}
                                        >
                                            {selectedSlotKey === key && <span className="material-symbols-outlined text-base">check</span>}
                                            <span className="font-extrabold text-xs">{slot.giorno} {slot.ora}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="flex justify-between items-center mb-12">
                                <label className="m3-label-small text-primary font-black uppercase tracking-[0.2em] px-8 !mb-0">Adattamenti per l'Inclusività</label>
                                <M3Button 
                                    type="button" 
                                    onClick={handleGenerateAdaptations} 
                                    disabled={isAdaptationsLoading} 
                                    variant="text"
                                    className="!h-auto !py-2 !px-8 flex items-center gap-8 font-black uppercase text-xs rounded-[var(--md-sys-shape-corner-small)] hover:shadow-[var(--md-sys-elevation-level1)] transition-all"
                                    title="Usa l'AI per suggerire adattamenti basati sui Piani di Inclusione della classe"
                                >
                                    {isAdaptationsLoading ? (
                                        <AiThinkingGem size="small" inline text="Suggerisco..." />
                                    ) : (
                                        <span className="material-symbols-outlined mr-1 text-base">auto_awesome</span>
                                    )}
                                    {isAdaptationsLoading ? '' : 'Suggerisci con AI'}
                                </M3Button>
                            </div>
                            <TextArea 
                                label="Es. Fornire mappe concettuali, consentire l'uso della calcolatrice..."
                                value={adattamenti} 
                                onChange={(e) => setAdattamenti(e.target.value)} 
                                rows={4}
                                placeholder="Es. Fornire mappe concettuali, consentire l'uso della calcolatrice..."
                                containerClassName="shadow-inner !bg-[var(--md-sys-color-surface-container-low)]est"
                            ></TextArea>
                        </div>
                    </M3DialogContent>

                    <M3DialogActions className="gap-12 px-12 pb-12 pt-0">
                        <M3Button type="button" onClick={onClose} variant="text">Annulla</M3Button>
                        <M3Button type="submit" variant="filled" className="shadow-[var(--md-sys-elevation-level3)] !px-16">
                            <span className="material-symbols-outlined mr-2 font-black">{selectedSlotKey ? 'event_available' : 'archive'}</span>
                            {selectedSlotKey ? 'Salva e Pianifica' : 'Salva in Archivio'}
                        </M3Button>
                    </M3DialogActions>
                </form>
            </M3Dialog>

            {/* NESTED OBJECTIVE PICKER MODAL */}
            {isObjectivePickerOpen && matchingCurriculum && (
                <M3Dialog
                    title="Seleziona Obiettivi"
                    onClose={() => setIsObjectivePickerOpen(false)}
                    maxWidth="2xl"
                    level={2}
                >
                    <M3DialogContent className="space-y-8">
                        <p className="m3-label-tiny text-primary font-extrabold uppercase tracking-[0.3em]">{matchingCurriculum.subject} - {matchingCurriculum.gradeLevel}</p>
                        {matchingCurriculum.nuclei.map(nucleo => (
                            <details key={nucleo.id} className="m3-expansion-panel shadow-[var(--md-sys-elevation-level1)] !rounded-4xl" open>
                                <summary className="m3-expansion-summary !bg-[var(--md-sys-color-surface-container-high)]">
                                    <span className="m3-title-medium font-black text-[var(--md-sys-color-on-surface)]">{nucleo.title}</span>
                                    <span className="material-symbols-outlined text-sm text-[var(--md-sys-color-on-surface)]-variant">expand_more</span>
                                </summary>
                                <div className="p-8 space-y-3 bg-surface">
                                    {nucleo.objectives.map(obj => (
                                        <button 
                                            key={obj.id}
                                            type="button"
                                            onClick={() => handleAddObjective(obj.text)}
                                            className="w-full text-left p-6 rounded-[var(--md-sys-shape-corner-medium)] hover:bg-[var(--md-sys-color-surface-container-low)] transition-colors flex items-start gap-6 group"
                                        >
                                            <span className="material-symbols-outlined text-primary text-base mt-0.5 group-hover:scale-110 transition-transform">add_circle</span>
                                            <span className="text-sm font-medium text-[var(--md-sys-color-on-surface)]">{obj.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </details>
                        ))}
                    </M3DialogContent>

                    <M3DialogActions>
                        <M3Button type="button" onClick={() => setIsObjectivePickerOpen(false)} variant="filled" className="w-full font-black shadow-[var(--md-sys-elevation-level2)]">CONFERMA SELEZIONE</M3Button>
                    </M3DialogActions>
                </M3Dialog>
            )}
        </>
    );
};

export { CreateLessonFromAiModal };


