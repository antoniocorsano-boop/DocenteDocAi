import React, { useState, useRef } from 'react';
import { Studente, Lezione, HomeworkStatus, ParticipationEntry, ObservationEntry } from '../../types';
import { Avatar } from '../ui';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

type AttendanceStatus = 'presente' | 'assente' | 'ritardo';

export type StudentStat = {
    student: Studente;
    grade: string;
    trend: string;
    writtenCount: number;
    writtenAvg: string;
    oralCount: number;
    oralAvg: string;
    notes: ObservationEntry | string;
};

interface ClassroomRegisterTabProps {
    lesson: Lezione;
    studentStats: StudentStat[];
    studentAttendance: Record<string, AttendanceStatus>;
    homeworkCheck: Record<string, HomeworkStatus>;
    participation: Record<string, ParticipationEntry[]>;
    checkedObjectives: Record<number, boolean>;
    onAttendanceToggle: (studentId: string) => void;
    onObjectiveCheck: (index: number, isChecked: boolean) => void;
    onSelectStudentForActions: (student: Studente) => void;
    onViewStudentProfile: (student: Studente) => void;
}

export const ClassroomRegisterTab: React.FC<ClassroomRegisterTabProps> = ({
    lesson,
    studentStats,
    studentAttendance,
    homeworkCheck,
    participation,
    checkedObjectives,
    onAttendanceToggle,
    onObjectiveCheck,
    onSelectStudentForActions,
    onViewStudentProfile,
}) => {
    const [focusedStudentIndex, setFocusedStudentIndex] = useState(0);
    const studentGridRef = useRef<HTMLDivElement>(null);

    const handleStudentGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const keysToHandle = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
        if (!keysToHandle.includes(e.key)) return;
        e.preventDefault();
        const itemsPerRow = 4;
        const totalItems = studentStats.length;
        let newIndex = focusedStudentIndex;
        switch (e.key) {
            case 'ArrowUp': newIndex = Math.max(0, focusedStudentIndex - itemsPerRow); break;
            case 'ArrowDown': newIndex = Math.min(totalItems - 1, focusedStudentIndex + itemsPerRow); break;
            case 'ArrowLeft': newIndex = focusedStudentIndex > 0 ? focusedStudentIndex - 1 : 0; break;
            case 'ArrowRight': newIndex = focusedStudentIndex < totalItems - 1 ? focusedStudentIndex + 1 : totalItems - 1; break;
            case 'Home': newIndex = 0; break;
            case 'End': newIndex = totalItems - 1; break;
        }
        setFocusedStudentIndex(newIndex);
    };

    return (
        <div style={{ marginTop: 'var(--md-sys-spacing-4)' }}>
            {lesson.obiettivi && (
                <div style={{ backgroundColor: 'var(--md-sys-color-on-primary)', borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-6)', border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)', marginBottom: 'var(--md-sys-spacing-8)' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'var(--md-sys-typescale-weight-bold)', color: 'var(--md-sys-color-primary)', textTransform: 'uppercase', marginBottom: 'var(--md-sys-spacing-4)' }}>Obiettivi Didattici</Typography>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-1)' }}>
                        {lesson.obiettivi.split('\n').filter(o => o.trim()).map((obj, idx) => (
                            <label key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--md-sys-spacing-3)', cursor: 'pointer', padding: 'var(--md-sys-spacing-1)', borderRadius: 'var(--md-sys-shape-corner-small)' }}>
                                <input
                                    type="checkbox"
                                    checked={checkedObjectives[idx] || false}
                                    onChange={(e) => onObjectiveCheck(idx, e.target.checked)}
                                    style={{ width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)' }}
                                />
                                <Typography variant="body2" sx={{ lineHeight: '1.5', color: checkedObjectives[idx] ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-on-surface)', textDecoration: checkedObjectives[idx] ? 'line-through' : 'none' }}>
                                    {obj.replace(/^- /, '')}
                                </Typography>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <div
                style={{ display: 'grid', gridTemplateColumns: 'var(--md-sys-grid-fr-1)', gap: 'var(--md-sys-spacing-4)' }}
                ref={studentGridRef}
                onKeyDown={handleStudentGridKeyDown}
                role="grid"
                aria-label="Registro studenti con voti e presenze"
            >
                {studentStats.map((stat, index) => {
                    const student = stat.student;
                    const status = studentAttendance[student.id] || 'presente';
                    const hwStatus = homeworkCheck[student.id];
                    const badges = participation[student.id] || [];
                    const isFocused = index === focusedStudentIndex;

                    return (
                        <div
                            key={student.id}
                            onClick={() => onViewStudentProfile(student)}
                            onFocus={() => setFocusedStudentIndex(index)}
                            tabIndex={isFocused ? 0 : -1}
                            style={{
                                backgroundColor: 'var(--md-sys-color-surface-container)',
                                borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                                boxShadow: 'var(--md-sys-elevation-level2)',
                                border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium)',
                                cursor: 'pointer',
                                outline: isFocused ? 'var(--md-sys-border-width-normal) solid var(--md-sys-color-primary)' : 'none',
                                outlineOffset: 'var(--md-sys-spacing-1)'
                            }}
                            onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    onViewStudentProfile(student);
                                    e.preventDefault();
                                }
                            }}
                            role="gridcell"
                            aria-label={`${student.cognome}, voto, presenze`}
                        >
                            <div style={{ padding: 'var(--md-sys-spacing-3)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'var(--md-sys-grid-fr-1)', gap: 'var(--md-sys-spacing-4)', alignItems: 'center' }}>
                                    {/* Column 1: Avatar + Name + Presence */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onAttendanceToggle(student.id); }}
                                            style={{
                                                width: 'var(--md-sys-spacing-10)',
                                                height: 'var(--md-sys-spacing-10)',
                                                borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: status === 'presente' ? 'var(--md-sys-color-primary-container)' : status === 'assente' ? 'var(--md-sys-color-error-container)' : 'var(--md-sys-color-tertiary-container)',
                                                color: status === 'presente' ? 'var(--md-sys-color-on-primary-container)' : status === 'assente' ? 'var(--md-sys-color-on-error-container)' : 'var(--md-sys-color-on-tertiary-container)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium)'
                                            }}
                                        >
                                            <span style={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>
                                                {status === 'presente' ? 'check' : status === 'assente' ? 'close' : 'schedule'}
                                            </span>
                                        </button>
                                        <Avatar name={`${student.nome}`} size="md" />
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'var(--md-sys-typescale-weight-bold)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: status === 'assente' ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-on-surface)', textDecoration: status === 'assente' ? 'line-through' : 'none' }}>
                                                {student.cognome} {student.nome}
                                            </Typography>
                                            <Typography variant="caption" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--md-sys-color-on-surface-variant)' }}>{student.classe}</Typography>
                                        </div>
                                    </div>

                                    {/* Column 2: Average + Trend */}
                                    <div style={{ textAlign: 'center' }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 'var(--md-sys-typescale-weight-bold)',
                                                color: parseFloat(stat.grade || '0') > 7 ? 'var(--md-sys-color-primary)' : parseFloat(stat.grade || '0') > 6 ? 'var(--md-sys-color-secondary)' : 'var(--md-sys-color-error)'
                                            }}
                                        >
                                            {stat.grade || '-'}
                                        </Typography>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--md-sys-spacing-1)' }}>
                                            <span
                                                style={{
                                                    fontSize: 'var(--md-sys-typescale-title-large-font-size)',
                                                    color: stat.trend === 'up' ? 'var(--md-sys-color-tertiary)' : stat.trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-on-surface-variant)'
                                                }}
                                            >
                                                {stat.trend === 'up' ? 'trending_up' : stat.trend === 'down' ? 'trending_down' : 'trending_flat'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Column 3: Written Evals */}
                                    <div style={{ textAlign: 'center' }}>
                                        <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Scritti</Typography>
                                        <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>{stat.writtenCount > 0 ? `${stat.writtenCount} - ${stat.writtenAvg}` : '-'}</Typography>
                                    </div>

                                    {/* Column 4: Oral Evals */}
                                    <div style={{ textAlign: 'center' }}>
                                        <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Orali</Typography>
                                        <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>{stat.oralCount > 0 ? `${stat.oralCount} - ${stat.oralAvg}` : '-'}</Typography>
                                    </div>

                                    {/* Column 5: Notes indicator */}
                                    <div style={{ textAlign: 'center' }}>
                                        {stat.notes ? (
                                            <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ color: 'var(--md-sys-color-primary)', fontSize: 'var(--md-sys-typescale-title-large-font-size)' }} title={typeof stat.notes === 'string' ? stat.notes : 'Note presenti'}>edit_note</Box>
                                        ) : (
                                            <Typography variant="body2" sx={{ color: 'var(--md-sys-color-outline)' }}>-</Typography>
                                        )}
                                    </div>

                                    {/* Column 6: Homework + Participation */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
                                        {hwStatus && (
                                            <div
                                                style={{
                                                    padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)',
                                                    borderRadius: 'var(--md-sys-shape-corner-full)',
                                                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                    fontWeight: 'var(--md-sys-typescale-weight-bold)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 'var(--md-sys-typescale-label-large-tracking)',
                                                    backgroundColor: hwStatus === 'missing' ? 'var(--md-sys-color-error-container)' : hwStatus === 'partial' ? 'var(--md-sys-color-surface-container)' : 'var(--md-sys-color-primary-container)',
                                                    color: hwStatus === 'missing' ? 'var(--md-sys-color-on-error-container)' : hwStatus === 'partial' ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-on-primary-container)',
                                                    border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)'
                                                }}
                                            >
                                                {hwStatus === 'missing' ? 'No Compiti' : hwStatus === 'partial' ? 'Parziali' : 'OK'}
                                            </div>
                                        )}
                                        {badges.length > 0 && (
                                            <div
                                                style={{
                                                    padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)',
                                                    borderRadius: 'var(--md-sys-shape-corner-small)',
                                                    backgroundColor: 'var(--md-sys-color-secondary-container)',
                                                    color: 'var(--md-sys-color-on-secondary-container)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--md-sys-spacing-1)'
                                                }}
                                            >
                                                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>star</Box> {badges.length}
                                            </div>
                                        )}
                                    </div>

                                    {/* Column 7: Actions */}
                                    <div style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onSelectStudentForActions(student); }}
                                            style={{
                                                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                                border: 'none',
                                                borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                padding: 'var(--md-sys-spacing-1)',
                                                cursor: 'pointer',
                                                color: 'var(--md-sys-color-on-surface-variant)'
                                            }}
                                            aria-label={`Azioni per ${student.cognome}`}
                                        >
                                            <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-title-large-font-size)' }}>more_vert</Box>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
