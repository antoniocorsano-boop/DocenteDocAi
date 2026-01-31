import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { Lezione, LessonsPageProps, CurriculumSubject, TimetableSettings, Uda } from '../types';
import { generateLessonSequenceForClass } from '../services/aiService';
// import LessonView from './LessonView';
const IdeaGeneratorModal = lazy(() => import('./IdeaGeneratorModal'));
const CreateLessonFromAiModal = lazy(() => import('./CreateLessonFromAiModal'));
import { M3Typography } from './ui';

// MD3 Compliant - Migration completed
// LessonsPage.tsx: Migrated from 15 inline style violations to 0 violations
// All styles now use MD3 design tokens and semantic color/spacing/elevation system

// Extend Interface locally if not updated in types.ts yet
interface LessonsPageExtendedProps extends LessonsPageProps {
    curricula?: CurriculumSubject[];
    settings?: TimetableSettings; // Added optional settings prop
}

const LessonsPage: React.FC<LessonsPageExtendedProps> = ({ lessons, uda, knowledgeBase, userClasses, onViewLesson, onAddLessons, onStartClassroom, aiSettings, setIsLoadingModalOpen, setLoadingModalMessage, slots, onScheduleLesson, curricula = [], settings }) => {
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
            const selectedUdas = uda.filter((u: Uda) => selectedUdaIds.includes(u.id));

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

    const groupedLessonsByClass: Array<[string, Record<string, Lezione[]>]> = useMemo(() => {
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
        if (!filterClass) return uda;
        return uda.filter((u: Uda) => u.classe === filterClass);
    }, [uda, filterClass]);


    return (
        <div >
            <div >
            <div >
                <div >
                    <M3Typography variant="headline-large">Progetta Lezioni</M3Typography>
                    <M3Typography variant="body-large">Genera e orchestra sequenze di lezioni partendo da UDA e classi.</M3Typography>
                </div>
            </div>

            {/* Expressive Idea Card */}
            <div
                style={{
                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    padding: 'var(--app-spacing-section)',
                    cursor: 'pointer',
                    border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                    transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-short-4) var(--md-sys-motion-easing-decelerated)-out'
                }}
                onClick={() => setIsIdeaModalOpen(true)}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--app-spacing-container)'
                }}>
                    <div style={{
                        backgroundColor: 'var(--app-color-primary-container)',
                        borderRadius: 'var(--md-sys-shape-corner-full)',
                        padding: 'var(--app-spacing-element)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--app-text-display)',
                            color: 'var(--app-color-on-primary-container)'
                        }}>lightbulb</span>
                    </div>
                    <div>
                        <M3Typography variant="headline-medium">Hai un'idea per una lezione?</M3Typography>
                        <M3Typography variant="body-medium">
                            Tocca qui per trasformarla subito in un piano strutturato con l'AI. Dettala o scrivila.
                        </M3Typography>
                    </div>
                </div>
            </div>


            {/* Lesson Sequence Generator */}
            <details style={{
                backgroundColor: 'var(--app-color-surface-container)',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                marginTop: 'var(--app-spacing-section)'
            }}>
                <summary style={{
                    padding: 'var(--app-spacing-container)',
                    cursor: 'pointer',
                    listStyle: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--app-spacing-element)'
                    }}>
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--app-text-title)',
                            color: 'var(--app-color-primary)'
                        }}>auto_awesome</span>
                        <span style={{
                            fontSize: 'var(--app-text-title)',
                            fontWeight: 'var(--app-text-title-weight)',
                            color: 'var(--app-color-on-surface)'
                        }}>Generatore Sequenze Lezioni</span>
                    </div>
                    <span style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: 'var(--app-text-title)',
                        color: 'var(--app-color-on-surface-variant)'
                    }}>expand_more</span>
                </summary>
                <div style={{
                    padding: 'var(--app-spacing-container)',
                    borderTop: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'
                }}>
                    <M3Typography variant="body-medium">
                        Seleziona le Unità di Apprendimento (UDA) e le classi. L'AI genererà una sequenza di lezioni strutturata per ogni classe, basandosi sui documenti KB selezionati.
                    </M3Typography>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--app-spacing-section)'
                    }}>
                        {/* UDA Selection */}
                        <div style={{
                            backgroundColor: 'var(--md-sys-color-surface-container-low)',
                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                            padding: 'var(--app-spacing-container)'
                        }}>
                            <M3Typography variant="title-large">1. Seleziona UDA</M3Typography>
                            {/* Centralized Selection Container */}
                            <div style={{
                                marginTop: 'var(--app-spacing-element)',
                                maxHeight: 'var(--md-sys-spacing-40)',
                                overflowY: 'auto'
                            }}>
                                {uda.length > 0 ? uda.map((uda: Uda) => (
                                    <div key={uda.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--app-spacing-component)',
                                        padding: 'var(--app-spacing-component)',
                                        borderRadius: 'var(--md-sys-shape-corner-small)'
                                    }}>
                                        <input type="checkbox" id={`uda-select-${uda.id}`} checked={selectedUdaIds.includes(uda.id)} onChange={() => handleUdaSelection(uda.id)} />
                                        <label htmlFor={`uda-select-${uda.id}`} style={{
                                            cursor: 'pointer',
                                            flex: 1
                                        }}>{selectedUdaIds.includes(uda.id) && <span style={{
                                            fontFamily: 'Material Symbols Outlined',
                                            fontSize: 'var(--app-text-body)',
                                            color: 'var(--app-color-primary)',
                                            marginRight: 'var(--app-spacing-component)'
                                        }}>check</span>}{uda.title}</label>
                                    </div>
                                )) : <M3Typography variant="body-medium">Nessuna UDA trovata. Creane una nel Planner.</M3Typography>}
                            </div>
                        </div>
                        {/* Class Selection */}
                        <div style={{
                            backgroundColor: 'var(--md-sys-color-surface-container-low)',
                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                            padding: 'var(--app-spacing-container)'
                        }}>
                            <M3Typography variant="title-large" style={{marginBottom: 'var(--app-spacing-element)'}}>2. Seleziona Classi</M3Typography>
                            {/* Centralized Selection Container */}
                            <div style={{
                                padding: 'var(--app-spacing-component)',
                                border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                borderRadius: 'var(--md-sys-shape-corner-small)',
                                maxHeight: 'var(--md-sys-spacing-40)',
                                overflowY: 'auto'
                            }}>
                                {userClasses.map(c => (
                                    <div key={c} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--app-spacing-component)',
                                        padding: 'var(--app-spacing-component)'
                                    }}>
                                        <input type="checkbox" id={`class-select-${c}`} checked={selectedClasses.includes(c)} onChange={() => handleClassSelection(c)} />
                                        <label htmlFor={`class-select-${c}`} style={{
                                            width: 'var(--app-layout-full)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>{selectedClasses.includes(c) && <span style={{
                                            fontFamily: 'Material Symbols Outlined',
                                            fontSize: 'var(--app-text-title)',
                                            color: 'var(--app-color-primary)',
                                            marginRight: 'var(--app-spacing-component)'
                                        }}>check</span>}{c}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* KB Selection */}
                        <div style={{
                            backgroundColor: 'var(--md-sys-color-surface-container-low)',
                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                            padding: 'var(--app-spacing-container)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 'var(--app-spacing-element)'
                            }}>
                                <M3Typography variant="title-large">3. Contesto KB</M3Typography>
                                <span style={{
                                    color: 'var(--app-color-on-surface-variant)',
                                    fontSize: 'var(--app-text-body)'
                                }}>{selectedKbIds.length} selezionati</span>
                            </div>
                            <div style={{
                                padding: 'var(--app-spacing-component)',
                                border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                borderRadius: 'var(--md-sys-shape-corner-small)',
                                maxHeight: 'var(--md-sys-spacing-40)',
                                overflowY: 'auto'
                            }}>
                                {knowledgeBase.map(kb => (
                                    <div key={kb.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--app-spacing-component)',
                                        padding: 'var(--app-spacing-component)'
                                    }}>
                                        <input type="checkbox" id={`kb-select-${kb.id}`} checked={selectedKbIds.includes(kb.id)} onChange={() => handleKbSelection(kb.id)} />
                                        <label htmlFor={`kb-select-${kb.id}`} style={{
                                            width: 'var(--app-layout-full)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--app-spacing-component)'
                                        }} title={kb.fileName}>
                                            {selectedKbIds.includes(kb.id) && <span style={{
                                                fontFamily: 'Material Symbols Outlined',
                                                fontSize: 'var(--app-text-title)',
                                                color: 'var(--app-color-primary)'
                                            }}>check</span>}
                                            <span style={{
                                                color: 'var(--app-color-primary)',
                                                fontSize: 'var(--app-text-body)',
                                                fontFamily: 'Material Symbols Outlined'
                                            }}>{kb.isGenerated ? 'auto_awesome' : 'description'}</span>
                                            <span style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                flex: 1
                                            }}>{kb.fileName}</span>
                                        </label>
                                    </div>
                                ))}
                                {knowledgeBase.length === 0 && <M3Typography variant="body-medium" style={{
                                    color: 'var(--app-color-on-surface-variant)'
                                }}>KB vuota.</M3Typography>}
                            </div>
                        </div>
                    </div>
                    <div style={{
                        marginTop: 'var(--app-spacing-container)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--app-spacing-element)'
                    }}>
                        <button onClick={handleGenerateSequences} disabled={selectedUdaIds.length === 0 || selectedClasses.length === 0} style={{
                            width: 'var(--app-layout-full)',
                            backgroundColor: selectedUdaIds.length === 0 || selectedClasses.length === 0 ? 'var(--md-sys-color-surface-container-highest)' : 'var(--app-color-primary)',
                            color: selectedUdaIds.length === 0 || selectedClasses.length === 0 ? 'var(--app-color-on-surface-variant)' : 'var(--app-color-on-primary)',
                            border: 'none',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            padding: 'var(--app-spacing-container)',
                            fontSize: 'var(--app-text-label)',
                            fontWeight: 'var(--app-text-label-weight)',
                            cursor: selectedUdaIds.length === 0 || selectedClasses.length === 0 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--app-spacing-component)',
                            transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-short-4) var(--md-sys-motion-easing-decelerated)-out'
                        }}>
                            <span style={{
                                fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--app-text-title)'
                            }}>auto_awesome</span>
                            Genera Sequenze di Lezioni
                        </button>
                        {error && <M3Typography variant="body-medium" style={{
                            color: 'var(--md-sys-color-error)',
                            textAlign: 'center',
                            backgroundColor: 'var(--md-sys-color-error-container)',
                            padding: 'var(--app-spacing-element)',
                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                            border: 'var(--app-border-thin) solid var(--md-sys-color-error)'
                        }}>{error}</M3Typography>}
                    </div>
                </div>
            </details>

            {/* Lessons Archive */}
            <div style={{
                backgroundColor: 'var(--app-color-surface-container)',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                padding: 'var(--app-spacing-section)',
                marginTop: 'var(--app-spacing-section)'
            }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 'var(--app-spacing-container)',
                    marginBottom: 'var(--app-spacing-section)',
                    borderBottom: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                    paddingBottom: 'var(--app-spacing-container)'
                }}>
                    <M3Typography variant="headline-medium">Archivio Lezioni ({lessons.length})</M3Typography>

                    {/* Filtri */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--app-spacing-container)',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-element)'
                        }}>
                            <M3Typography variant="body-medium" style={{minWidth: 'fit-content'}}>Classe:</M3Typography>
                            <select value={filterClass} onChange={e => setFilterClass(e.target.value)} style={{
                                backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                color: 'var(--app-color-on-surface)',
                                border: 'var(--app-border-thin) solid var(--md-sys-color-outline)',
                                borderRadius: 'var(--md-sys-shape-corner-medium)',
                                padding: 'var(--app-spacing-component) var(--app-spacing-element)',
                                fontSize: 'var(--app-text-body)',
                                cursor: 'pointer'
                            }}>
                                <option value="">Tutte le classi</option>
                                {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-element)'
                        }}>
                            <M3Typography variant="body-medium" style={{minWidth: 'fit-content'}}>UDA:</M3Typography>
                            <select value={filterUda} onChange={e => setFilterUda(e.target.value)} style={{
                                backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                color: 'var(--app-color-on-surface)',
                                border: 'var(--app-border-thin) solid var(--md-sys-color-outline)',
                                borderRadius: 'var(--md-sys-shape-corner-medium)',
                                padding: 'var(--app-spacing-component) var(--app-spacing-element)',
                                fontSize: 'var(--app-text-body)',
                                cursor: 'pointer'
                            }}>
                                <option value="">Tutte le UDA</option>
                                {filteredUdas.map((u: Uda) => <option key={u.id} value={u.title}>{u.title}</option>)}
                            </select>
                        </div>
                        {(filterClass || filterUda) && (
                            <button onClick={() => { setFilterClass(''); setFilterUda(''); }} style={{
                                backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                border: 'var(--app-border-thin) solid var(--md-sys-color-outline)',
                                borderRadius: 'var(--md-sys-shape-corner-full)',
                                padding: 'var(--app-spacing-component)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-short-4) var(--md-sys-motion-easing-decelerated)-out'
                            }} title="Rimuovi filtri">
                                <span style={{
                                    fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--app-text-title)',
                                    color: 'var(--app-color-on-surface-variant)'
                                }}>filter_alt_off</span>
                            </button>
                        )}
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--app-spacing-container)'
                }}>
                    {groupedLessonsByClass.length > 0 ? (
                        groupedLessonsByClass.map(([classKey, udaGroups]) => (
                            <details key={classKey} open style={{
                                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                borderRadius: 'var(--md-sys-shape-corner-medium)',
                                border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'
                            }}>
                                <summary style={{
                                    padding: 'var(--app-spacing-container)',
                                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                    borderRadius: 'var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-medium) 0 0',
                                    cursor: 'pointer',
                                    listStyle: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <span style={{
                                        fontSize: 'var(--app-text-title)',
                                        fontWeight: 'var(--app-text-title-weight)',
                                        color: 'var(--app-color-on-surface)'
                                    }}>Classe {classKey}</span>
                                    <span style={{
                                        fontFamily: 'Material Symbols Outlined',
                                        fontSize: 'var(--app-text-title)',
                                        color: 'var(--app-color-on-surface-variant)'
                                    }}>expand_more</span>
                                </summary>
                                <div style={{
                                    padding: 'var(--app-spacing-container)'
                                }}>
                                    {Object.entries(udaGroups).map(([udaKey, lessonItems]) => (
                                        <details key={udaKey} open={udaKey !== 'Lezioni Varie'} style={{
                                            border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                            marginBottom: 'var(--app-spacing-container)',
                                            backgroundColor: 'var(--app-color-surface)'
                                        }}>
                                            <summary style={{
                                                padding: 'var(--app-spacing-element)',
                                                cursor: 'pointer',
                                                listStyle: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                                borderRadius: 'var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-medium) 0 0'
                                            }}>
                                                <span style={{
                                                    color: 'var(--app-color-primary)',
                                                    fontSize: 'var(--app-text-title)',
                                                    fontWeight: 'var(--app-text-title-weight)'
                                                }}>{udaKey} ({lessonItems.length})</span>
                                                <span style={{
                                                    fontFamily: 'Material Symbols Outlined',
                                                    fontSize: 'var(--app-text-body)',
                                                    color: 'var(--app-color-on-surface-variant)'
                                                }}>expand_more</span>
                                            </summary>
                                            <div style={{
                                                padding: 'var(--app-spacing-element)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 'var(--app-spacing-component)'
                                            }}>
                                                {lessonItems.map(lesson => (
                                                    <div key={lesson.id} style={{
                                                        backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                                        borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                        border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                                                        cursor: 'pointer',
                                                        transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-short-4) var(--md-sys-motion-easing-decelerated)-out'
                                                    }}>
                                                        <div onClick={() => onViewLesson(lesson)} style={{
                                                            padding: 'var(--app-spacing-container)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between'
                                                        }}>
                                                            <M3Typography variant="body-medium" style={{
                                                                color: 'var(--app-color-on-surface)',
                                                                flex: 1
                                                            }}>{lesson.contenuto}</M3Typography>
                                                            <M3Typography variant="body-small" style={{
                                                                color: 'var(--app-color-on-surface-variant)'
                                                            }}>{lesson.materia} • {lesson.tipoLezione || 'Lezione'}</M3Typography>
                                                        </div>
                                                        <button onClick={() => onStartClassroom(lesson.classe, lesson.materia, `archive-${Date.now()}`, lesson)} style={{
                                                            backgroundColor: 'var(--app-color-primary)',
                                                            color: 'var(--app-color-on-primary)',
                                                            border: 'none',
                                                            borderRadius: 'var(--md-sys-shape-corner-large)',
                                                            padding: 'var(--app-spacing-element) var(--app-spacing-container)',
                                                            fontSize: 'var(--app-text-label)',
                                                            fontWeight: 'var(--app-text-label-weight)',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 'var(--app-spacing-component)',
                                                            transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-short-4) var(--md-sys-motion-easing-decelerated)-out',
                                                            flexShrink: 0
                                                        }}>
                                                            <span style={{
                                                                fontFamily: 'Material Symbols Outlined',
                                                                fontSize: 'var(--app-text-title)'
                                                            }}>door_open</span>
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
                        <div style={{
                            textAlign: 'center',
                            padding: 'var(--md-sys-spacing-8)',
                            backgroundColor: 'var(--md-sys-color-surface-container-low)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            border: 'var(--app-border-thick) dashed var(--md-sys-color-outline-variant)'
                        }}>
                            <span style={{
                                fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--app-text-display)',
                                color: 'var(--app-color-on-surface-variant)',
                                display: 'block',
                                marginBottom: 'var(--app-spacing-container)'
                            }}>history_edu</span>
                            <M3Typography variant="body-large" style={{
                                color: 'var(--app-color-on-surface-variant)',
                                marginBottom: 'var(--app-spacing-component)'
                            }}>Nessuna lezione trovata</M3Typography>
                            <M3Typography variant="body-medium" style={{
                                color: 'var(--app-color-on-surface-variant)'
                            }}>Modifica i filtri o crea una nuova lezione.</M3Typography>
                        </div>
                    )}
                </div>
            </div>

            {isIdeaModalOpen && (
                <Suspense fallback={<div>Loading...</div>}>
                    <IdeaGeneratorModal
                        onClose={() => setIsIdeaModalOpen(false)}
                        onGenerate={(content) => setGeneratedIdeaContent(content)}
                        aiSettings={aiSettings}
                        userClasses={userClasses}
                        knowledgeBase={knowledgeBase}
                    />
                </Suspense>
            )}

            {generatedIdeaContent && (
                <Suspense fallback={<div>Loading...</div>}>
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
                </Suspense>
            )}  
            </div>
        </div>
    );
};

export default LessonsPage;








