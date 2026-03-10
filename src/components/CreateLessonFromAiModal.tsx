// MD3 Compliant - Block I Migration Complete (6 violations eliminated)
// Note: Icon font sizes (var(--md-sys-spacing-4)) retained with eslint-disable comments for Material Icons
import React, { useState, useEffect, useMemo } from 'react';
import { Lezione, AiSettings, Studente, PianoInclusione, Slot, CurriculumSubject } from '../types';
import { generateInclusivityAdaptations } from '../services/aiService';
import { DAYS_OF_WEEK } from '../constants';
import { parseClassString } from '../utils/schoolUtils'; 
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { M3Dialog, TextField, AiThinkingGem } from './ui';
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
            compiti: '' };

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
                buttons={
                    <>
                        <Button type="button" onClick={onClose} variant="text">Annulla</Button>
                        <Button type="submit" form="create-lesson-ai-form" variant="contained">
                            <Typography component="span" sx={{ mr: 'var(--md-sys-spacing-2)', fontWeight: 'var(--md-sys-typescale-weight-black)' }}>{selectedSlotKey ? 'event_available' : 'archive'}</Typography>
                            {selectedSlotKey ? 'Salva e Pianifica' : 'Salva in Archivio'}
                        </Button>
                    </>
                }
            >
                <Box id="create-lesson-ai-form" component="form" onSubmit={handleSubmit} sx={{ width: 'var(--md-sys-percent-100)' }}>
                        <TextField
                            label="Argomento"
                            value={argomento}
                            onChange={e => setArgomento(e.target.value)}
                            required
                        />

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)' }}>
                          <FormControl fullWidth>
                              <InputLabel id="cla-classe-label" shrink>Classe</InputLabel>
                              <Select
                                labelId="cla-classe-label"
                                value={classe}
                                label="Classe"
                                displayEmpty
                                notched
                                required
                                onChange={(e: SelectChangeEvent) => setClasse(e.target.value)}
                                renderValue={(v) => v || <Typography component="span" variant="body1" sx={{ color: 'var(--md-sys-color-on-surface-variant)', opacity: 0.6 }}>Seleziona...</Typography>}
                              >
                                {userClasses.map(c => (
                                  <MenuItem key={c} value={c}>{c}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          <FormControl fullWidth>
                              <InputLabel id="cla-materia-label" shrink>Materia</InputLabel>
                              <Select
                                labelId="cla-materia-label"
                                value={materia}
                                label="Materia"
                                displayEmpty
                                notched
                                required
                                onChange={(e: SelectChangeEvent) => setMateria(e.target.value)}
                                renderValue={(v) => v || <Typography component="span" variant="body1" sx={{ color: 'var(--md-sys-color-on-surface-variant)', opacity: 0.6 }}>Seleziona...</Typography>}
                              >
                                {disciplines.map(d => (
                                  <MenuItem key={d} value={d}>{d}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography component="label" sx={{ color: 'var(--md-sys-color-primary)', textTransform: 'uppercase' }}>Obiettivi</Typography>
                                {matchingCurriculum && (
                                    <Button
                                        type="button"
                                        onClick={() => setIsObjectivePickerOpen(true)}
                                        variant="outlined"
                                        sx={{ textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', borderRadius: 'var(--md-sys-shape-corner-medium)' }}
                                        title="Seleziona dal curricolo"
                                    >
                                        <Typography component="span" sx={{ fontSize: 'var(--md-sys-spacing-4)' }}>library_add</Typography>
                                        Curricolo
                                    </Button>
                                )}
                            </Box>
                            <TextField multiline
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
                                    color: 'var(--md-sys-color-on-surface-variant)' }}
                            />
                            {matchingCurriculum && !obiettivi && (
                                <Typography component="p" onClick={() => setIsObjectivePickerOpen(true)} sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', color: 'var(--md-sys-color-primary)', mt: 'var(--md-sys-spacing-4)', display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-8)', fontWeight: 'var(--md-sys-typescale-weight-bold)', cursor: 'pointer' }}>
                                    <Typography component="span" sx={{ fontSize: 'var(--md-sys-spacing-4)' }}>info</Typography>
                                    Curricolo disponibile: {matchingCurriculum.gradeLevel} di {matchingCurriculum.subject}
                                </Typography>
                            )}
                        </Box>

                        {slots && availableSlots.length > 0 && (
                            <Box sx={{ backgroundColor: 'var(--md-sys-color-secondary-container)', padding: 'var(--md-sys-spacing-12)', borderRadius: 'var(--md-sys-shape-corner-medium)', border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)', gap: 'var(--md-sys-spacing-6)' }}>
                                <Typography component="label" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase' }}>Pianificazione Rapida (Opzionale)</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {availableSlots.map(([key, slot]) => (
                                        <ButtonBase
                                            key={key}
                                            component="button"
                                            type="button"
                                            onClick={() => setSelectedSlotKey(prev => prev === key ? '' : key)}
                                            sx={{
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
                                                transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)'
                                            }}
                                        >
                                            {selectedSlotKey === key && <Typography component="span" sx={{ fontSize: 'var(--md-sys-spacing-4)' }}>check</Typography>}
                                            <Typography component="span" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>{slot.giorno} {slot.ora}</Typography>
                                        </ButtonBase>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography component="label" sx={{ color: 'var(--md-sys-color-primary)', fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase' }}>Adattamenti per l'Inclusività</Typography>
                                <Button
                                    type="button"
                                    onClick={handleGenerateAdaptations}
                                    disabled={isAdaptationsLoading}
                                    variant="text"
                                    sx={{ borderRadius: 'var(--md-sys-shape-corner-large)', display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-8)', fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase', fontSize: 'var(--md-sys-typescale-body-large-font-size)', transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)' }}
                                    title="Usa l'AI per suggerire adattamenti basati sui Piani di Inclusione della classe"
                                >
                                    {isAdaptationsLoading ? (
                                        <AiThinkingGem size="small" inline text="Suggerisco..." />
                                    ) : (
                                        <Typography component="span" sx={{ fontSize: 'var(--md-sys-spacing-4)' }}>auto_awesome</Typography>
                                    )}
                                    {isAdaptationsLoading ? '' : 'Suggerisci con AI'}
                                </Button>
                            </Box>
                            <TextField multiline
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
                                    color: 'var(--md-sys-color-on-surface-variant)' }}
                            />
                        </Box>
                </Box>
            </M3Dialog>

            {/* NESTED OBJECTIVE PICKER MODAL */}
            {isObjectivePickerOpen && matchingCurriculum && (
                <M3Dialog
                    title="Seleziona Obiettivi"
                    onClose={() => setIsObjectivePickerOpen(false)}
                    maxWidth="xl"
                    buttons={<Button type="button" onClick={() => setIsObjectivePickerOpen(false)} variant="contained" sx={{ width: 'var(--md-sys-percent-100)', fontWeight: 'var(--md-sys-typescale-weight-black)' }}>CONFERMA SELEZIONE</Button>}
                >
                        <Typography component="p" sx={{ color: 'var(--md-sys-color-primary)', textTransform: 'uppercase' }}>{matchingCurriculum.subject} - {matchingCurriculum.gradeLevel}</Typography>
                        {matchingCurriculum.nuclei.map(nucleo => (
                            <details key={nucleo.id} open>
                                <summary>
                                    <Typography component="span" sx={{ color: 'var(--md-sys-color-on-primary)', fontWeight: 'var(--md-sys-typescale-weight-black)' }}>{nucleo.title}</Typography>
                                    <Typography component="span" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: 'var(--md-sys-spacing-4)' }}>expand_more</Typography>
                                </summary>
                                <Box sx={{ padding: 'var(--md-sys-spacing-8)', gap: 'var(--md-sys-spacing-3)', backgroundColor: 'var(--md-sys-color-surface)' }}>
                                    {nucleo.objectives.map(obj => (
                                        <ButtonBase
                                            key={obj.id}
                                            component="button"
                                            type="button"
                                            onClick={() => handleAddObjective(obj.text)}
                                            sx={{ borderRadius: 'var(--md-sys-shape-corner-large)', width: 'var(--md-sys-percent-100)', textAlign: 'left', padding: 'var(--md-sys-spacing-6)', transition: 'color var(--md-sys-motion-duration-medium)', display: 'flex', alignItems: 'flex-start', gap: 'var(--md-sys-spacing-6)' }}
                                        >
                                            <Typography component="span" sx={{ color: 'var(--md-sys-color-primary)', fontSize: 'var(--md-sys-spacing-4)', transition: 'transform var(--md-sys-motion-duration-medium)' }}>add_circle</Typography>
                                            <Typography component="span" sx={{ color: 'var(--md-sys-color-on-primary)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', fontWeight: 'var(--md-sys-typescale-weight-medium)' }}>{obj.text}</Typography>
                                        </ButtonBase>
                                    ))}
                                </Box>
                            </details>
                        ))}
                </M3Dialog>
            )}
        </>
    );
};

export { CreateLessonFromAiModal };

