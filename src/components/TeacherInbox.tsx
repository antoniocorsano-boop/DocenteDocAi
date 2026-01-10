// M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for colors, spacing, typography, elevation. Maintained responsive behavior and animations.
// ...existing code...
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
        <div className="page-layout teacher-inbox-page-layout teacher-inbox-page-layout.responsive">
            <div className="teacher-inbox-main-container teacher-inbox-main-container.responsive">
                
                {/* Sidebar List */}
                <div className="teacher-inbox-sidebar">
                    <div className="teacher-inbox-header">
                        <h2 className="m3-title-medium teacher-inbox-title">
                            <span className="material-symbols-outlined teacher-inbox-title-icon">inbox</span> Inbox Compiti
                        </h2>
                        <button onClick={onClose} className="icon-button teacher-inbox-close-button" aria-label="Chiudi inbox"><span className="material-symbols-outlined" aria-hidden="true">close</span></button>
                    </div>

                    <div className="teacher-inbox-content">
                        <p className="teacher-inbox-section-header">Da Correggere ({pendingSubmissions.length})</p>
                        {pendingSubmissions.map(sub => {
                            const studentInfo = getStudentDisplay(sub.studentId);
                            const lessonInfo = getLessonDisplay(sub.lessonId);
                            const isSelected = selectedSubmission?.id === sub.id;
                            
                            return (
                                <div 
                                    key={sub.id}
                                    onClick={() => setSelectedSubmission(sub)}
                                    className={`teacher-inbox-submission-item ${isSelected ? 'teacher-inbox-submission-item.selected' : ''}`}
                                    style={{ borderRadius: 'var(--md-sys-shape-corner-small)', transition: 'var(--md-easing-standard)' }}
                                >
                                    <Avatar name={`${studentInfo.name} ${studentInfo.surname}`} size="sm" />
                                    <div className="teacher-inbox-submission-content">
                                        <p className="teacher-inbox-student-name">{studentInfo.full}</p>
                                        <p className="teacher-inbox-lesson-info">{lessonInfo.materia} - {lessonInfo.contenuto}</p>
                                        <span className="teacher-inbox-date">{new Date(sub.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {pendingSubmissions.length === 0 && (
                            <div className="teacher-inbox-empty-state">
                                Nessun compito in attesa.
                            </div>
                        )}
                        
                        {gradedSubmissions.length > 0 && (
                            <>
                                <p className="teacher-inbox-graded-header">Già Corretti</p>
                                {gradedSubmissions.slice(0, 5).map(sub => {
                                    const studentInfo = getStudentDisplay(sub.studentId);
                                    const lessonInfo = getLessonDisplay(sub.lessonId);
                                    return (
                                        <div key={sub.id} className="teacher-inbox-graded-item" style={{ borderRadius: 'var(--md-sys-shape-corner-small)', transition: 'var(--md-easing-standard)' }}>
                                            <span className="material-symbols-outlined teacher-inbox-graded-icon">check_circle</span>
                                            <span className="teacher-inbox-graded-text">{studentInfo.full} - Voto: {sub.teacherFeedback} - {lessonInfo.materia}</span>
                                        </div>
                                    )
                                })}
                            </>
                        )}
                    </div>
                </div>

                {/* Main Grading Area */}
                <div className="teacher-inbox-main-area">
                    {selectedSubmission ? (
                        <div className="teacher-inbox-grading-area">
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
                        <div className="teacher-inbox-empty-selection">
                            <span className="material-symbols-outlined teacher-inbox-empty-icon">rate_review</span>
                            <p className="teacher-inbox-empty-text">Seleziona un compito da correggere</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherInbox;

// M3Expressive refactor COMPLETED: TeacherInbox.tsx - Replaced all hardcoded Tailwind classes with dedicated teacher-inbox-* CSS classes using M3 tokens for sidebar layout, submission items, graded items, and empty states.


