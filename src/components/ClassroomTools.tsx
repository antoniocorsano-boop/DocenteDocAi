// LEGACY - MD3 Non-compliant

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
        <div >
            {/* Background Decor */}
            <div >
                 timer
            </div>
            
            <div >
                <span >timer</span>
                <span >Cronometro</span>
            </div>
            
            <div >
                {formatTime(time)}
            </div>
            
            <div >
                <button 
                    onClick={handleReset} 
                     
                    title="Reset"
                >
                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>restart_alt</span>
                </button>
                <button 
                    onClick={handleStartPause} 
                    className={`classroom-tools-timer-start-pause-button button ${isActive ? 'button-outlined' : 'button-filled'}`}
                >
                    <span  style={{ marginRight: "0.5rem" }}>{isActive ? 'pause' : 'play_arrow'}</span>
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
        <div >
             {/* Background Decor */}
            <div >
                 casino
            </div>

            <div >
                <span >casino</span>
                <span >Estrazione</span>
            </div>

            <div >
                {selectedStudent ? (
                    <div className={`classroom-tools-random-student-info ${isSelecting ? 'selecting' : ''}`}>
                         <span >{selectedStudent.cognome}</span>
                         <span >{selectedStudent.nome}</span>
                    </div>
                ) : (
                     <div >
                        <span >groups</span>
                        <span >Pronto ad estrarre</span>
                     </div>
                )}
            </div>

            <button 
                onClick={handleSelect} 
                disabled={isSelecting || presentStudents.length === 0} 
                
            >
                {isSelecting ? 'Estrazione...' : 'Estrai Studente'}
            </button>
        </div>
    );
};


const ClassroomTools: React.FC<ClassroomToolsProps> = ({ students, studentAttendance }) => {
    const presentStudents = students.filter(s => studentAttendance[s.id] === 'presente');
    
    return (
        <div >
            <TimerWidget />
            <RandomStudentWidget presentStudents={presentStudents} />
            
            {/* Placeholder for future tools to fill grid if needed */}
            {/* <div > ... </div> */}
        </div>
    );
};

export default ClassroomTools;







