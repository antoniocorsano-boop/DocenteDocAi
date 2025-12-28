
import React, { useState } from 'react';
import { HomeworkSubmission, Studente, Lezione } from '../types';
import Avatar from './Avatar';

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
        <div className="page-layout h-[calc(100vh-64px)] overflow-hidden !gap-0 !p-0 md:!p-4">
            <div className="flex h-full bg-surface-container-low md:rounded-3xl overflow-hidden border border-outline-variant shadow-sm">
                
                {/* Sidebar List */}
                <div className="w-80 border-r border-outline-variant flex flex-col bg-surface-container-low flex-shrink-0">
                    <div className="p-4 border-b border-outline-variant flex items-center gap-2 justify-between">
                        <h2 className="m3-title-medium font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined">inbox</span> Inbox Compiti
                        </h2>
                        <button onClick={onClose} className="icon-button rounded-lg hover:shadow-md transition-all"><span className="material-symbols-outlined">close</span></button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-2 space-y-1">
                        <p className="px-3 py-2 text-xs font-bold text-on-surface-variant uppercase">Da Correggere ({pendingSubmissions.length})</p>
                        {pendingSubmissions.map(sub => {
                            const studentInfo = getStudentDisplay(sub.studentId);
                            const lessonInfo = getLessonDisplay(sub.lessonId);
                            const isSelected = selectedSubmission?.id === sub.id;
                            
                            return (
                                <div 
                                    key={sub.id}
                                    onClick={() => setSelectedSubmission(sub)}
                                    className={`p-3 rounded-xl cursor-pointer transition-colors flex items-start gap-3 ${isSelected ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container-high'}`}
                                    style={{ borderRadius: '8px', transition: 'all 0.2s ease' }}
                                >
                                    <Avatar name={studentInfo.name} surname={studentInfo.surname} size="small" />
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm truncate">{studentInfo.full}</p>
                                        <p className="text-xs opacity-80 truncate">{lessonInfo.materia} - {lessonInfo.contenuto}</p>
                                        <span className="text-[10px] opacity-60">{new Date(sub.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {pendingSubmissions.length === 0 && (
                            <div className="text-center p-4 text-on-surface-variant opacity-60 text-sm">
                                Nessun compito in attesa.
                            </div>
                        )}
                        
                        {gradedSubmissions.length > 0 && (
                            <>
                                <p className="px-3 py-2 text-xs font-bold text-on-surface-variant uppercase mt-4">Già Corretti</p>
                                {gradedSubmissions.slice(0, 5).map(sub => {
                                    const studentInfo = getStudentDisplay(sub.studentId);
                                    const lessonInfo = getLessonDisplay(sub.lessonId);
                                    return (
                                        <div key={sub.id} className="p-3 opacity-60 flex items-center gap-2" style={{ borderRadius: '8px', transition: 'all 0.2s ease' }}>
                                            <span className="material-symbols-outlined text-sm">check_circle</span>
                                            <span className="text-xs truncate">{studentInfo.full} - Voto: {sub.teacherFeedback} - {lessonInfo.materia}</span>
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
                        <div className="flex-grow p-6 overflow-y-auto bg-surface-container-lowest">
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
                        <div className="flex flex-col items-center justify-center h-full text-on-surface-variant opacity-60">
                            <span className="material-symbols-outlined text-6xl mb-4">rate_review</span>
                            <p className="m3-headline-small">Seleziona un compito da correggere</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherInbox;
