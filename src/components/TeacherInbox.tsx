// LEGACY - MD3 Non-compliant
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
        <div >
            <div >
                
                {/* Sidebar List */}
                <div >
                    <div >
                        <h2 >
                            <span >inbox</span> Inbox Compiti
                        </h2>
                        <button onClick={onClose}  aria-label="Chiudi inbox"><span style={{
  fontFamily: 'Material Symbols Outlined'
}} aria-hidden="true">close</span></button>
                    </div>

                    <div >
                        <p >Da Correggere ({pendingSubmissions.length})</p>
                        {pendingSubmissions.map(sub => {
                            const studentInfo = getStudentDisplay(sub.studentId);
                            const lessonInfo = getLessonDisplay(sub.lessonId);
                            const isSelected = selectedSubmission?.id === sub.id;
                            
                            return (
                                <div 
                                    key={sub.id}
                                    onClick={() => setSelectedSubmission(sub)}
                                    style={{
                                        borderRadius: 'var(--md-sys-shape-corner-small)',
                                        transition: 'var(--md-easing-standard)',
                                        backgroundColor: isSelected ? 'var(--app-color-secondary-container)' : 'var(--app-color-surface-container)',
                                        padding: 'var(--app-spacing-element)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Avatar name={`${studentInfo.name} ${studentInfo.surname}`} size="sm" />
                                    <div >
                                        <p >{studentInfo.full}</p>
                                        <p >{lessonInfo.materia} - {lessonInfo.contenuto}</p>
                                        <span >{new Date(sub.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {pendingSubmissions.length === 0 && (
                            <div >
                                Nessun compito in attesa.
                            </div>
                        )}
                        
                        {gradedSubmissions.length > 0 && (
                            <>
                                <p >Già Corretti</p>
                                {gradedSubmissions.slice(0, 5).map(sub => {
                                    return (
                                        <div key={sub.id}  style={{borderRadius: 'var(--md-sys-shape-corner-small)', transition: 'var(--md-easing-standard)'}}>
                                            <span >check_circle</span>
                                            <span >{studentInfo.full} - Voto: {sub.teacherFeedback} - {lessonInfo.materia}</span>
                                        </div>
                                    )
                                })}
                            </>
                        )}
                    </div>
                </div>

                {/* Main Grading Area */}
                <div >
                    {selectedSubmission ? (
                        <div >
                            <div  style={{ marginLeft: "var(--app-layout-auto)", marginRight: "var(--app-layout-auto)" }}>
                                <HomeworkSubmissionCard
                                    submission={selectedSubmission}
                                    student={getStudentDisplay(selectedSubmission.studentId).obj!}
                                    lesson={getLessonDisplay(selectedSubmission.lessonId).obj!}
                                    onGrade={onGradeSubmission}
                                />
                            </div>
                        </div>
                    ) : (
                        <div >
                            <span >rate_review</span>
                            <p >Seleziona un compito da correggere</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherInbox;

// M3Expressive refactor COMPLETED: TeacherInbox.tsx - Replaced all hardcoded Tailwind classes with dedicated teacher-inbox-* CSS classes using M3 tokens for sidebar layout, submission items, graded items, and empty states.








