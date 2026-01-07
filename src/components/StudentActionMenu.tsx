
import React, { useMemo } from 'react';
import { Studente, Valutazione, ParticipationEntry } from '../types';
import { calculatePerformance } from '../utils/evaluationUtils';
import { Avatar, M3Popover } from './ui';

interface StudentActionMenuProps {
    student: Studente;
    anchorEl: HTMLElement | null;
    evaluations: Valutazione[];
    participation: ParticipationEntry[];
    onClose: () => void;
    onAddEvaluation: () => void;
    onViewProfile: () => void;
}

const StudentActionMenu: React.FC<StudentActionMenuProps> = ({
    student,
    anchorEl,
    evaluations,
    participation,
    onClose,
    onAddEvaluation,
    onViewProfile,
}) => {
    const { grade, trend } = useMemo(
        () => calculatePerformance(student.id, 'Complessivo', evaluations),
        [student.id, evaluations]
    );

    const participationToday = useMemo(
        () => participation.filter(p => p.type === 'positive' || p.type === 'collaboration' || p.type === 'question').length,
        [participation]
    );

    const trendClass = trend === 'up' ? 'var(--md-sys-color-tertiary)' : trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-on-surface-variant)';
    const trendIcon = trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'trending_flat';

    return (
        <M3Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            minWidth={280}
            maxWidth={280}
        >
            {/* Header with student info */}
            <div
                style={{
                    backgroundColor: 'var(--md-sys-color-primary-container)',
                    color: 'var(--md-sys-color-on-primary-container)',
                    padding: 'var(--md-sys-spacing-4)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)', marginBottom: 'var(--md-sys-spacing-4)' }}>
                    <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', color: 'var(--md-sys-color-on-primary-container)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {student.cognome} {student.nome}
                        </h3>
                        <p style={{ margin: 0, fontSize: 'var(--md-sys-typescale-body-small-size)', opacity: 0.8 }}>
                            Classe {student.classe}
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 'var(--md-sys-typescale-body-small-size)',
                    }}
                >
                    {/* Media */}
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: 'var(--md-sys-typescale-label-small-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Media
                        </p>
                        <p style={{ margin: 0, fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)' }}>
                            {grade || '-'}
                        </p>
                    </div>

                    <div style={{ width: '1px', height: '32px', backgroundColor: 'currentColor', opacity: 0.3 }} />

                    {/* Trend */}
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: 'var(--md-sys-typescale-label-small-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Trend
                        </p>
                        <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', color: trendClass }}>
                            {trendIcon}
                        </span>
                    </div>

                    <div style={{ width: '1px', height: '32px', backgroundColor: 'currentColor', opacity: 0.3 }} />

                    {/* Badge/Participation */}
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: 'var(--md-sys-typescale-label-small-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Badge
                        </p>
                        <p style={{ margin: 0, fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)' }}>
                            {participationToday}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{ padding: 'var(--md-sys-spacing-2)' }}>
                <p style={{ margin: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4) var(--md-sys-spacing-2) var(--md-sys-spacing-4)', fontSize: 'var(--md-sys-typescale-body-small-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', textTransform: 'uppercase', color: 'var(--md-sys-color-on-surface-variant)', letterSpacing: '0.5px' }}>
                    Azioni Rapide
                </p>

                <button
                    onClick={() => {
                        onAddEvaluation();
                        onClose();
                    }}
                    className="m3-interactive-button"
                    style={{ marginBottom: 'var(--md-sys-spacing-2)' }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', color: 'var(--md-sys-color-primary)' }}>add_circle</span>
                    <span>Nuova Valutazione</span>
                </button>

                <button
                    onClick={() => {
                        onViewProfile();
                        onClose();
                    }}
                    className="m3-interactive-button"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', color: 'var(--md-sys-color-secondary)' }}>person_search</span>
                    <span>Profilo Completo</span>
                </button>
            </div>
        </M3Popover>
    );
};

export default StudentActionMenu;
