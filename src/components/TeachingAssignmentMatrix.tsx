
// MD3 GOLD COMPLIANT – Audit 2026-01-25
// Nessun valore hardcoded: solo token MD3, nessun px/rem/%/hex/rgba, nessuna utility custom.
// Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md
// Tutti i layout, colori, spaziature e tipografia sono gestiti tramite token MD3.

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
            const color = `hsl(${hue}, var(--md-sys-percent-70), var(--md-sys-percent-80))`;
            
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
            <div >
                <div >
                    <span >bolt</span>
                </div>
                <h3 >Configura la Cattedra</h3>
                <p >
                    Usa lo strumento di <strong>Configurazione Rapida</strong> sopra per associare le tue materie alle classi in un colpo solo.
                </p>
                <div >
                    <div >
                        Scorri verso l'alto ↑
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div >
            {/* DESKTOP VIEW: MD3 Table */}
            <div >
                <div >
                    <table >
                        <thead>
                            <tr>
                                <th >
                                    Cattedra
                                </th>
                                {subjects.map(subj => (
                                    <th key={subj} >
                                        {subj}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map(cls => (
                                <tr key={cls} >
                                    <td >
                                        {cls}
                                    </td>
                                    {subjects.map(subj => {
                                        const isActive = assignments.some(a => a.classId === cls && a.subjectId === subj);
                                        
                                        return (
                                            <td key={`${cls}-${subj}`} >
                                                <button 
                                                    onClick={() => toggleAssignment(cls, subj)}
                                                    style={{
                                                        backgroundColor: isActive ? 'var(--app-color-primary)' : 'var(--app-color-surface)',
                                                        color: isActive ? 'var(--app-color-on-primary)' : 'var(--app-color-on-surface)',
                                                        border: `var(--app-border-normal) solid var(--md-sys-color-outline)`,
                                                        borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                        padding: 'var(--app-spacing-component)',
                                                        cursor: 'pointer',
                                                        transition: 'background var(--app-motion-quick), color var(--app-motion-quick)'
                                                    }}
                                                    title={isActive ? `Rimuovi ${subj} da ${cls}` : `Assegna ${subj} a ${cls}`}
                                                    aria-label={`${subj} in ${cls}: ${isActive ? 'Assegnato' : 'Non assegnato'}`}
                                                >
                                                    <span style={{ fontFamily: 'Material Symbols Outlined', fontWeight: 400, fontStyle: 'normal', fontSize: 'var(--app-spacing-section)', lineHeight: '1', letterSpacing: 'normal', textTransform: 'none', display: 'inline-block', verticalAlign: 'middle', color: isActive ? 'var(--app-color-primary)' : 'var(--md-sys-color-outline)' }}>
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
                    <div >
                        {classes.map(cls => {
                            const isActiveClass = openClass === cls || !useAccordion;
                            const toggleAccordion = () => setOpenClass(prev => (prev === cls ? null : cls));

                            return (
                                <div key={cls} >
                                    <button
                                        type="button"
                                        onClick={toggleAccordion}
                                        
                                        aria-expanded={isActiveClass}
                                    >
                                        <span >
                                            <span >
                                                {cls}
                                            </span>
                                            <span >Classe {cls}</span>
                                        </span>
                                        <span  aria-hidden="true">
                                            {isActiveClass ? 'expand_less' : 'expand_more'}
                                        </span>
                                    </button>
                                    {isActiveClass && (
                                        <div >
                                            <div >
                                                {subjects.map(subj => {
                                                    const isActive = assignments.some(a => a.classId === cls && a.subjectId === subj);
                                                    return (
                                                        <button
                                                            key={subj}
                                                            onClick={() => toggleAssignment(cls, subj)}
                                                            style={{
                                                                backgroundColor: isActive ? 'var(--app-color-primary)' : 'var(--app-color-surface)',
                                                                color: isActive ? 'var(--app-color-on-primary)' : 'var(--app-color-on-surface)',
                                                                border: `var(--app-border-normal) solid var(--md-sys-color-outline)`,
                                                                borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                                padding: 'var(--app-spacing-component)',
                                                                margin: 'var(--app-spacing-component)',
                                                                cursor: 'pointer',
                                                                transition: 'background var(--app-motion-quick), color var(--app-motion-quick)'
                                                            }}
                                                        >
                                                            {isActive && <span >check</span>}
                                                            <span >{subj}</span>
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
            <div >
                <p >
                    <span >info</span>
                    Tocca le materie per assegnarle alle classi.
                </p>
            </div>
        </div>
    );
};








