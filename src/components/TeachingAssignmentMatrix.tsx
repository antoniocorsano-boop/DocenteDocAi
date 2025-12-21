
import React from 'react';
import { TeachingAssignment } from '../types';
import { generateHueFromString } from '../utils/colorUtils';

interface TeachingAssignmentMatrixProps {
    classes: string[];
    subjects: string[];
    assignments: TeachingAssignment[];
    onChange: (newAssignments: TeachingAssignment[]) => void;
}

export const TeachingAssignmentMatrix: React.FC<TeachingAssignmentMatrixProps> = ({ classes, subjects, assignments, onChange }) => {
    
    const toggleAssignment = (classId: string, subjectId: string) => {
        // Cerca se esiste già l'assegnazione
        const existingIndex = assignments.findIndex(a => a.classId === classId && a.subjectId === subjectId);
        
        if (existingIndex >= 0) {
            // Rimuovi
            const newAssignments = [...assignments];
            newAssignments.splice(existingIndex, 1);
            onChange(newAssignments);
        } else {
            // Aggiungi
            // Genera un colore coerente per la materia
            const hue = generateHueFromString(subjectId);
            const color = `hsl(${hue}, 70%, 80%)`;
            
            const newAssignment: TeachingAssignment = {
                id: `${classId}-${subjectId}`,
                classId,
                subjectId,
                color,
                hoursPerWeek: 2 // Default, eventualmente configurabile in futuro
            };
            onChange([...assignments, newAssignment]);
        }
    };

    if (classes.length === 0 || subjects.length === 0) {
        return (
            <div className="p-6 text-center border border-dashed border-outline-variant rounded-xl bg-surface-container-low">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant opacity-50 mb-2">grid_off</span>
                <p className="m3-body-medium text-on-surface-variant">
                    Definisci prima le <strong>Classi</strong> e le <strong>Materie</strong> qui sopra per configurare la cattedra.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden border border-outline-variant rounded-xl bg-surface-container-low shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr>
                            <th className="p-3 text-left sticky left-0 bg-surface-container-high z-10 border-b border-r border-outline-variant min-w-[100px] text-on-surface font-bold shadow-sm">
                                Cattedra
                            </th>
                            {subjects.map(subj => (
                                <th key={subj} className="p-3 text-center min-w-[100px] border-b border-outline-variant font-bold text-on-surface bg-surface-container-high whitespace-nowrap">
                                    {subj}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map(cls => (
                            <tr key={cls} className="border-b border-outline-variant/50 last:border-none hover:bg-surface-container transition-colors">
                                <td className="p-3 font-bold sticky left-0 bg-surface-container-low border-r border-outline-variant z-10 text-primary">
                                    {cls}
                                </td>
                                {subjects.map(subj => {
                                    const isActive = assignments.some(a => a.classId === cls && a.subjectId === subj);
                                    const hue = generateHueFromString(subj);
                                    const activeStyle = {
                                        backgroundColor: `hsl(${hue}, 70%, 90%)`,
                                        borderColor: `hsl(${hue}, 40%, 50%)`,
                                        color: `hsl(${hue}, 30%, 20%)`
                                    };

                                    return (
                                        <td key={`${cls}-${subj}`} className="p-2 text-center">
                                            <button 
                                                onClick={() => toggleAssignment(cls, subj)}
                                                className={`
                                                    w-10 h-10 rounded-xl border-2 transition-all duration-200 flex items-center justify-center mx-auto
                                                    ${isActive ? 'scale-105 shadow-sm' : 'border-outline-variant bg-surface opacity-50 hover:opacity-100 hover:border-outline hover:scale-105'}
                                                `}
                                                style={isActive ? activeStyle : {}}
                                                title={isActive ? `Rimuovi ${subj} da ${cls}` : `Assegna ${subj} a ${cls}`}
                                                aria-label={`${subj} in ${cls}: ${isActive ? 'Assegnato' : 'Non assegnato'}`}
                                            >
                                                {isActive && <span className="material-symbols-outlined text-lg font-bold">check</span>}
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-2 bg-surface-container-lowest border-t border-outline-variant text-center">
                <p className="text-xs text-on-surface-variant">
                    Spunta le caselle per indicare quali materie insegni in ciascuna classe.
                </p>
            </div>
        </div>
    );
};
