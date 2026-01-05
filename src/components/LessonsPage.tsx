
import React, { useState, useMemo, useEffect } from 'react';
import { Lezione, LessonsPageProps, CurriculumSubject, TimetableSettings } from '../types';
import { generateLessonSequenceForClass } from '../services/aiService';
// import LessonView from './LessonView';
import IdeaGeneratorModal from './IdeaGeneratorModal';
import { CreateLessonFromAiModal } from './CreateLessonFromAiModal';

// Extend Interface locally if not updated in types.ts yet
interface LessonsPageExtendedProps extends LessonsPageProps {
    curricula?: CurriculumSubject[];
    settings?: TimetableSettings; // Added optional settings prop
}

const LessonsPage: React.FC<LessonsPageExtendedProps> = ({ lessons, udas, knowledgeBase, userClasses, onViewLesson, onAddLessons, onStartClassroom, aiSettings, setIsLoadingModalOpen, setLoadingModalMessage, slots, onScheduleLesson, curricula = [], settings }) => {
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
        <div className="pt-3 px-4 md:px-6">
            <div className="space-y-4">
            <div className="page-header-compact">
                <div className="page-header-title-group">
                    <h1 className="m3-headline-medium">Progetta Lezioni</h1>
                    <p className="page-subtitle">Genera e orchestra sequenze di lezioni partendo da UDA e classi.</p>
                </div>
            </div>

            {/* Expressive Idea Card */}
            <div
                className="hero-card"
                onClick={() => setIsIdeaModalOpen(true)}
            >
                <div className="hero-header">
                    <div className="hero-icon-bg">
                        <span className="material-symbols-outlined">lightbulb</span>
                    </div>
                    <div>
                        <h2 className="m3-headline-small">Hai un'idea per una lezione?</h2>
                        <p className="m3-body-medium opacity-90">
                            Tocca qui per trasformarla subito in un piano strutturato con l'AI. Dettala o scrivila.
                        </p>
                    </div>
                </div>
            </div>


            {/* Lesson Sequence Generator */}
            <details className="m3-expansion-panel">
                <summary className="m3-expansion-summary">
                    <div className="flex items-center gap-8">
                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                        <span className="m3-title-medium">Generatore Sequenze Lezioni</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
                </summary>
                <div className="m3-expansion-content">
                    <p className="m3-body-medium text-on-surface-variant mb-8">
                        Seleziona le Unità di Apprendimento (UDA) e le classi. L'AI genererà una sequenza di lezioni strutturata per ogni classe, basandosi sui documenti KB selezionati.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* UDA Selection */}
                        <div className="section-container">
                            <h3 className="m3-title-medium mb-8">1. Seleziona UDA</h3>
                            {/* Centralized Selection Container */}
                            <div className="selection-container max-h-[200px] border-none p-0 overflow-y-auto custom-scrollbar">
                                {udas.length > 0 ? udas.map(uda => (
                                    <div key={uda.id} className="chip-checkbox">
                                        <input type="checkbox" id={`uda-select-${uda.id}`} checked={selectedUdaIds.includes(uda.id)} onChange={() => handleUdaSelection(uda.id)} />
                                        <label htmlFor={`uda-select-${uda.id}`} className="chip w-full justify-start">{selectedUdaIds.includes(uda.id) && <span className="material-symbols-outlined text-lg">check</span>}{uda.title}</label>
                                    </div>
                                )) : <p className="m3-body-small text-on-surface-variant">Nessuna UDA trovata. Creane una nel Planner.</p>}
                            </div>
                        </div>
                        {/* Class Selection */}
                        <div className="section-container">
                            <h3 className="m3-title-medium mb-8">2. Seleziona Classi</h3>
                            {/* Centralized Selection Container */}
                            <div className="selection-container max-h-[200px] border-none p-0 overflow-y-auto custom-scrollbar">
                                {userClasses.map(c => (
                                    <div key={c} className="chip-checkbox">
                                        <input type="checkbox" id={`class-select-${c}`} checked={selectedClasses.includes(c)} onChange={() => handleClassSelection(c)} />
                                        <label htmlFor={`class-select-${c}`} className="chip w-full justify-start">{selectedClasses.includes(c) && <span className="material-symbols-outlined text-lg">check</span>}{c}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* KB Selection */}
                        <div className="section-container">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="m3-title-medium">3. Contesto KB</h3>
                                <span className="text-xs text-on-surface-variant">{selectedKbIds.length} selezionati</span>
                            </div>
                            <div className="selection-container max-h-[200px] border-none p-0 overflow-y-auto custom-scrollbar">
                                {knowledgeBase.map(kb => (
                                    <div key={kb.id} className="chip-checkbox">
                                        <input type="checkbox" id={`kb-select-${kb.id}`} checked={selectedKbIds.includes(kb.id)} onChange={() => handleKbSelection(kb.id)} />
                                        <label htmlFor={`kb-select-${kb.id}`} className="chip w-full justify-start" title={kb.fileName}>
                                            {selectedKbIds.includes(kb.id) && <span className="material-symbols-outlined text-lg">check</span>}
                                            <span className="material-symbols-outlined text-primary mr-1 text-base">{kb.isGenerated ? 'auto_awesome' : 'description'}</span>
                                            <span className="truncate">{kb.fileName}</span>
                                        </label>
                                    </div>
                                ))}
                                {knowledgeBase.length === 0 && <p className="m3-body-small text-on-surface-variant italic">KB vuota.</p>}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button onClick={handleGenerateSequences} disabled={selectedUdaIds.length === 0 || selectedClasses.length === 0} className="button button-filled w-full">
                            <span className="material-symbols-outlined mr-2">auto_awesome</span>
                            Genera Sequenze di Lezioni
                        </button>
                        {error && <p className="text-error text-sm mt-4 text-center">{error}</p>}
                    </div>
                </div>
            </details>

            {/* Lessons Archive */}
            <div className="card">
                <div className="flex flex-wrap justify-between items-center gap-8 mb-8">
                    <h2 className="m3-title-large">Archivio Lezioni ({lessons.length})</h2>

                    {/* Filtri */}
                    <div className="flex flex-wrap gap-8">
                        <div className="flex items-center gap-8">
                            <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="form-select py-1 pr-8 text-sm !h-10">
                                <option value="">Tutte le classi</option>
                                {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-8">
                            <select value={filterUda} onChange={e => setFilterUda(e.target.value)} className="form-select py-1 pr-8 text-sm !h-10">
                                <option value="">Tutte le UDA</option>
                                {filteredUdas.map(u => <option key={u.id} value={u.title}>{u.title}</option>)}
                            </select>
                        </div>
                        {(filterClass || filterUda) && (
                            <button onClick={() => { setFilterClass(''); setFilterUda(''); }} className="button button-text !py-1 !px-4" title="Rimuovi filtri">
                                <span className="material-symbols-outlined">filter_alt_off</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    {groupedLessonsByClass.length > 0 ? (
                        groupedLessonsByClass.map(([classKey, udaGroups]) => (
                            <details key={classKey} className="m3-expansion-panel" open>
                                <summary className="m3-expansion-summary bg-surface-container-highest/30">
                                    <span className="m3-title-medium">Classe {classKey}</span>
                                    <span className="material-symbols-outlined">expand_more</span>
                                </summary>
                                <div className="m3-expansion-content !p-8">
                                    {Object.entries(udaGroups).map(([udaKey, lessonItems]) => (
                                        <details key={udaKey} className="m3-expansion-panel border-none shadow-none mb-8" open={udaKey !== 'Lezioni Varie'}>
                                            <summary className="m3-expansion-summary !bg-transparent !px-4 !py-4">
                                                <span className="m3-label-large text-primary">{udaKey} ({lessonItems.length})</span>
                                                <span className="material-symbols-outlined text-sm">expand_more</span>
                                            </summary>
                                            <div className="pl-2 space-y-2 border-l-2 border-outline-variant ml-4 pb-2">
                                                {lessonItems.map(lesson => (
                                                    <div key={lesson.id} className="m3-list-item-card !p-6 !bg-surface-container-lowest">
                                                        <div onClick={() => onViewLesson(lesson)} className="list-item-card-content">
                                                            <p className="m3-body-medium font-medium">{lesson.contenuto}</p>
                                                            <p className="m3-body-small text-on-surface-variant">{lesson.materia} • {lesson.tipoLezione || 'Lezione'}</p>
                                                        </div>
                                                        <button onClick={() => onStartClassroom(lesson.classe, lesson.materia, `archive-${Date.now()}`, lesson)} className="button button-tonal !h-8 !px-3 !text-xs flex-shrink-0">
                                                            <span className="material-symbols-outlined mr-1 text-sm">door_open</span>
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
                        <div className="empty-state-box">
                            <span className="material-symbols-outlined empty-state-icon">history_edu</span>
                            <p className="m3-title-medium">Nessuna lezione trovata</p>
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
