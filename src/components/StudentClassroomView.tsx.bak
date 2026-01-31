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
                backgroundColor: 'var(--app-color-primary)',
                opacity: 0.05,
                borderRadius: 'var(--md-sys-shape-corner-large)',
                cursor: "pointer",
                padding: 'var(--app-spacing-section)',
                textAlign: "center",
                transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-standard) var(--app-easing-standard)',
                marginTop: 'var(--app-spacing-container)'
            }}>
                <input {...getInputProps()} />
                <span style={{color: "var(--app-color-primary)", marginBottom: 'var(--md-sys-spacing-8)', transition: "transform var(--app-motion-standard)"}}>cloud_upload</span>
                <M3Typography variant="label-small" style={{textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--app-color-primary)"}}>Carica Elaborato</M3Typography>
                <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', opacity: "0.6", marginTop: 'var(--app-spacing-container)'}}>Trascina qui il file o clicca per selezionare</M3Typography>
            </div>
        );
    }

    return (
        <div  style={{minHeight: "var(--md-sys-viewport-height-full)", display: "flex", flexDirection: "column", backgroundColor: 'var(--app-color-surface)'}}>
            {/* Aura Ornaments */}
            <div style={{ backgroundColor: 'var(--app-color-primary)', opacity: 0.05, borderRadius: 'var(--app-spacing-container)' }} />
            <div style={{ backgroundColor: 'var(--md-sys-color-tertiary)', opacity: 0.05, borderRadius: 'var(--app-spacing-container)' }} />

            <header style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', opacity: 0.3, borderBottom: "var(--app-border-normal) solid var(--md-sys-color-outline)", padding: 'var(--app-spacing-section)', display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}}>
                    <Avatar name={`${student.nome} ${student.cognome}`} size="md"  />
                    <div >
                        <M3Typography variant="headline-small" style={{ color: 'var(--app-color-on-surface)', fontWeight: "900", letterSpacing: "-0.005em" }}>Diario di Classe</M3Typography>
                        <M3Typography variant="label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.7" }}>Classe {student.classe} • {student.nome} {student.cognome}</M3Typography>
                    </div>
                </div>
                <M3Button onClick={() => setIsExitMenuOpen(!isExitMenuOpen)} variant="tonal"  style={{color: "var(--md-sys-color-error)"}}>
                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>power_settings_new</span>
                </M3Button>
                
                {isExitMenuOpen && (
                    <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', opacity: 0.9, borderRadius: 'var(--md-sys-shape-corner-large)', border: "var(--app-border-normal) solid var(--md-sys-color-outline)", padding: 'var(--app-spacing-section)', display: "flex", flexDirection: "column"}}>
                        <button 
                            onClick={() => { onLogout(); setIsExitMenuOpen(false); }}
                            style={{ color: 'var(--app-color-on-surface)', borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-8)', textAlign: "left", display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', transition: "color var(--app-motion-standard)"}}
                        >
                            <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>logout</span>
                            <div >
                                <M3Typography variant="label-small" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>Termina Sessione</M3Typography>
                                <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', opacity: "0.7" }}>Torna al login studenti</M3Typography>
                            </div>
                        </button>
                        {onExitMode && (
                            <button 
                                onClick={() => { setIsPinModalOpen(true); setIsExitMenuOpen(false); }}
                                style={{ borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-8)', textAlign: "left", color: "var(--md-sys-color-error)", display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', transition: "color var(--app-motion-standard)", marginTop: 'var(--app-spacing-container)'}}
                            >
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>lock</span>
                                <div >
                                    <M3Typography variant="label-small" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>Menu Docente</M3Typography>
                                    <M3Typography variant="body-small" style={{ opacity: "0.7" }}>Richiede PIN di sicurezza</M3Typography>
                                </div>
                            </button>
                        )}
                    </div>
                )}
                {isExitMenuOpen && <div  onClick={() => setIsExitMenuOpen(false)}></div>}
            </header>

            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', opacity: 0.5, padding: 'var(--md-sys-spacing-8)', borderBottom: "var(--app-border-normal) solid var(--md-sys-color-outline)"}}>
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

            <main  style={{flexGrow: "1", overflowY: "auto", padding: 'var(--app-spacing-section)', gap: 'var(--md-sys-spacing-8)'}}>
                
                {activeTab === 'feed' && (
                    <div  style={{gap: 'var(--app-spacing-section)', marginLeft: "var(--app-layout-auto)", marginRight: "var(--app-layout-auto)"}}>
                        {feedItems.length > 0 ? feedItems.map((item) => (
                            <M3ExpressiveCard 
                                key={item.id}
                                icon="feed"
                                title={item.title}
                                description={item.content}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{display: "flex", alignItems: "center", gap: 'var(--app-spacing-section)'}}>
                                        <span style={{ backgroundColor: 'var(--app-color-secondary)', opacity: 0.1, fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--app-color-secondary)", borderRadius: 'var(--app-spacing-container)'}}>
                                            {new Date(item.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                                        </span>
                                        <span style={{fontWeight: "900", textTransform: "uppercase", color: "var(--app-color-primary)"}}>{item.title}</span>
                                    </div>
                                </div>
                                <M3Typography variant="headline-medium" style={{ color: 'var(--app-color-on-surface)', fontWeight: "900", letterSpacing: "-0.005em" }}>{item.content}</M3Typography>
                                {item.homework && (
                                    <div style={{ backgroundColor: 'var(--md-sys-color-tertiary)', opacity: 0.05, borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--app-spacing-section)', border: "var(--app-border-normal) solid var(--md-sys-color-outline)"}}>
                                        <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', color: "var(--md-sys-color-tertiary)"}}>
                                            <span  style={{ fontSize: "var(--md-sys-typescale-headline-small-size)" }}>home_work</span>
                                            <span style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>Compito per casa</span>
                                        </div>
                                        <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', lineHeight: "1.625" }}>{item.homework}</M3Typography>
                                    </div>
                                )}
                                {settings && (
                                     <M3Button 
                                        onClick={() => handleDownloadHomeworkSheet(item.originalLesson)}
                                        disabled={isGeneratingPdf}
                                        variant="text"
                                        style={{ color: 'var(--md-sys-color-on-surface-variant)', width: "var(--app-layout-full)", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}
                                     >
                                         <span  style={{ marginRight: "var(--app-spacing-component)", fontSize: "var(--md-sys-typescale-body-large-size)" }}>print</span>
                                         {isGeneratingPdf ? 'Generazione PDF...' : 'Scarica Scheda Lezione'}
                                     </M3Button>
                                )}
                            </M3ExpressiveCard>
                        )) : (
                            <div style={{ padding: 'var(--app-spacing-container)', backgroundColor: 'var(--md-sys-color-surface-container-low)', opacity: 0.3, borderRadius: 'var(--md-sys-shape-corner-large)', textAlign: "center", border: "var(--app-border-normal) solid var(--md-sys-color-outline)"}}>
                                <span style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-8)', opacity: "0.2"}}>feed</span>
                                <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.4" }}>Nessuna attività recente nel registro.</M3Typography>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'homework' && (
                    <div  style={{ marginLeft: "var(--app-layout-auto)", marginRight: "var(--app-layout-auto)" }}>
                        
                        <div style={{gap: 'var(--app-spacing-section)'}}>
                            <SectionHeader 
                                title={`Da Consegnare (${pendingHomework.length})`} 
                                icon="pending_actions" 
                                
                            />
                            <div style={{marginTop: 'var(--app-spacing-container)'}}>
                                {pendingHomework.map(lesson => (
                                    <M3ExpressiveCard 
                                        key={lesson.id}
                                        icon="assignment"
                                        title={lesson.materia}
                                        description={lesson.contenuto}
                                    >
                                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 'var(--md-sys-spacing-8)'}}>
                                            <div style={{gap: 'var(--md-sys-spacing-1)'}}>
                                                <M3Typography variant="headline-small" style={{ fontWeight: "900", letterSpacing: "-0.005em" }}>{lesson.materia}</M3Typography>
                                                <M3Typography variant="label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.6" }}>{lesson.contenuto}</M3Typography>
                                            </div>
                                            <span style={{ color: 'var(--app-color-primary)', backgroundColor: 'var(--app-color-primary)', opacity: 0.1, fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", borderRadius: 'var(--app-spacing-container)' }}>Nuovo</span>
                                        </div>
                                        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', opacity: 0.5, borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--app-spacing-section)', fontSize: "var(--md-sys-typescale-body-large-size)", fontWeight: "500", lineHeight: "1.625"}}>
                                            {lesson.compiti}
                                        </div>
                                        <UploadButton lessonId={lesson.id} />
                                    </M3ExpressiveCard>
                                ))}
                                {pendingHomework.length === 0 && (
                                    <div style={{ padding: 'var(--app-spacing-container)', backgroundColor: 'var(--md-sys-color-surface-container-low)', opacity: 0.3, borderRadius: 'var(--md-sys-shape-corner-large)', border: "var(--app-border-normal) solid var(--md-sys-color-outline)", textAlign: "center"}}>
                                        <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.4" }}>Nessun compito in sospeso.</M3Typography>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{gap: 'var(--app-spacing-section)'}}>
                            <SectionHeader 
                                title="Storico Consegne" 
                                icon="history" 
                                
                            />
                            <div style={{gap: 'var(--app-spacing-element)'}}>
                                {submittedHomework.map(sub => {
                                    const relatedLesson = lessons.find(l => l.id === sub.lessonId);
                                    return (
                                        <div key={sub.id} style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', opacity: 0.5, borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--app-spacing-section)', border: "var(--app-border-normal) solid var(--md-sys-color-outline)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "color var(--app-motion-standard)"}}>
                                            <div style={{gap: 'var(--md-sys-spacing-1)'}}>
                                                <M3Typography variant="label-small" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>{relatedLesson?.materia || 'Materia'}</M3Typography>
                                                <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "500", opacity: "0.6" }}>{new Date(sub.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}</M3Typography>
                                            </div>
                                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 'var(--md-sys-spacing-8)'}}>
                                                <span style={{
                                                    fontSize: 'var(--md-sys-typescale-body-small-size)',
                                                    fontWeight: '900',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em',
                                                    padding: 'var(--md-sys-spacing-1) var(--app-spacing-element)',
                                                    borderRadius: 'var(--md-sys-shape-corner-full)',
                                                    backgroundColor: sub.status === 'graded' ? 'var(--app-color-secondary-container)' : 'var(--md-sys-color-tertiary-container)',
                                                    opacity: 0.5,
                                                    color: sub.status === 'graded' ? 'var(--app-color-on-secondary-container)' : 'var(--md-sys-color-on-tertiary-container)'
                                                }}>
                                                    {sub.status === 'graded' ? 'Valutato' : 'In attesa'}
                                                </span>
                                                {sub.teacherFeedback && <span style={{fontSize: "var(--md-sys-typescale-body-small-size)", fontWeight: "900", color: "var(--app-color-primary)"}}>Voto: {sub.teacherFeedback}</span>}
                                            </div>
                                        </div>
                                    )
                                })}
                                {submittedHomework.length === 0 && (
                                    <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', textAlign: "center", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.4" }}>Nessuna consegna effettuata.</M3Typography>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'materials' && (
                     <div  style={{display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)", gap: 'var(--app-spacing-section)', marginLeft: "var(--app-layout-auto)", marginRight: "var(--app-layout-auto)"}}>
                        {kb.map(entry => (
                            <M3ExpressiveCard 
                                key={entry.id}
                                icon={entry.fileName.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                                title={entry.fileName}
                                description={''}
                            >
                                <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--app-color-secondary)', opacity: 0.1, width: 'var(--app-spacing-container)', height: 'var(--app-spacing-container)', color: "var(--app-color-secondary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "color var(--app-motion-standard)"}}>
                                    <span style={{ color: 'var(--app-color-secondary)' }}>
                                        {entry.fileName.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                                    </span>
                                </div>
                                <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", lineHeight: "1.625" }}>{entry.fileName}</M3Typography>
                            </M3ExpressiveCard>
                        ))}
                        {kb.length === 0 && (
                            <div style={{ padding: 'var(--app-spacing-container)', backgroundColor: 'var(--md-sys-color-surface-container-low)', opacity: 0.3, borderRadius: 'var(--md-sys-shape-corner-large)', textAlign: "center", border: "var(--app-border-thin) solid var(--md-sys-color-outline)"}}>
                                <span style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-8)', opacity: "0.2"}}>folder_off</span>
                                <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.4" }}>Nessun materiale condiviso.</M3Typography>
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








