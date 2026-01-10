
// M3Expressive: TeachingAssignmentMatrix - Teaching assignment configuration matrix with M3 tokens
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
            <div className="teaching-assignment-matrix-empty-state">
                <div className="teaching-assignment-matrix-empty-icon-container">
                    <span className="material-symbols-outlined teaching-assignment-matrix-empty-icon">bolt</span>
                </div>
                <h3 className="teaching-assignment-matrix-empty-title">Configura la Cattedra</h3>
                <p className="teaching-assignment-matrix-empty-text">
                    Usa lo strumento di <strong>Configurazione Rapida</strong> sopra per associare le tue materie alle classi in un colpo solo.
                </p>
                <div className="teaching-assignment-matrix-empty-hint">
                    <div className="teaching-assignment-matrix-empty-hint-content">
                        Scorri verso l'alto ↑
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="teaching-assignment-matrix-container">
            {/* DESKTOP VIEW: MD3 Table */}
            <div className="teaching-assignment-matrix-desktop-table">
                <div className="teaching-assignment-matrix-table-scroll">
                    <table className="teaching-assignment-matrix-table">
                        <thead>
                            <tr>
                                <th className="teaching-assignment-matrix-table-header">
                                    Cattedra
                                </th>
                                {subjects.map(subj => (
                                    <th key={subj} className="teaching-assignment-matrix-table-header-cell">
                                        {subj}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map(cls => (
                                <tr key={cls} className="teaching-assignment-matrix-table-body-row">
                                    <td className="teaching-assignment-matrix-table-body-cell">
                                        {cls}
                                    </td>
                                    {subjects.map(subj => {
                                        const isActive = assignments.some(a => a.classId === cls && a.subjectId === subj);
                                        
                                        return (
                                            <td key={`${cls}-${subj}`} className="teaching-assignment-matrix-table-data-cell">
                                                <button 
                                                    onClick={() => toggleAssignment(cls, subj)}
                                                    className={`teaching-assignment-matrix-toggle-button ${isActive ? 'active' : ''}`}
                                                    title={isActive ? `Rimuovi ${subj} da ${cls}` : `Assegna ${subj} a ${cls}`}
                                                    aria-label={`${subj} in ${cls}: ${isActive ? 'Assegnato' : 'Non assegnato'}`}
                                                >
                                                    <span className={`material-symbols-outlined teaching-assignment-matrix-toggle-icon ${isActive ? 'active' : ''}`}>
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
                    <div className="teaching-assignment-matrix-mobile-view">
                        {classes.map(cls => {
                            const isActiveClass = openClass === cls || !useAccordion;
                            const toggleAccordion = () => setOpenClass(prev => (prev === cls ? null : cls));

                            return (
                                <div key={cls} className="teaching-assignment-matrix-mobile-card">
                                    <button
                                        type="button"
                                        onClick={toggleAccordion}
                                        className="teaching-assignment-matrix-mobile-header"
                                        aria-expanded={isActiveClass}
                                    >
                                        <span className="teaching-assignment-matrix-mobile-header-content">
                                            <span className="teaching-assignment-matrix-mobile-class-badge">
                                                {cls}
                                            </span>
                                            <span className="teaching-assignment-matrix-mobile-class-label">Classe {cls}</span>
                                        </span>
                                        <span className="teaching-assignment-matrix-mobile-expand-icon" aria-hidden="true">
                                            {isActiveClass ? 'expand_less' : 'expand_more'}
                                        </span>
                                    </button>
                                    {isActiveClass && (
                                        <div className="teaching-assignment-matrix-mobile-content">
                                            <div className="teaching-assignment-matrix-mobile-chips">
                                                {subjects.map(subj => {
                                                    const isActive = assignments.some(a => a.classId === cls && a.subjectId === subj);
                                                    return (
                                                        <button
                                                            key={subj}
                                                            onClick={() => toggleAssignment(cls, subj)}
                                                            className={`teaching-assignment-matrix-mobile-chip ${isActive ? 'active' : ''}`}
                                                        >
                                                            {isActive && <span className="teaching-assignment-matrix-mobile-chip-check">check</span>}
                                                            <span className="teaching-assignment-matrix-mobile-chip-label">{subj}</span>
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

            {/* INFO SECTION */}
            <div className="teaching-assignment-matrix-info-section">
                <p className="teaching-assignment-matrix-info-text">
                    <span className="teaching-assignment-matrix-info-icon">info</span>
                    Tocca le materie per assegnarle alle classi.
                </p>
            </div>
        </div>
    );
};


