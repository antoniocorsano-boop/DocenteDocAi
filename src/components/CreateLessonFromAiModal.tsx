// MD3 Compliant - Block I Migration Complete (6 violations eliminated)
// Note: Icon font sizes (var(--md-sys-spacing-4)) retained with eslint-disable comments for Material Icons
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
            const prefix = prev.trim() ? '\n' : '; ';
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
                lesson: {
                    id: 'ai-adaptations-preview',
                    classe: classe,
                    materia: materia,
                    contenuto: argomento,
                    svolta: false
                }
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
                <form id="create-lesson-ai-form" onSubmit={handleSubmit} style={{ width: "var(--md-sys-percent-100)" }}>
                    <M3DialogContent >
                        <TextField 
                            label="Argomento" 
                            value={argomento} 
                            onChange={e => setArgomento(e.target.value)} 
                            required 
                        />
                        
                        <div  style={{ display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)" }}>
                            <SelectField label="Classe" value={classe} onChange={e => setClasse(e.target.value)} required>
                                {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                            </SelectField>
                            <SelectField label="Materia" value={materia} onChange={e => setMateria(e.target.value)} required>
                                {disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                            </SelectField>
                        </div>

                        <div>
                            <div  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label  style={{color: "var(--md-sys-color-primary)", textTransform: "uppercase"}}>Obiettivi</label>
                                {matchingCurriculum && (
                                    <M3Button 
                                        type="button" 
                                        onClick={() => setIsObjectivePickerOpen(true)}
                                        variant="tonal"
                                         style={{ textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)", borderRadius: 'var(--md-sys-shape-corner-medium)' }}
                                        title="Seleziona dal curricolo"
                                    >
                                        <span  style={{  fontSize: "var(--md-sys-spacing-4)"  }}>library_add</span>
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
                                style={{ 
                                    borderRadius: 'var(--md-sys-shape-corner-medium)', 
                                    backgroundColor: 'var(--md-sys-color-surface-container-low)', 
                                    padding: 'var(--md-sys-spacing-6)',
                                    border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)',
                                    transition: 'border-color var(--md-sys-motion-duration-medium4)',
                                    fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
                                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                    lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
                                    color: 'var(--md-sys-color-on-surface-variant)',
                                }}
                            />
                            {matchingCurriculum && !obiettivi && (
                                <p  style={{fontSize: 'var(--md-sys-typescale-body-small-font-size)', color: "var(--md-sys-color-primary)", marginTop: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', fontWeight: "bold", cursor: "pointer"}} onClick={() => setIsObjectivePickerOpen(true)}>
                                    <span  style={{  fontSize: "var(--md-sys-spacing-4)"  }}>info</span> 
                                    Curricolo disponibile: {matchingCurriculum.gradeLevel} di {matchingCurriculum.subject}
                                </p>
                            )}
                        </div>
                        
                        {slots && availableSlots.length > 0 && (
                            <div style={{ backgroundColor: 'var(--md-sys-color-secondary-container)', padding: 'var(--md-sys-spacing-12)', borderRadius: 'var(--md-sys-shape-corner-medium)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)", gap: 'var(--md-sys-spacing-6)' }}>
                                <label style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "900", textTransform: "uppercase" }}>Pianificazione Rapida (Opzionale)</label>
                                <div  style={{ display: "flex", flexWrap: "wrap" }}>
                                    {availableSlots.map(([key, slot]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setSelectedSlotKey(prev => prev === key ? '' : key)}
                                            style={{
                                                height: 'var(--md-sys-spacing-12)',
                                                padding: 'var(--md-sys-spacing-0) var(--md-sys-spacing-8)',
                                                borderRadius: 'var(--md-sys-shape-corner-full)',
                                                border: selectedSlotKey === key ? 'var(--md-sys-border-width-thin) solid var(--md-sys-color-primary)' : 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)',
                                                backgroundColor: selectedSlotKey === key ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-container-high)',
                                                color: selectedSlotKey === key ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
                                                fontWeight: selectedSlotKey === key ? 700 : 500,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--md-sys-spacing-8)',
                                                margin: 'var(--md-sys-spacing-4) 0',
                                                cursor: 'pointer',
                                                transition: 'all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)'
                                            }}
                                        >
                                            {selectedSlotKey === key && <span  style={{  fontSize: "var(--md-sys-spacing-4)"  }}>check</span>}
                                            <span  style={{ fontSize: 'var(--md-sys-typescale-body-small-font-size)' }}>{slot.giorno} {slot.ora}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <div  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label  style={{color: "var(--md-sys-color-primary)", fontWeight: "900", textTransform: "uppercase"}}>Adattamenti per l'Inclusività</label>
                                <M3Button 
                                    type="button" 
                                    onClick={handleGenerateAdaptations} 
                                    disabled={isAdaptationsLoading} 
                                    variant="text"
                                    style={{ borderRadius: 'var(--md-sys-shape-corner-large)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', fontWeight: "900", textTransform: "uppercase", fontSize: 'var(--md-sys-typescale-body-small-font-size)', transition: "all var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)" }}
                                    title="Usa l'AI per suggerire adattamenti basati sui Piani di Inclusione della classe"
                                >
                                    {isAdaptationsLoading ? (
                                        <AiThinkingGem size="small" inline text="Suggerisco..." />
                                    ) : (
                                        <span  style={{  fontSize: "var(--md-sys-spacing-4)"  }}>auto_awesome</span>
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
                                style={{ 
                                    borderRadius: 'var(--md-sys-shape-corner-medium)', 
                                    backgroundColor: 'var(--md-sys-color-surface-container-low)', 
                                    padding: 'var(--md-sys-spacing-6)',
                                    border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)',
                                    transition: 'border-color var(--md-sys-motion-duration-medium4)',
                                    fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
                                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                    lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
                                    color: 'var(--md-sys-color-on-surface-variant)',
                                }}
                            ></TextArea>
                        </div>
                    </M3DialogContent>

                    <M3DialogActions  style={{ paddingTop: "0" }}>
                        <M3Button type="button" onClick={onClose} variant="text">Annulla</M3Button>
                        <M3Button type="submit" variant="filled" >
                            <span  style={{ marginRight: "var(--md-sys-spacing-2)", fontWeight: "900" }}>{selectedSlotKey ? 'event_available' : 'archive'}</span>
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
                    <M3DialogContent style={{marginTop: 'var(--md-sys-spacing-8)'}}>
                        <p  style={{color: "var(--md-sys-color-primary)", textTransform: "uppercase"}}>{matchingCurriculum.subject} - {matchingCurriculum.gradeLevel}</p>
                        {matchingCurriculum.nuclei.map(nucleo => (
                            <details key={nucleo.id}  open>
                                <summary >
                                    <span style={{ color: 'var(--md-sys-color-on-primary)', fontWeight: "900" }}>{nucleo.title}</span>
                                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)',  fontSize: "var(--md-sys-spacing-4)"  }}>expand_more</span>
                                </summary>
                                <div style={{padding: 'var(--md-sys-spacing-8)', gap: 'var(--md-sys-spacing-3)', backgroundColor: "var(--md-sys-color-surface)"}}>
                                    {nucleo.objectives.map(obj => (
                                        <button 
                                            key={obj.id}
                                            type="button"
                                            onClick={() => handleAddObjective(obj.text)}
                                            style={{ borderRadius: 'var(--md-sys-shape-corner-large)', width: "var(--md-sys-percent-100)", textAlign: "left", padding: 'var(--md-sys-spacing-6)', transition: "color var(--md-sys-motion-duration-medium)", display: "flex", alignItems: "flex-start", gap: 'var(--md-sys-spacing-6)' }}
                                        >
                                            <span  style={{color: "var(--md-sys-color-primary)",  fontSize: "var(--md-sys-spacing-4)" , transition: "transform var(--md-sys-motion-duration-medium)"}}>add_circle</span>
                                            <span style={{ color: 'var(--md-sys-color-on-primary)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', fontWeight: "500" }}>{obj.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </details>
                        ))}
                    </M3DialogContent>

                    <M3DialogActions>
                        <M3Button type="button" onClick={() => setIsObjectivePickerOpen(false)} variant="filled"  style={{ width: "var(--md-sys-percent-100)", fontWeight: "900" }}>CONFERMA SELEZIONE</M3Button>
                    </M3DialogActions>
                </M3Dialog>
            )}
        </>
    );
};

export { CreateLessonFromAiModal };








