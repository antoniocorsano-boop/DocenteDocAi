// LEGACY - MD3 Non-compliant

/**
 * LessonsPage.tsx
 * // M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for layout, colors, spacing, and typography.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Lezione, LessonsPageProps, CurriculumSubject, TimetableSettings } from '../types';
import { generateLessonSequenceForClass } from '../services/aiService';
// import LessonView from './LessonView';
import IdeaGeneratorModal from './IdeaGeneratorModal';
import { CreateLessonFromAiModal } from './CreateLessonFromAiModal';
import { useTheme } from '../theme/theme';

// Extend Interface locally if not updated in types.ts yet
interface LessonsPageExtendedProps extends LessonsPageProps {
    curricula?: CurriculumSubject[];
    settings?: TimetableSettings; // Added optional settings prop
}

const LessonsPage: React.FC<LessonsPageExtendedProps> = ({ lessons, udas, knowledgeBase, userClasses, onViewLesson, onAddLessons, onStartClassroom, aiSettings, setIsLoadingModalOpen, setLoadingModalMessage, slots, onScheduleLesson, curricula = [], settings }) => {
  const { layers } = useTheme();
    const [error, setError] = useState('');
    const [selectedUdaIds, setSelectedUdaIds] = useState<string[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

    // KB Selection
    const [selectedKbIds, setSelectedKbIds] = useState<string[]>([]);

    // Filtri per l'archivio
    const [filterClass, setFilterClass] = useState<string>('');
    const [filterUda, setFilterUda] = useState<string>('');

    // Idea Generator State
    const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
    const [generatedIdeaContent, setGeneratedIdeaContent] = useState<{ title: string; htmlContent: string; } | null>(null);

    // Pre-select logical KB files
    useEffect(() => {
        if (knowledgeBase.length > 0) {
            const defaults = knowledgeBase
                .filter(k => k.category === 'programmazione' || k.fileName.toLowerCase().includes('programmazione') || k.category === 'materiale_didattico')
                .map(k => k.id);
            setSelectedKbIds(defaults);
        }
    }, [knowledgeBase]);

    const handleUdaSelection = (udaId: string) => {
        setSelectedUdaIds(prev =>
            prev.includes(udaId) ? prev.filter(id => id !== udaId) : [...prev, udaId]
        );
    };

    const handleClassSelection = (className: string) => {
        setSelectedClasses(prev =>
            prev.includes(className) ? prev.filter(c => c !== className) : [...prev, className]
        );
    };

    const handleKbSelection = (id: string) => {
        setSelectedKbIds(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]);
    };

    const handleGenerateSequences = async () => {
        if (selectedUdaIds.length === 0 || selectedClasses.length === 0) {
            alert("Seleziona almeno una UDA e una classe per procedere.");
            return;
        }
        setLoadingModalMessage("L'AI sta generando le sequenze di lezioni usando i documenti selezionati...");
        setIsLoadingModalOpen(true);
        setError('');
        try {
            const selectedUdas = udas.filter(u => selectedUdaIds.includes(u.id));

            // Filter KB Content
            const kbText = knowledgeBase
                .filter(doc => selectedKbIds.includes(doc.id))
                .map(doc => `--- ${doc.fileName} ---\n${doc.content}`)
                .join('\n\n');

            let allNewLessons: Lezione[] = [];

            for (const targetClass of selectedClasses) {
                const extractedLessons = await generateLessonSequenceForClass(aiSettings, selectedUdas, targetClass, kbText);
                const newLessonsForClass: Lezione[] = (extractedLessons as Omit<Lezione, 'id' | 'svolta'>[]).map((lessonData, index) => ({
                    ...lessonData,
                    id: `lesson-seq-${Date.now()}-${targetClass}-${index}`,
                    svolta: false,
                }));
                allNewLessons = [...allNewLessons, ...newLessonsForClass];
            }
            onAddLessons(allNewLessons);
            alert(`${allNewLessons.length} lezioni generate con successo per ${selectedClasses.length} classi e aggiunte all'archivio!`);
            setSelectedUdaIds([]);
            setSelectedClasses([]);

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Errore durante la generazione delle sequenze di lezioni.");
        } finally {
            setIsLoadingModalOpen(false);
        }
    };

    const groupedLessonsByClass: [string, Record<string, Lezione[]>][] = useMemo(() => {
        const groups: Record<string, Record<string, Lezione[]>> = {};

        lessons.filter(lesson => {
            if (filterClass && lesson.classe !== filterClass) return false;
            if (filterUda && lesson.unitaDiApprendimento !== filterUda) return false;
            return true;
        }).forEach(lesson => {
            const classKey = lesson.classe || 'Senza Classe';
            const udaKey = lesson.unitaDiApprendimento || 'Lezioni Varie';

            if (!groups[classKey]) {
                groups[classKey] = {};
            }
            if (!groups[classKey][udaKey]) {
                groups[classKey][udaKey] = [];
            }
            groups[classKey][udaKey].push(lesson);
        });

        // Sort lessons within each group
        for (const classKey in groups) {
            for (const udaKey in groups[classKey]) {
                groups[classKey][udaKey].sort((a: Lezione, b: Lezione) => a.contenuto.localeCompare(b.contenuto));
            }
        }

        return Object.keys(groups)
            .sort((a, b) => a.localeCompare(b))
            .map((classKey) => [classKey, groups[classKey]]);
    }, [lessons, filterClass, filterUda]);

    const filteredUdas = useMemo(() => {
        if (!filterClass) return udas;
        return udas.filter(u => u.classe === filterClass);
    }, [udas, filterClass]);


    return (
        <div >
            <div >
            <div >
                <div >
                    <h1 >Progetta Lezioni</h1>
                    <p >Genera e orchestra sequenze di lezioni partendo da UDA e classi.</p>
                </div>
            </div>

            {/* Expressive Idea Card */}
            <div
                
                onClick={() => setIsIdeaModalOpen(true)}
            >
                <div >
                    <div >
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>lightbulb</span>
                    </div>
                    <div>
                        <h2 >Hai un'idea per una lezione?</h2>
                        <p >
                            Tocca qui per trasformarla subito in un piano strutturato con l'AI. Dettala o scrivila.
                        </p>
                    </div>
                </div>
            </div>


            {/* Lesson Sequence Generator */}
            <details >
                <summary >
                    <div >
                        <span >auto_awesome</span>
                        <span >Generatore Sequenze Lezioni</span>
                    </div>
                    <span >expand_more</span>
                </summary>
                <div >
                    <p >
                        Seleziona le Unità di Apprendimento (UDA) e le classi. L'AI genererà una sequenza di lezioni strutturata per ogni classe, basandosi sui documenti KB selezionati.
                    </p>
                    <div >
                        {/* UDA Selection */}
                        <div >
                            <h3 >1. Seleziona UDA</h3>
                            {/* Centralized Selection Container */}
                            <div >
                                {udas.length > 0 ? udas.map(uda => (
                                    <div key={uda.id} >
                                        <input type="checkbox" id={`uda-select-${uda.id}`} checked={selectedUdaIds.includes(uda.id)} onChange={() => handleUdaSelection(uda.id)} />
                                        <label htmlFor={`uda-select-${uda.id}`} >{selectedUdaIds.includes(uda.id) && <span >check</span>}{uda.title}</label>
                                    </div>
                                )) : <p >Nessuna UDA trovata. Creane una nel Planner.</p>}
                            </div>
                        </div>
                        {/* Class Selection */}
                        <div >
                            <h3  style={{marginBottom: layers.ref.spacing['8']}}>2. Seleziona Classi</h3>
                            {/* Centralized Selection Container */}
                            <div style={{ padding: ref.spacing[0] }} style={{ border: "none", overflowY: "auto" }}>
                                {userClasses.map(c => (
                                    <div key={c} >
                                        <input type="checkbox" id={`class-select-${c}`} checked={selectedClasses.includes(c)} onChange={() => handleClassSelection(c)} />
                                        <label htmlFor={`class-select-${c}`}  style={{ width: "100%", justifyContent: "flex-start" }}>{selectedClasses.includes(c) && <span  style={{ fontSize: "1.125rem" }}>check</span>}{c}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* KB Selection */}
                        <div >
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: layers.ref.spacing['8']}}>
                                <h3 >3. Contesto KB</h3>
                                <span style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{ fontSize: "0.75rem" }}>{selectedKbIds.length} selezionati</span>
                            </div>
                            <div style={{ padding: ref.spacing[0] }} style={{ border: "none", overflowY: "auto" }}>
                                {knowledgeBase.map(kb => (
                                    <div key={kb.id} >
                                        <input type="checkbox" id={`kb-select-${kb.id}`} checked={selectedKbIds.includes(kb.id)} onChange={() => handleKbSelection(kb.id)} />
                                        <label htmlFor={`kb-select-${kb.id}`}  style={{ width: "100%", justifyContent: "flex-start" }} title={kb.fileName}>
                                            {selectedKbIds.includes(kb.id) && <span  style={{ fontSize: "1.125rem" }}>check</span>}
                                            <span  style={{color: "layers.sys.colors.primary", fontSize: ref.spacing[16]}}>{kb.isGenerated ? 'auto_awesome' : 'description'}</span>
                                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{kb.fileName}</span>
                                        </label>
                                    </div>
                                ))}
                                {knowledgeBase.length === 0 && <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>KB vuota.</p>}
                            </div>
                        </div>
                    </div>
                    <div style={{marginTop: layers.ref.spacing['4']}}>
                        <button onClick={handleGenerateSequences} disabled={selectedUdaIds.length === 0 || selectedClasses.length === 0}  style={{ width: "100%" }}>
                            <span  style={{ marginRight: "0.5rem" }}>auto_awesome</span>
                            Genera Sequenze di Lezioni
                        </button>
                        {error && <p style={{color: "layers.sys.colors.error", fontSize: "0.875rem", marginTop: layers.ref.spacing['4'], textAlign: "center"}}>{error}</p>}
                    </div>
                </div>
            </details>

            {/* Lessons Archive */}
            <div >
                <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: layers.ref.spacing['8'], marginBottom: layers.ref.spacing['8']}}>
                    <h2 >Archivio Lezioni ({lessons.length})</h2>

                    {/* Filtri */}
                    <div style={{display: "flex", flexWrap: "wrap", gap: layers.ref.spacing['8']}}>
                        <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                            <select value={filterClass} onChange={e => setFilterClass(e.target.value)}  style={{ fontSize: "0.875rem" }}>
                                <option value="">Tutte le classi</option>
                                {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                            <select value={filterUda} onChange={e => setFilterUda(e.target.value)}  style={{ fontSize: "0.875rem" }}>
                                <option value="">Tutte le UDA</option>
                                {filteredUdas.map(u => <option key={u.id} value={u.title}>{u.title}</option>)}
                            </select>
                        </div>
                        {(filterClass || filterUda) && (
                            <button onClick={() => { setFilterClass(''); setFilterUda(''); }}  title="Rimuovi filtri">
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>filter_alt_off</span>
                            </button>
                        )}
                    </div>
                </div>

                <div style={{gap: layers.ref.spacing['3']}}>
                    {groupedLessonsByClass.length > 0 ? (
                        groupedLessonsByClass.map(([classKey, udaGroups]) => (
                            <details key={classKey}  open>
                                <summary style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)]est/30 }}>
                                    <span >Classe {classKey}</span>
                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>expand_more</span>
                                </summary>
                                <div >
                                    {Object.entries(udaGroups).map(([udaKey, lessonItems]) => (
                                        <details key={udaKey}  style={{border: "none", marginBottom: layers.ref.spacing['8']}} open={udaKey !== 'Lezioni Varie'}>
                                            <summary >
                                                <span  style={{color: "layers.sys.colors.primary"}}>{udaKey} ({lessonItems.length})</span>
                                                <span  style={{ fontSize: "0.875rem" }}>expand_more</span>
                                            </summary>
                                            <div  style={{gap: layers.ref.spacing['2']}}>
                                                {lessonItems.map(lesson => (
                                                    <div key={lesson.id} >
                                                        <div onClick={() => onViewLesson(lesson)} >
                                                            <p style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)] }} style={{ fontWeight: "500" }}>{lesson.contenuto}</p>
                                                            <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>{lesson.materia} • {lesson.tipoLezione || 'Lezione'}</p>
                                                        </div>
                                                        <button onClick={() => onStartClassroom(lesson.classe, lesson.materia, `archive-${Date.now()}`, lesson)}  style={{ flexShrink: "0" }}>
                                                            <span  style={{ fontSize: "0.875rem" }}>door_open</span>
                                                            Avvia
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </details>
                        ))
                    ) : (
                        <div >
                            <span >history_edu</span>
                            <p >Nessuna lezione trovata</p>
                            <p>Modifica i filtri o crea una nuova lezione.</p>
                        </div>
                    )}
                </div>
            </div>

            {isIdeaModalOpen && (
                <IdeaGeneratorModal
                    onClose={() => setIsIdeaModalOpen(false)}
                    onGenerate={(content) => setGeneratedIdeaContent(content)}
                    aiSettings={aiSettings}
                    userClasses={userClasses}
                    knowledgeBase={knowledgeBase}
                />
            )}

            {generatedIdeaContent && (
                <CreateLessonFromAiModal
                    content={generatedIdeaContent}
                    onClose={() => setGeneratedIdeaContent(null)}
                    onSave={(lessonData: Omit<Lezione, 'id' | 'svolta'>) => {
                        const newLesson: Lezione = {
                            ...lessonData,
                            id: `lesson-ai-${Date.now()}`,
                            svolta: false
                        };
                        onAddLessons([newLesson]);
                        alert("Lezione salvata in archivio!");
                        setGeneratedIdeaContent(null);
                    }}
                    userClasses={userClasses}
                    disciplines={settings ? settings.disciplines : []} // Safe access
                    students={[]}
                    pianiInclusione={{}}
                    aiSettings={aiSettings}
                    slots={slots}
                    onSchedule={(lesson: Lezione, slotKey: string) => {
                        onScheduleLesson({ ...lesson, slotKey });
                        alert("Lezione salvata e pianificata con successo!");
                        setGeneratedIdeaContent(null);
                    }}
                    curricula={curricula}
                />
            )}  
            </div>
        </div>
    );
};

export default LessonsPage;



