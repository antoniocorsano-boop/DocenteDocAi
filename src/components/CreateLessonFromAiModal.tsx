import React, { useState, useEffect, useMemo } from 'react';
import { Lezione, AiSettings, Studente, PianoInclusione, Slot, CurriculumSubject } from '../types';
import { generateInclusivityAdaptations } from '../services/aiService';
import { DAYS_OF_WEEK } from '../constants';
import { parseClassString } from '../utils/schoolUtils'; 
import { TextField, SelectField, TextArea, TabGroup } from './M3Components';
import AiThinkingGem from './AiThinkingGem';

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
            .filter(([key, slot]) => !slot.lezioneId && (!slot.classe || slot.classe === classe)) // Filter out already assigned slots
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
            console.error("Error generating inclusivity adaptations:", error);
            alert("Si è verificato un errore durante la generazione dei suggerimenti per l'inclusività.");
        } finally {
            setIsAdaptationsLoading(false);
        }
    };


    return (
        <div className="dialog-backdrop">
            <form onSubmit={handleSubmit} className="dialog-container w-full max-w-lg h-[90vh] flex flex-col shadow-xl">
                <div className="dialog-header border-b border-outline-variant p-6 bg-surface-container-high flex-shrink-0">
                    <div>
                        <h2 className="m3-headline-small font-extrabold">Crea Bozza Lezione</h2>
                         <p className="m3-body-medium text-on-surface-variant font-bold uppercase tracking-widest text-[10px] mt-1">Finalizza i dettagli e salva nell'archivio.</p>
                    </div>
                    <button type="button" onClick={onClose} className="icon-button">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="dialog-content flex-grow overflow-y-auto p-8 space-y-8">
                     <TextField 
                        label="Argomento" 
                        value={argomento} 
                        onChange={e => setArgomento(e.target.value)} 
                        required 
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Classe" value={classe} onChange={e => setClasse(e.target.value)} required>
                            {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                        </SelectField>
                        <SelectField label="Materia" value={materia} onChange={e => setMateria(e.target.value)} required>
                            {disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                        </SelectField>
                    </div>

                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[11px] text-primary font-extrabold uppercase tracking-[0.2em] px-2 !mb-0">Obiettivi</label>
                            {matchingCurriculum && (
                                <button 
                                    type="button" 
                                    onClick={() => setIsObjectivePickerOpen(true)}
                                    className="button button-tonal !h-8 !px-3 !text-xs font-extrabold uppercase tracking-widest rounded-full"
                                    title="Seleziona dal curricolo"
                                >
                                    <span className="material-symbols-outlined mr-1 text-sm">library_add</span>
                                    Curricolo
                                </button>
                            )}
                        </div>
                        <TextArea
                            label="Elenco obiettivi didattici per la lezione..." // FIX: Added missing label
                            value={obiettivi}
                            onChange={e => setObiettivi(e.target.value)}
                            rows={5}
                            placeholder="Elenco obiettivi didattici per la lezione..."
                            containerClassName="shadow-inner !bg-surface-container-lowest"
                        />
                         {matchingCurriculum && !obiettivi && (
                             <p className="text-xs text-primary mt-3 flex items-center gap-2 font-bold px-2 cursor-pointer" onClick={() => setIsObjectivePickerOpen(true)}>
                                 <span className="material-symbols-outlined text-sm">info</span> 
                                 Curricolo disponibile: {matchingCurriculum.gradeLevel} di {matchingCurriculum.subject}
                             </p>
                         )}
                    </div>
                    
                    {slots && availableSlots.length > 0 && (
                        <div className="bg-secondary-container/10 p-5 rounded-[32px] border border-secondary/20 space-y-3">
                            <label className="text-[11px] text-on-surface-variant font-black uppercase tracking-[0.2em] px-2">Pianificazione Rapida (Opzionale)</label>
                            <div className="flex flex-wrap gap-2">
                                {availableSlots.map(([key, slot]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setSelectedSlotKey(prev => prev === key ? '' : key)}
                                        className={`chip !h-10 !px-4 ${selectedSlotKey === key ? 'chip-selected border-primary' : 'bg-surface-container-high'}`}
                                    >
                                        {selectedSlotKey === key && <span className="material-symbols-outlined text-base">check</span>}
                                        <span className="font-extrabold text-xs">{slot.giorno} {slot.ora}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[11px] text-primary font-black uppercase tracking-[0.2em] px-2 !mb-0">Adattamenti per l'Inclusività</label>
                            <button 
                                type="button" 
                                onClick={handleGenerateAdaptations} 
                                disabled={isAdaptationsLoading} 
                                className="button button-text !h-auto !py-1 !px-2 flex items-center gap-1 font-black uppercase text-xs rounded-lg hover:shadow-md transition-all"
                                title="Usa l'AI per suggerire adattamenti basati sui Piani di Inclusione della classe"
                            >
                                {isAdaptationsLoading ? (
                                    <AiThinkingGem size="small" inline text="Suggerisco..." />
                                ) : (
                                    <span className="material-symbols-outlined mr-1 text-base">auto_awesome</span>
                                )}
                                {isAdaptationsLoading ? '' : 'Suggerisci con AI'}
                            </button>
                        </div>
                        <TextArea 
                            label="Es. Fornire mappe concettuali, consentire l'uso della calcolatrice..." // FIX: Added missing label
                            value={adattamenti} 
                            onChange={(e) => setAdattamenti(e.target.value)} 
                            rows={4}
                            placeholder="Es. Fornire mappe concettuali, consentire l'uso della calcolatrice..."
                            containerClassName="shadow-inner !bg-surface-container-lowest"
                        ></TextArea>
                    </div>
                </div>
                
                <div className="dialog-footer border-t border-outline-variant p-6 bg-surface-container-high flex-shrink-0">
                    <button type="button" onClick={onClose} className="button button-text font-bold">Annulla</button>
                    <button type="submit" className="button button-filled shadow-xl font-black !px-10">
                        <span className="material-symbols-outlined mr-2 font-black">{selectedSlotKey ? 'event_available' : 'archive'}</span>
                        {selectedSlotKey ? 'Salva e Pianifica' : 'Salva in Archivio'}
                    </button>
                </div>
            </form>

            {/* NESTED OBJECTIVE PICKER MODAL */}
            {isObjectivePickerOpen && matchingCurriculum && (
                <div className="dialog-backdrop" style={{zIndex: 2200}}>
                    <div className="dialog-container w-full max-w-2xl h-[80vh] flex flex-col bg-surface !rounded-[40px] shadow-xl">
                        <div className="dialog-header border-b border-outline-variant p-6">
                            <div>
                                <h3 className="m3-title-large font-extrabold">Seleziona Obiettivi</h3>
                                <p className="text-[10px] text-primary font-extrabold uppercase tracking-[0.3em] mt-1">{matchingCurriculum.subject} - {matchingCurriculum.gradeLevel}</p>
                            </div>
                             <button type="button" onClick={() => setIsObjectivePickerOpen(false)} className="icon-button">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="dialog-content flex-grow overflow-y-auto p-8 space-y-8 bg-surface-container-lowest">
                            {matchingCurriculum.nuclei.map(nucleo => (
                                <details key={nucleo.id} className="m3-expansion-panel shadow-md !rounded-[32px]" open>
                                    <summary className="m3-expansion-summary !bg-surface-container-high">
                                        <span className="m3-title-medium font-black text-on-surface">{nucleo.title}</span>
                                        <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
                                    </summary>
                                    <div className="p-4 space-y-3 bg-surface">
                                        {nucleo.objectives.map(obj => (
                                            <button 
                                                key={obj.id}
                                                type="button"
                                                onClick={() => handleAddObjective(obj.text)}
                                                className="w-full text-left p-3 rounded-xl hover:bg-surface-container-low transition-colors flex items-start gap-3 group"
                                            >
                                                <span className="material-symbols-outlined text-primary text-base mt-0.5 group-hover:scale-110 transition-transform">add_circle</span>
                                                <span className="text-sm font-medium text-on-surface">{obj.text}</span>
                                            </button>
                                        ))}
                                    </div>
                                </details>
                            ))}
                        </div>
                        <div className="dialog-footer border-t border-outline-variant p-6 bg-surface-container-high">
                            <button onClick={() => setIsObjectivePickerOpen(false)} className="button button-filled w-full font-black shadow-lg">CONFERMA SELEZIONE</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { CreateLessonFromAiModal };
