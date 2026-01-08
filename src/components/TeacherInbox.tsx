import React, { useState } from 'react';
import { HomeworkSubmission, Studente, Lezione } from '../types';
import { Avatar } from './ui';

import HomeworkSubmissionCard from './HomeworkSubmission'; 

interface TeacherInboxProps {
    submissions: HomeworkSubmission[];
    students: Studente[];
    lessons: Record<string, Lezione>;
    onGradeSubmission: (submissionId: string, grade: string, feedback: string) => void;
    onClose: () => void;
}

const TeacherInbox: React.FC<TeacherInboxProps> = ({ submissions, students, lessons, onGradeSubmission, onClose }) => {
    const [selectedSubmission, setSelectedSubmission] = useState<HomeworkSubmission | null>(null);

    const pendingSubmissions = submissions.filter(s => s.status === 'pending');
    const gradedSubmissions = submissions.filter(s => s.status === 'graded');

    const getStudentDisplay = (studentId: string) => {
        const student = students.find(s => s.id === studentId);
        return student ? { 
            name: student.nome, 
            surname: student.cognome, 
            full: `${student.cognome} ${student.nome}`,
            obj: student
        } : { 
            name: '?', 
            surname: 'Sconosciuto', 
            full: 'Studente Eliminato',
            obj: null
        };
    };

    const getLessonDisplay = (lessonId: string) => {
        const lesson = lessons[lessonId];
        return lesson ? {
            materia: lesson.materia,
            contenuto: lesson.contenuto,
            obj: lesson
        } : {
            materia: 'N/A',
            contenuto: 'Lezione Sconosciuta',
            obj: null
        };
    };

    return (
        <div className="page-layout h-[calc(100vh-64px)] overflow-hidden !gap-0 !p-0 md:!p-8">
            <div className="flex h-full bg-[var(--md-sys-color-surface-container-low)] md:rounded-[var(--md-sys-shape-corner-extra-large)] overflow-hidden border border-[var(--md-sys-color-outline-variant)] shadow-sm">
                
                {/* Sidebar List */}
                <div className="w-80 border-r border-[var(--md-sys-color-outline-variant)] flex flex-col bg-[var(--md-sys-color-surface-container-low)] flex-shrink-0">
                    <div className="p-8 border-b border-[var(--md-sys-color-outline-variant)] flex items-center gap-8 justify-between">
                        <h2 className="m3-title-medium font-bold flex items-center gap-8">
                            <span className="material-symbols-outlined">inbox</span> Inbox Compiti
                        </h2>
                        <button onClick={onClose} className="icon-button rounded-[var(--md-sys-shape-corner-small)] hover:shadow-[var(--md-sys-elevation-level1)] transition-all" aria-label="Chiudi inbox"><span className="material-symbols-outlined" aria-hidden="true">close</span></button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-8 space-y-1">
                        <p className="px-3 py-4 m3-label-small font-bold text-[var(--md-sys-color-on-surface)]-variant uppercase">Da Correggere ({pendingSubmissions.length})</p>
                        {pendingSubmissions.map(sub => {
                            const studentInfo = getStudentDisplay(sub.studentId);
                            const lessonInfo = getLessonDisplay(sub.lessonId);
                            const isSelected = selectedSubmission?.id === sub.id;
                            
                            return (
                                <div 
                                    key={sub.id}
                                    onClick={() => setSelectedSubmission(sub)}
                                    className={`p-6 rounded-[var(--md-sys-shape-corner-medium)] cursor-pointer transition-colors flex items-start gap-6 ${isSelected ? 'bg-primary-container text-on-primary-container' : 'hover:bg-[var(--md-sys-color-surface-container-high)]'}`}
                                    style={{ borderRadius: 'var(--md-sys-shape-corner-small)', transition: 'var(--md-easing-standard)' }}
                                >
                                    <Avatar name={`${studentInfo.name} ${studentInfo.surname}`} size="sm" />
                                    <div className="min-w-0">
                                        <p className="font-bold m3-body-small truncate">{studentInfo.full}</p>
                                        <p className="m3-label-small opacity-80 truncate">{lessonInfo.materia} - {lessonInfo.contenuto}</p>
                                        <span className="text-[10px] opacity-60">{new Date(sub.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {pendingSubmissions.length === 0 && (
                            <div className="text-center p-8 text-[var(--md-sys-color-on-surface)]-variant opacity-60 m3-body-small">
                                Nessun compito in attesa.
                            </div>
                        )}
                        
                        {gradedSubmissions.length > 0 && (
                            <>
                                <p className="px-3 py-4 m3-label-small font-bold text-[var(--md-sys-color-on-surface)]-variant uppercase mt-4">Già Corretti</p>
                                {gradedSubmissions.slice(0, 5).map(sub => {
                                    const studentInfo = getStudentDisplay(sub.studentId);
                                    const lessonInfo = getLessonDisplay(sub.lessonId);
                                    return (
                                        <div key={sub.id} className="p-6 opacity-60 flex items-center gap-8" style={{ borderRadius: 'var(--md-sys-shape-corner-small)', transition: 'var(--md-easing-standard)' }}>
                                            <span className="material-symbols-outlined m3-body-small">check_circle</span>
                                            <span className="m3-label-small truncate">{studentInfo.full} - Voto: {sub.teacherFeedback} - {lessonInfo.materia}</span>
                                        </div>
                                    )
                                })}
                            </>
                        )}
                    </div>
                </div>

                {/* Main Grading Area */}
                <div className="flex-grow bg-surface relative flex flex-col">
                    {selectedSubmission ? (
                        <div className="flex-grow p-6 overflow-y-auto bg-[var(--md-sys-color-surface-container-low)]est">
                            <div className="max-w-2xl mx-auto">
                                <HomeworkSubmissionCard
                                    submission={selectedSubmission}
                                    student={getStudentDisplay(selectedSubmission.studentId).obj!}
                                    lesson={getLessonDisplay(selectedSubmission.lessonId).obj!}
                                    onGrade={onGradeSubmission}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-[var(--md-sys-color-on-surface)]-variant opacity-60">
                            <span className="material-symbols-outlined text-6xl mb-8">rate_review</span>
                            <p className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)]">Seleziona un compito da correggere</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherInbox;


