// LEGACY - MD3 Non-compliant

import React, { useState, useMemo } from 'react';
import { Studente, Lezione, KnowledgeBaseEntry, HomeworkSubmission, RegisterEntry, TimetableSettings } from '../types';
import { blobToBase64Parts, generateHomeworkPdf, viewPdfInNewTab } from '../utils/documentUtils';
import { useFileDrop } from '../hooks/useFileDrop';
import { TabGroup, M3Button, SectionHeader, M3ExpressiveCard, Avatar } from './ui';
import PinPadModal from './PinPadModal';
import { useTheme } from '../theme/theme';

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
  const { layers } = useTheme();
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
                backgroundColor: layers.sys.color.primary,
                opacity: 0.05,
                borderRadius: layers.ref.shape.corner.large,
                cursor: "pointer",
                padding: layers.ref.spacing['6'],
                textAlign: "center",
                transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                marginTop: layers.ref.spacing['4']
            }}>
                <input {...getInputProps()} />
                <span style={{color: "layers.sys.color.primary", marginBottom: layers.ref.spacing['8'], transition: "transform 300ms"}}>cloud_upload</span>
                <p style={{fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "layers.sys.color.primary"}}>Carica Elaborato</p>
                <p style={{ color: layers.sys.color.onSurfaceVariant, opacity: "0.6", marginTop: layers.ref.spacing['4']}}>Trascina qui il file o clicca per selezionare</p>
            </div>
        );
    }

    return (
        <div  style={{minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "layers.sys.color.surface"}}>
            {/* Aura Ornaments */}
            <div style={{ backgroundColor: sys.colors.primary/5 }} style={{ borderRadius: layers.ref.spacing['4'] }} />
            <div style={{ backgroundColor: sys.colors.tertiary/5 }} style={{ borderRadius: layers.ref.spacing['4'] }} />

            <header style={{ backgroundColor:  layers.sys.color.surfaceContainerLow/30 }} style={{borderBottom: "1px solid layers.sys.color.outline", padding: layers.ref.spacing['6'], display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                    <Avatar name={`${student.nome} ${student.cognome}`} size="md"  />
                    <div >
                        <h1 style={{ color:  layers.sys.color.onPrimary, fontSize: "1.25rem", fontWeight: "900", letterSpacing: "-0.005em" }}>Diario di Classe</h1>
                        <p style={{ color:  layers.sys.color.onSurfaceVariant, fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.7" }}>Classe {student.classe} • {student.nome} {student.cognome}</p>
                    </div>
                </div>
                <M3Button onClick={() => setIsExitMenuOpen(!isExitMenuOpen)} variant="tonal"  style={{color: "layers.sys.color.error"}}>
                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>power_settings_new</span>
                </M3Button>
                
                {isExitMenuOpen && (
                    <div style={{ backgroundColor:  layers.sys.color.surfaceContainerHigh/90, borderRadius: layers.ref.shape.corner.large }} style={{border: "1px solid layers.sys.color.outline", padding: layers.ref.spacing['6'], display: "flex", flexDirection: "column"}}>
                        <button 
                            onClick={() => { onLogout(); setIsExitMenuOpen(false); }}
                            style={{ color:  layers.sys.color.onPrimary, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['8'], textAlign: "left", display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], transition: "color 300ms"}}
                        >
                            <span style={{ color:  layers.sys.color.onSurfaceVariant }}>logout</span>
                            <div >
                                <p style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Termina Sessione</p>
                                <p style={{ color: layers.sys.color.onSurfaceVariant }} style={{ opacity: "0.7" }}>Torna al login studenti</p>
                            </div>
                        </button>
                        {onExitMode && (
                            <button 
                                onClick={() => { setIsPinModalOpen(true); setIsExitMenuOpen(false); }}
                                style={{ borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['8'], textAlign: "left", color: "layers.sys.color.error", display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], transition: "color 300ms", marginTop: layers.ref.spacing['4']}}
                            >
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>lock</span>
                                <div >
                                    <p style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Menu Docente</p>
                                    <p style={{ opacity: "0.7" }}>Richiede PIN di sicurezza</p>
                                </div>
                            </button>
                        )}
                    </div>
                )}
                {isExitMenuOpen && <div  onClick={() => setIsExitMenuOpen(false)}></div>}
            </header>

            <div style={{ backgroundColor:  layers.sys.color.surfaceContainerLow/50 }} style={{padding: layers.ref.spacing['8'], borderBottom: "1px solid layers.sys.color.outline"}}>
                 <TabGroup 
                    activeTab={activeTab}
                    onTabChange={(id) => setActiveTab(id as 'feed' | 'homework' | 'materials')}
                    variant="secondary"
                    tabs={[
                        { id: 'feed', label: 'Attività', icon: 'feed' },
                        { id: 'homework', label: 'Compiti', icon: 'assignment', badge: pendingHomework.length || undefined },
                        { id: 'materials', label: 'Materiali', icon: 'folder' }
                    ]}
                     style={{ marginLeft: "auto", marginRight: "auto" }}
                />
            </div>

            <main  style={{flexGrow: "1", overflowY: "auto", padding: layers.ref.spacing['6'], gap: layers.ref.spacing['8']}}>
                
                {activeTab === 'feed' && (
                    <div  style={{gap: layers.ref.spacing['6'], marginLeft: "auto", marginRight: "auto"}}>
                        {feedItems.length > 0 ? feedItems.map((item) => (
                            <M3ExpressiveCard key={item.id} style={{padding: layers.ref.spacing['8'], gap: layers.ref.spacing['6']}}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6']}}>
                                        <span style={{ backgroundColor: sys.colors.secondary/10, fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "layers.sys.color.secondary", borderRadius: layers.ref.spacing['4']}}>
                                            {new Date(item.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                                        </span>
                                        <span style={{fontWeight: "900", textTransform: "uppercase", color: "layers.sys.color.primary"}}>{item.title}</span>
                                    </div>
                                </div>
                                <h3 style={{ color:  layers.sys.color.onPrimary }} style={{ fontSize: "1.5rem", fontWeight: "900", letterSpacing: "-0.005em" }}>{item.content}</h3>
                                {item.homework && (
                                    <div style={{ backgroundColor: sys.colors.tertiary/5, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['6'], border: "1px solid layers.sys.color.outline", gap: layers.ref.spacing['3']}}>
                                        <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], color: "layers.sys.color.tertiary"}}>
                                            <span  style={{ fontSize: "1.125rem" }}>home_work</span>
                                            <span style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>Compito per casa</span>
                                        </div>
                                        <p style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ fontSize: "0.875rem", fontWeight: "500", lineHeight: "1.625" }}>{item.homework}</p>
                                    </div>
                                )}
                                {settings && (
                                     <M3Button 
                                        onClick={() => handleDownloadHomeworkSheet(item.originalLesson)}
                                        disabled={isGeneratingPdf}
                                        variant="text"
                                        style={{ color: layers.sys.color.onSurfaceVariant, width: "100%", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}
                                     >
                                         <span  style={{ marginRight: "0.5rem", fontSize: "0.875rem" }}>print</span>
                                         {isGeneratingPdf ? 'Generazione PDF...' : 'Scarica Scheda Lezione'}
                                     </M3Button>
                                )}
                            </M3ExpressiveCard>
                        )) : (
                            <div style={{ padding: layers.ref.spacing['4'], backgroundColor:  layers.sys.color.surfaceContainerLow/30, borderRadius: ref.shape[5], textAlign: "center", border: "1px solid layers.sys.color.outline"}}>
                                <span style={{ color:  layers.sys.color.onSurfaceVariant, marginBottom: layers.ref.spacing['8'], opacity: "0.2"}}>feed</span>
                                <p style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ fontSize: "0.875rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.4" }}>Nessuna attività recente nel registro.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'homework' && (
                    <div  style={{ marginLeft: "auto", marginRight: "auto" }}>
                        
                        <div style={{gap: layers.ref.spacing['6']}}>
                            <SectionHeader 
                                title={`Da Consegnare (${pendingHomework.length})`} 
                                icon="pending_actions" 
                                
                            />
                            <div style={{marginTop: layers.ref.spacing['4']}}>
                                {pendingHomework.map(lesson => (
                                    <M3ExpressiveCard key={lesson.id}  style={{padding: layers.ref.spacing['8']}}>
                                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: layers.ref.spacing['8']}}>
                                            <div style={{gap: layers.ref.spacing['1']}}>
                                                <h4 style={{ fontSize: "1.25rem", fontWeight: "900", letterSpacing: "-0.005em" }}>{lesson.materia}</h4>
                                                <p style={{ color: layers.sys.color.onSurfaceVariant, fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.6" }}>{lesson.contenuto}</p>
                                            </div>
                                            <span style={{ color: layers.sys.color.primary, backgroundColor: layers.sys.color.primary/10, fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", borderRadius: layers.ref.spacing['4'] }}>Nuovo</span>
                                        </div>
                                        <div style={{ backgroundColor:  layers.sys.color.surfaceContainerHigh/50, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['6'], fontSize: "0.875rem", fontWeight: "500", lineHeight: "1.625"}}>
                                            {lesson.compiti}
                                        </div>
                                        <UploadButton lessonId={lesson.id} />
                                    </M3ExpressiveCard>
                                ))}
                                {pendingHomework.length === 0 && (
                                    <div style={{ padding: layers.ref.spacing['4'], backgroundColor:  layers.sys.color.surfaceContainerLow/30, borderRadius: ref.shape[5] }} style={{border: "1px solid layers.sys.color.outline", textAlign: "center"}}>
                                        <p style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ fontSize: "0.875rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.4" }}>Nessun compito in sospeso.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{gap: layers.ref.spacing['6']}}>
                            <SectionHeader 
                                title="Storico Consegne" 
                                icon="history" 
                                
                            />
                            <div style={{gap: layers.ref.spacing['3']}}>
                                {submittedHomework.map(sub => {
                                    const relatedLesson = lessons.find(l => l.id === sub.lessonId);
                                    return (
                                        <div key={sub.id} style={{ backgroundColor:  layers.sys.color.surfaceContainerLow/50, borderRadius: layers.ref.shape.corner.large, padding: layers.ref.spacing['6'], border: "1px solid layers.sys.color.outline", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "color 300ms"}}>
                                            <div style={{gap: layers.ref.spacing['1']}}>
                                                <p style={{ fontWeight: "900", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{relatedLesson?.materia || 'Materia'}</p>
                                                <p style={{ color: layers.sys.color.onSurfaceVariant, fontWeight: "500", opacity: "0.6" }}>{new Date(sub.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", gap: layers.ref.spacing['8']}}>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${sub.status === 'graded' ? 'bg-secondary-container/50 text-on-secondary-container' : 'bg-tertiary-container/50 text-on-tertiary-container'}`}>
                                                    {sub.status === 'graded' ? 'Valutato' : 'In attesa'}
                                                </span>
                                                {sub.teacherFeedback && <span style={{fontSize: "0.75rem", fontWeight: "900", color: "layers.sys.color.primary"}}>Voto: {sub.teacherFeedback}</span>}
                                            </div>
                                        </div>
                                    )
                                })}
                                {submittedHomework.length === 0 && (
                                    <p style={{ color: layers.sys.color.onSurfaceVariant, textAlign: "center", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.4" }}>Nessuna consegna effettuata.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'materials' && (
                     <div  style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: layers.ref.spacing['6'], marginLeft: "auto", marginRight: "auto"}}>
                        {kb.map(entry => (
                            <M3ExpressiveCard key={entry.id}  style={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: layers.ref.spacing['8'], transition: "transform 300ms", cursor: "pointer"}}>
                                <div style={{ borderRadius: layers.ref.shape.corner.large, backgroundColor: layers.sys.color.secondary/10, width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], color: "layers.sys.color.secondary", display: "flex", alignItems: "center", justifyContent: "center", transition: "color 300ms"}}>
                                    <span style={{ color: layers.sys.color.secondary }}>
                                        {entry.fileName.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                                    </span>
                                </div>
                                <p style={{ color: layers.sys.color.onSurfaceVariant, fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", lineHeight: "1.625" }}>{entry.fileName}</p>
                            </M3ExpressiveCard>
                        ))}
                        {kb.length === 0 && (
                            <div style={{ padding: layers.ref.spacing['4'], backgroundColor:  layers.sys.color.surfaceContainerLow/30, borderRadius: ref.shape[5], textAlign: "center", border: "1px solid layers.sys.color.outline"}}>
                                <span style={{ color: layers.sys.color.onSurfaceVariant, marginBottom: layers.ref.spacing['8'], opacity: "0.2"}}>folder_off</span>
                                <p style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ fontSize: "0.875rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.4" }}>Nessun materiale condiviso.</p>
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







