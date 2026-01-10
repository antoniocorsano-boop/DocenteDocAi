
/* M3Expressive - ClassroomTools Component */

import React, { useState, useRef, useEffect } from 'react';
import { Studente } from '../types';

interface ClassroomToolsProps {
    students: Studente[];
    studentAttendance: Record<string, 'presente' | 'assente' | 'ritardo'>;
}

const TimerWidget: React.FC = () => {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = window.setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive]);

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleStartPause = () => setIsActive(!isActive);
    const handleReset = () => {
        setIsActive(false);
        setTime(0);
    };

    return (
        <div className="classroom-tools-timer-widget">
            {/* Background Decor */}
            <div className="classroom-tools-timer-background-decor material-symbols-outlined">
                 timer
            </div>
            
            <div className="classroom-tools-timer-header">
                <span className="classroom-tools-timer-icon material-symbols-outlined">timer</span>
                <span className="classroom-tools-timer-title">Cronometro</span>
            </div>
            
            <div className="classroom-tools-timer-display">
                {formatTime(time)}
            </div>
            
            <div className="classroom-tools-timer-controls">
                <button 
                    onClick={handleReset} 
                    className="classroom-tools-timer-reset-button button button-tonal" 
                    title="Reset"
                >
                    <span className="material-symbols-outlined">restart_alt</span>
                </button>
                <button 
                    onClick={handleStartPause} 
                    className={`classroom-tools-timer-start-pause-button button ${isActive ? 'button-outlined' : 'button-filled'}`}
                >
                    <span className="material-symbols-outlined mr-2">{isActive ? 'pause' : 'play_arrow'}</span>
                    {isActive ? 'Pausa' : 'Avvia'}
                </button>
            </div>
        </div>
    );
};


const RandomStudentWidget: React.FC<{ presentStudents: Studente[] }> = ({ presentStudents }) => {
    const [selectedStudent, setSelectedStudent] = useState<Studente | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);

    const handleSelect = () => {
        if (presentStudents.length === 0) return;
        setIsSelecting(true);
        setSelectedStudent(null);

        const selectionInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * presentStudents.length);
            setSelectedStudent(presentStudents[randomIndex]);
        }, 80); // Faster animation

        setTimeout(() => {
            clearInterval(selectionInterval);
            setIsSelecting(false);
        }, 1500);
    };
    
    return (
        <div className="classroom-tools-random-student-widget">
             {/* Background Decor */}
            <div className="classroom-tools-random-student-background-decor material-symbols-outlined">
                 casino
            </div>

            <div className="classroom-tools-random-student-header">
                <span className="classroom-tools-random-student-icon material-symbols-outlined">casino</span>
                <span className="classroom-tools-random-student-title">Estrazione</span>
            </div>

            <div className="classroom-tools-random-student-content">
                {selectedStudent ? (
                    <div className={`classroom-tools-random-student-info ${isSelecting ? 'selecting' : ''}`}>
                         <span className="classroom-tools-random-student-name">{selectedStudent.cognome}</span>
                         <span className="classroom-tools-random-student-first-name">{selectedStudent.nome}</span>
                    </div>
                ) : (
                     <div className="classroom-tools-random-student-empty-state">
                        <span className="classroom-tools-random-student-empty-state-icon material-symbols-outlined">groups</span>
                        <span className="classroom-tools-random-student-empty-state-text">Pronto ad estrarre</span>
                     </div>
                )}
            </div>

            <button 
                onClick={handleSelect} 
                disabled={isSelecting || presentStudents.length === 0} 
                className="classroom-tools-random-student-button button button-filled"
            >
                {isSelecting ? 'Estrazione...' : 'Estrai Studente'}
            </button>
        </div>
    );
};


const ClassroomTools: React.FC<ClassroomToolsProps> = ({ students, studentAttendance }) => {
    const presentStudents = students.filter(s => studentAttendance[s.id] === 'presente');
    
    return (
        <div className="classroom-tools-grid">
            <TimerWidget />
            <RandomStudentWidget presentStudents={presentStudents} />
            
            {/* Placeholder for future tools to fill grid if needed */}
            {/* <div className="md:col-span-2"> ... </div> */}
        </div>
    );
};

export default ClassroomTools;


