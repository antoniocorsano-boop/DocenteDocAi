
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
        <div className="bg-surface-container border border-outline-variant rounded-2xl p-4 flex flex-col justify-between h-48 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
            {/* Background Decor */}
            <div className="absolute -top-4 -right-4 text-[100px] text-on-surface opacity-[0.03] pointer-events-none rotate-12">
                 timer
            </div>
            
            <div className="flex items-center gap-2 text-primary z-10">
                <span className="material-symbols-outlined filled-icon">timer</span>
                <span className="m3-label-small font-bold uppercase tracking-wider">Cronometro</span>
            </div>
            
            <div className="text-6xl font-mono font-bold tracking-widest text-on-surface z-10 text-center my-2 tabular-nums">
                {formatTime(time)}
            </div>
            
            <div className="flex gap-2 w-full z-10 mt-auto">
                <button 
                    onClick={handleReset} 
                    className="button button-tonal flex-shrink-0 !w-12 !px-0 justify-center" 
                    title="Reset"
                >
                    <span className="material-symbols-outlined">restart_alt</span>
                </button>
                <button 
                    onClick={handleStartPause} 
                    className={`button ${isActive ? 'button-outlined' : 'button-filled'} flex-grow justify-center`}
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
        <div className="bg-surface-container-high border border-outline-variant rounded-2xl p-4 flex flex-col justify-between h-48 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
             {/* Background Decor */}
            <div className="absolute -top-4 -right-4 text-[100px] text-on-surface opacity-[0.03] pointer-events-none rotate-12">
                 casino
            </div>

            <div className="flex items-center gap-2 text-tertiary z-10">
                <span className="material-symbols-outlined filled-icon">casino</span>
                <span className="m3-label-small font-bold uppercase tracking-wider">Estrazione</span>
            </div>

            <div className="z-10 text-center w-full flex-grow flex items-center justify-center">
                {selectedStudent ? (
                    <div className={`transition-all duration-200 ${isSelecting ? 'opacity-70 scale-95 blur-[1px]' : 'opacity-100 scale-100'}`}>
                         <span className="m3-headline-small font-bold block leading-tight text-on-surface">{selectedStudent.cognome}</span>
                         <span className="m3-label-large opacity-80 block text-on-surface-variant">{selectedStudent.nome}</span>
                    </div>
                ) : (
                     <div className="text-on-surface-variant/40 flex flex-col items-center">
                        <span className="material-symbols-outlined m3-display-small mb-1">groups</span>
                        <span className="m3-body-small font-medium">Pronto ad estrarre</span>
                     </div>
                )}
            </div>

            <button 
                onClick={handleSelect} 
                disabled={isSelecting || presentStudents.length === 0} 
                className="button button-filled w-full justify-center z-10 bg-tertiary text-on-tertiary shadow-sm mt-auto"
            >
                {isSelecting ? 'Estrazione...' : 'Estrai Studente'}
            </button>
        </div>
    );
};


const ClassroomTools: React.FC<ClassroomToolsProps> = ({ students, studentAttendance }) => {
    const presentStudents = students.filter(s => studentAttendance[s.id] === 'presente');
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TimerWidget />
            <RandomStudentWidget presentStudents={presentStudents} />
            
            {/* Placeholder for future tools to fill grid if needed */}
            {/* <div className="sm:col-span-2"> ... </div> */}
        </div>
    );
};

export default ClassroomTools;
