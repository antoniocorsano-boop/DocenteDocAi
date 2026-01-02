
import React, { useEffect, useMemo, useState } from 'react';
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
        // ... existing code ...
    }

    if (assignments.length === 0) {
        return (
            <div className="p-8 text-center border-2 border-dashed border-primary/20 rounded-3xl bg-primary-container/5 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-4xl text-primary">bolt</span>
                </div>
                <h3 className="m3-title-medium font-black text-on-surface mb-2 uppercase tracking-wide">Configura la Cattedra</h3>
                <p className="m3-body-small text-on-surface-variant max-w-[280px] mx-auto mb-6 leading-relaxed">
                    Usa lo strumento di <strong>Configurazione Rapida</strong> sopra per associare le tue materie alle classi in un colpo solo.
                </p>
                <div className="flex justify-center">
                    <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest animate-pulse">
                        Scorri verso l'alto ↑
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="teaching-assignment-matrix-container">
            {/* DESKTOP VIEW: MD3 Table */}
            <div className="hidden md:block overflow-hidden border border-outline-variant rounded-xl bg-surface-container-low shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 text-left sticky left-0 bg-surface-container-high z-10 border-b border-r border-outline-variant min-w-[120px] text-on-surface-variant uppercase tracking-widest text-[11px] font-black shadow-sm">
                                    Cattedra
                                </th>
                                {subjects.map(subj => (
                                    <th key={subj} className="p-4 text-center min-w-[110px] border-b border-outline-variant font-bold text-on-surface-variant bg-surface-container-high whitespace-nowrap uppercase tracking-wide text-[11px]">
                                        {subj}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map(cls => (
                                <tr key={cls} className="border-b border-outline-variant/30 last:border-none hover:bg-surface-container transition-colors">
                                    <td className="p-4 font-bold sticky left-0 bg-surface-container-low border-r border-outline-variant z-10 text-primary m3-title-small">
                                        {cls}
                                    </td>
                                    {subjects.map(subj => {
                                        const isActive = assignments.some(a => a.classId === cls && a.subjectId === subj);
                                        
                                        return (
                                            <td key={`${cls}-${subj}`} className="p-2 text-center">
                                                <button 
                                                    onClick={() => toggleAssignment(cls, subj)}
                                                    className={`
                                                        w-10 h-10 rounded-xl border-2 transition-all duration-200 flex items-center justify-center mx-auto
                                                        ${isActive 
                                                            ? 'scale-105 shadow-md border-primary bg-primary text-on-primary' 
                                                            : 'border-outline-variant bg-surface-container-highest/20 text-primary/40 hover:bg-primary-container/30 hover:border-primary hover:text-primary hover:scale-105'}
                                                    `}
                                                    title={isActive ? `Rimuovi ${subj} da ${cls}` : `Assegna ${subj} a ${cls}`}
                                                    aria-label={`${subj} in ${cls}: ${isActive ? 'Assegnato' : 'Non assegnato'}`}
                                                >
                                                    <span className={`material-symbols-outlined text-lg ${isActive ? 'font-black' : 'opacity-60'}`}>
                                                        {isActive ? 'check_circle' : 'add_circle'}
                                                    </span>
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MOBILE VIEW: List of Cards with Chips */}
            {(() => {
                const useAccordion = useMemo(() => classes.length >= 6 || subjects.length >= 8, [classes.length, subjects.length]);
                const [openClass, setOpenClass] = useState<string | null>(classes[0] || null);

                useEffect(() => {
                    if (!classes.includes(openClass || '')) {
                        setOpenClass(classes[0] || null);
                    }
                }, [classes, openClass]);

                return (
                    <div className="block md:hidden space-y-3">
                        {classes.map(cls => {
                            const isActiveClass = openClass === cls || !useAccordion;
                            const toggleAccordion = () => setOpenClass(prev => (prev === cls ? null : cls));

                            return (
                                <div key={cls} className="bg-surface-container-low border border-outline-variant rounded-2xl shadow-sm">
                                    <button
                                        type="button"
                                        onClick={toggleAccordion}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-surface-container-highest text-on-surface font-black text-sm uppercase tracking-wider text-left"
                                        aria-expanded={isActiveClass}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center text-xs font-black">
                                                {cls}
                                            </span>
                                            <span>Classe {cls}</span>
                                        </span>
                                        <span className="material-symbols-outlined text-lg transition-transform duration-200" aria-hidden="true">
                                            {isActiveClass ? 'expand_less' : 'expand_more'}
                                        </span>
                                    </button>
                                    {isActiveClass && (
                                        <div className="px-4 py-3 border-t border-outline-variant">
                                            <div className="flex flex-wrap gap-2">
                                                {subjects.map(subj => {
                                                    const isActive = assignments.some(a => a.classId === cls && a.subjectId === subj);
                                                    return (
                                                        <button
                                                            key={subj}
                                                            onClick={() => toggleAssignment(cls, subj)}
                                                            className={`
                                                                chip-expressive chip-expressive--clickable transition-all
                                                                ${isActive 
                                                                    ? 'bg-primary text-on-primary shadow-md scale-105' 
                                                                    : 'bg-surface-container-highest text-on-surface-variant border border-outline-variant'}
                                                            `}
                                                        >
                                                            {isActive && <span className="material-symbols-outlined text-[16px]">check</span>}
                                                            <span className="chip-expressive__label">{subj}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            })()}

            <div className="mt-4 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl text-center">
                <p className="m3-label-medium text-on-surface-variant flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Tocca le materie per assegnarle alle classi.
                </p>
            </div>
        </div>
    );
};
