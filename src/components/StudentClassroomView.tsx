import React, { useState, useMemo } from 'react';
import { Studente, Lezione, KnowledgeBaseEntry, HomeworkSubmission, RegisterEntry, TimetableSettings } from '../types';
import { blobToBase64Parts, generateHomeworkPdf, viewPdfInNewTab } from '../utils/documentUtils';
import { useFileDrop } from '../hooks/useFileDrop';
import { TabGroup, M3Button, SectionHeader, M3ExpressiveCard, Avatar, M3Typography } from './ui';
import PinPadModal from './PinPadModal';

interface StudentClassroomViewProps {
    student: Studente;
    lessons: Lezione[];
    register: RegisterEntry[];
    kb: KnowledgeBaseEntry[];
    submissions: HomeworkSubmission[];
    onUploadSubmission: (submission: HomeworkSubmission) => void;
    onLogout: () => void;
    onExitMode?: () => void; 
    securityPin?: string;
    settings?: TimetableSettings; 
}

const StudentClassroomView: React.FC<StudentClassroomViewProps> = ({ 
    student, lessons, register, kb, submissions, onUploadSubmission, onLogout, onExitMode, securityPin = '0000', settings
}) => {
    const [activeTab, setActiveTab] = useState<'feed' | 'homework' | 'materials'>('feed');
    const [isExitMenuOpen, setIsExitMenuOpen] = useState(false);
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    // Filter relevant data
    const classLessons = useMemo(() => 
        lessons.filter(l => l.classe === student.classe).sort((a,b) => b.id.localeCompare(a.id)), 
    [lessons, student.classe]);

    const feedItems = useMemo(() => {
        const items = [];
        for (const entry of register) {
            if (entry.classe === student.classe && entry.status === 'finalized') {
                const lesson = lessons.find(l => l.id === entry.lessonId);
                if (lesson) {
                    items.push({
                        type: 'lesson',
                        date: entry.date,
                        title: lesson.materia,
                        content: lesson.contenuto,
                        homework: lesson.compiti,
                        id: lesson.id,
                        originalLesson: lesson
                    });
                }
            }
        }
        return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [register, lessons, student.classe]);

    const pendingHomework = useMemo(() => {
        return classLessons.filter(l => 
            l.compiti && 
            (l.svolta || register.some(r => r.lessonId === l.id && r.status === 'finalized')) &&
            !submissions.find(s => s.lessonId === l.id && s.studentId === student.id)
        );
    }, [classLessons, submissions, student.id, register]);

    const submittedHomework = useMemo(() => {
        return submissions.filter(s => s.studentId === student.id);
    }, [submissions, student.id]);

    const handleUpload = async (file: File, lessonId: string) => {
        try {
            const { data, mimeType } = await blobToBase64Parts(file);
            const submission: HomeworkSubmission = {
                id: `sub-${Date.now()}`,
                studentId: student.id,
                lessonId: lessonId,
                date: new Date().toISOString(),
                file: { name: file.name, data, mimeType },
                status: 'pending'
            };
            onUploadSubmission(submission);
        } catch (e) {
            console.error(e);
        }
    };
    
    const handleDownloadHomeworkSheet = async (lesson: Lezione) => {
        if (!settings) return;
        setIsGeneratingPdf(true);
        try {
            const blob = await generateHomeworkPdf(lesson, settings);
            viewPdfInNewTab(blob);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const UploadButton: React.FC<{ lessonId: string }> = ({ lessonId }) => {
        const onDrop = (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) handleUpload(acceptedFiles[0], lessonId);
        };
        const { getRootProps, getInputProps } = useFileDrop({ onDrop, multiple: false });
        return (
            <div {...getRootProps()} style={{
                backgroundColor: 'var(--md-sys-color-primary)',
                opacity: 'var(--md-sys-state-opacity-tint-hairline)',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                cursor: "pointer",
                padding: 'var(--md-sys-spacing-6)',
                textAlign: "center",
                transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)',
                marginTop: 'var(--md-sys-spacing-4)'
            }}>
                <input {...getInputProps()} />
                <span style={{color: "var(--md-sys-color-primary)", marginBottom: 'var(--md-sys-spacing-8)', transition: "transform var(--md-sys-motion-duration-medium)"}}>cloud_upload</span>
                <M3Typography variant="label-small" style={{textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--md-sys-color-primary)"}}>Carica Elaborato</M3Typography>
                <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', opacity: "var(--md-sys-state-opacity-secondary)", marginTop: 'var(--md-sys-spacing-4)'}}>Trascina qui il file o clicca per selezionare</M3Typography>
            </div>
        );
    }

    return (
        <div  style={{minHeight: "var(--md-sys-viewport-height-full)", display: "flex", flexDirection: "column", backgroundColor: 'var(--md-sys-color-surface)'}}>
            {/* Aura Ornaments */}
            <div style={{ backgroundColor: 'var(--md-sys-color-primary)', opacity: 0.05, borderRadius: 'var(--md-sys-spacing-4)' }} />
            <div style={{ backgroundColor: 'var(--md-sys-color-tertiary)', opacity: 0.05, borderRadius: 'var(--md-sys-spacing-4)' }} />

            <header style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', opacity: 'var(--md-sys-state-opacity-tint-moderate)', borderBottom: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)", padding: 'var(--md-sys-spacing-6)', display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}}>
                    <Avatar name={`${student.nome} ${student.cognome}`} size="md"  />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                        <M3Typography variant="headline-small" style={{ color: 'var(--md-sys-color-on-surface)', fontWeight: "var(--md-sys-typescale-weight-black)", letterSpacing: "-0.005em" }}>Diario di Classe</M3Typography>
                        <M3Typography variant="label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', textTransform: "uppercase", letterSpacing: "0.1em", opacity: "var(--md-sys-state-opacity-supporting)" }}>Classe {student.classe} • {student.nome} {student.cognome}</M3Typography>
                    </div>
                </div>
                <M3Button onClick={() => setIsExitMenuOpen(!isExitMenuOpen)} variant="tonal"  style={{color: "var(--md-sys-color-error)"}}>
                    <span style={{
}}>power_settings_new</span>
                </M3Button>
                
                {isExitMenuOpen && (
                    <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', opacity: 'var(--md-sys-state-opacity-hover-overlay)', borderRadius: 'var(--md-sys-shape-corner-large)', border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)", padding: 'var(--md-sys-spacing-6)', display: "flex", flexDirection: "column"}}>
                        <button 
                            onClick={() => { onLogout(); setIsExitMenuOpen(false); }}
                            style={{ color: 'var(--md-sys-color-on-surface)', borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-8)', textAlign: "left", display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', transition: "color var(--md-sys-motion-duration-medium)"}}
                        >
                            <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>logout</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                <M3Typography variant="label-small" style={{ fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Termina Sessione</M3Typography>
                                <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', opacity: "var(--md-sys-state-opacity-supporting)" }}>Torna al login studenti</M3Typography>
                            </div>
                        </button>
                        {onExitMode && (
                            <button 
                                onClick={() => { setIsPinModalOpen(true); setIsExitMenuOpen(false); }}
                                style={{ borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-8)', textAlign: "left", color: "var(--md-sys-color-error)", display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', transition: "color var(--md-sys-motion-duration-medium)", marginTop: 'var(--md-sys-spacing-4)'}}
                            >
                                <span style={{
}}>lock</span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                    <M3Typography variant="label-small" style={{ fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Menu Docente</M3Typography>
                                    <M3Typography variant="body-small" style={{ opacity: "var(--md-sys-state-opacity-supporting)" }}>Richiede PIN di sicurezza</M3Typography>
                                </div>
                            </button>
                        )}
                    </div>
                )}
                {isExitMenuOpen && <div  onClick={() => setIsExitMenuOpen(false)}></div>}
            </header>

            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', opacity: 'var(--md-sys-state-opacity-placeholder)', padding: 'var(--md-sys-spacing-8)', borderBottom: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)"}}>
                 <TabGroup 
                    activeTab={activeTab}
                    onTabChange={(id) => setActiveTab(id as 'feed' | 'homework' | 'materials')}
                    variant="secondary"
                    tabs={[
                        { id: 'feed', label: 'Attività', icon: 'feed' },
                        { id: 'homework', label: 'Compiti', icon: 'assignment', badge: pendingHomework.length || undefined },
                        { id: 'materials', label: 'Materiali', icon: 'folder' }
                    ]}
                />
            </div>

            <main  style={{flexGrow: "1", overflowY: "auto", padding: 'var(--md-sys-spacing-6)', gap: 'var(--md-sys-spacing-8)'}}>
                
                {activeTab === 'feed' && (
                    <div  style={{gap: 'var(--md-sys-spacing-6)', marginLeft: "var(--md-sys-margin-auto)", marginRight: "var(--md-sys-margin-auto)"}}>
                        {feedItems.length > 0 ? feedItems.map((item) => (
                            <M3ExpressiveCard 
                                key={item.id}
                                icon="feed"
                                title={item.title}
                                description={item.content}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)'}}>
                                        <span style={{ backgroundColor: 'var(--md-sys-color-secondary)', opacity: 'var(--md-sys-state-opacity-tint-faint)', fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--md-sys-color-secondary)", borderRadius: 'var(--md-sys-spacing-4)'}}>
                                            {new Date(item.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                                        </span>
                                        <span style={{fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", color: "var(--md-sys-color-primary)"}}>{item.title}</span>
                                    </div>
                                </div>
                                <M3Typography variant="headline-medium" style={{ color: 'var(--md-sys-color-on-surface)', fontWeight: "var(--md-sys-typescale-weight-black)", letterSpacing: "-0.005em" }}>{item.content}</M3Typography>
                                {item.homework && (
                                    <div style={{ backgroundColor: 'var(--md-sys-color-tertiary)', opacity: 0.05, borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-6)', border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)"}}>
                                        <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', color: "var(--md-sys-color-tertiary)"}}>
                                            <span  style={{ fontSize: "var(--md-sys-typescale-headline-small-font-size)" }}>home_work</span>
                                            <span style={{ fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Compito per casa</span>
                                        </div>
                                        <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', lineHeight: "1.625" }}>{item.homework}</M3Typography>
                                    </div>
                                )}
                                {settings && (
                                     <M3Button 
                                        onClick={() => handleDownloadHomeworkSheet(item.originalLesson)}
                                        disabled={isGeneratingPdf}
                                        variant="text"
                                        style={{ color: 'var(--md-sys-color-on-surface-variant)', width: "var(--md-sys-percent-100)", fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "0.1em" }}
                                     >
                                         <span  style={{ marginRight: "var(--md-sys-spacing-2)", fontSize: "var(--md-sys-typescale-body-large-font-size)" }}>print</span>
                                         {isGeneratingPdf ? 'Generazione PDF...' : 'Scarica Scheda Lezione'}
                                     </M3Button>
                                )}
                            </M3ExpressiveCard>
                        )) : (
                            <div style={{ padding: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surface-container-low)', opacity: 'var(--md-sys-state-opacity-tint-moderate)', borderRadius: 'var(--md-sys-shape-corner-large)', textAlign: "center", border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)"}}>
                                <span style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-8)', opacity: "var(--md-sys-state-opacity-tint-subtle)"}}>feed</span>
                                <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "var(--md-sys-state-opacity-empty)" }}>Nessuna attività recente nel registro.</M3Typography>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'homework' && (
                    <div  style={{ marginLeft: "var(--md-sys-margin-auto)", marginRight: "var(--md-sys-margin-auto)" }}>
                        
                        <div style={{gap: 'var(--md-sys-spacing-6)'}}>
                            <SectionHeader 
                                title={`Da Consegnare (${pendingHomework.length})`} 
                                icon="pending_actions" 
                                
                            />
                            <div style={{marginTop: 'var(--md-sys-spacing-4)'}}>
                                {pendingHomework.map(lesson => (
                                    <M3ExpressiveCard 
                                        key={lesson.id}
                                        icon="assignment"
                                        title={lesson.materia}
                                        description={lesson.contenuto}
                                    >
                                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 'var(--md-sys-spacing-8)'}}>
                                            <div style={{gap: 'var(--md-sys-spacing-1)'}}>
                                                <M3Typography variant="headline-small" style={{ fontWeight: "var(--md-sys-typescale-weight-black)", letterSpacing: "-0.005em" }}>{lesson.materia}</M3Typography>
                                                <M3Typography variant="label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "var(--md-sys-state-opacity-secondary)" }}>{lesson.contenuto}</M3Typography>
                                            </div>
                                            <span style={{ color: 'var(--md-sys-color-primary)', backgroundColor: 'var(--md-sys-color-primary)', opacity: 'var(--md-sys-state-opacity-tint-faint)', fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "0.1em", borderRadius: 'var(--md-sys-spacing-4)' }}>Nuovo</span>
                                        </div>
                                        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', opacity: 'var(--md-sys-state-opacity-placeholder)', borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-6)', fontSize: "var(--md-sys-typescale-body-large-font-size)", fontWeight: "var(--md-sys-typescale-weight-medium)", lineHeight: "1.625"}}>
                                            {lesson.compiti}
                                        </div>
                                        <UploadButton lessonId={lesson.id} />
                                    </M3ExpressiveCard>
                                ))}
                                {pendingHomework.length === 0 && (
                                    <div style={{ padding: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surface-container-low)', opacity: 'var(--md-sys-state-opacity-tint-moderate)', borderRadius: 'var(--md-sys-shape-corner-large)', border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)", textAlign: "center"}}>
                                        <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "var(--md-sys-state-opacity-empty)" }}>Nessun compito in sospeso.</M3Typography>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{gap: 'var(--md-sys-spacing-6)'}}>
                            <SectionHeader 
                                title="Storico Consegne" 
                                icon="history" 
                                
                            />
                            <div style={{gap: 'var(--md-sys-spacing-3)'}}>
                                {submittedHomework.map(sub => {
                                    const relatedLesson = lessons.find(l => l.id === sub.lessonId);
                                    return (
                                        <div key={sub.id} style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', opacity: 'var(--md-sys-state-opacity-placeholder)', borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-6)', border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "color var(--md-sys-motion-duration-medium)"}}>
                                            <div style={{gap: 'var(--md-sys-spacing-1)'}}>
                                                <M3Typography variant="label-small" style={{ fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{relatedLesson?.materia || 'Materia'}</M3Typography>
                                                <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "var(--md-sys-typescale-weight-medium)", opacity: "var(--md-sys-state-opacity-secondary)" }}>{new Date(sub.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}</M3Typography>
                                            </div>
                                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 'var(--md-sys-spacing-8)'}}>
                                                <span style={{
                                                    fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                                                    fontWeight: 'var(--md-sys-typescale-weight-black)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em',
                                                    padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-3)',
                                                    borderRadius: 'var(--md-sys-shape-corner-full)',
                                                    backgroundColor: sub.status === 'graded' ? 'var(--md-sys-color-secondary-container)' : 'var(--md-sys-color-tertiary-container)',
                                                    opacity: 'var(--md-sys-state-opacity-placeholder)',
                                                    color: sub.status === 'graded' ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-tertiary-container)'
                                                }}>
                                                    {sub.status === 'graded' ? 'Valutato' : 'In attesa'}
                                                </span>
                                                {sub.teacherFeedback && <span style={{fontSize: "var(--md-sys-typescale-body-small-font-size)", fontWeight: "var(--md-sys-typescale-weight-black)", color: "var(--md-sys-color-primary)"}}>Voto: {sub.teacherFeedback}</span>}
                                            </div>
                                        </div>
                                    )
                                })}
                                {submittedHomework.length === 0 && (
                                    <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', textAlign: "center", fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "var(--md-sys-state-opacity-empty)" }}>Nessuna consegna effettuata.</M3Typography>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'materials' && (
                     <div  style={{display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)", gap: 'var(--md-sys-spacing-6)', marginLeft: "var(--md-sys-margin-auto)", marginRight: "var(--md-sys-margin-auto)"}}>
                        {kb.map(entry => (
                            <M3ExpressiveCard 
                                key={entry.id}
                                icon={entry.fileName.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                                title={entry.fileName}
                                description={''}
                            >
                                <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-secondary)', opacity: 'var(--md-sys-state-opacity-tint-faint)', width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', color: "var(--md-sys-color-secondary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "color var(--md-sys-motion-duration-medium)"}}>
                                    <span style={{ color: 'var(--md-sys-color-secondary)' }}>
                                        {entry.fileName.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                                    </span>
                                </div>
                                <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "0.1em", lineHeight: "1.625" }}>{entry.fileName}</M3Typography>
                            </M3ExpressiveCard>
                        ))}
                        {kb.length === 0 && (
                            <div style={{ padding: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surface-container-low)', opacity: 'var(--md-sys-state-opacity-tint-moderate)', borderRadius: 'var(--md-sys-shape-corner-large)', textAlign: "center", border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)"}}>
                                <span style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-8)', opacity: "var(--md-sys-state-opacity-tint-subtle)"}}>folder_off</span>
                                <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "var(--md-sys-state-opacity-empty)" }}>Nessun materiale condiviso.</M3Typography>
                            </div>
                        )}
                     </div>
                )}

            </main>
            
            {isPinModalOpen && onExitMode && (
                <PinPadModal
                    title="Uscita Modalità Studente"
                    correctPin={securityPin}
                    onSuccess={() => { setIsPinModalOpen(false); onExitMode(); }}
                    onCancel={() => setIsPinModalOpen(false)}
                />
            )}
        </div>
    );
};

export default StudentClassroomView;

