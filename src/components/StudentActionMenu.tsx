
/* M3Expressive - StudentActionMenu Component */

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
            <div className="student-action-header">
                <div className="student-action-header-row">
                    <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                    <div className="student-action-header-info">
                        <h3 className="student-action-header-name">{student.cognome} {student.nome}</h3>
                        <p className="student-action-header-class">Classe {student.classe}</p>
                    </div>
                </div>
                {/* Stats Row */}
                <div className="student-action-stats-row">
                    {/* Media */}
                    <div className="student-action-stats-col">
                        <p className="student-action-stats-label">Media</p>
                        <p className="student-action-stats-value">{grade || '-'}</p>
                    </div>
                    <div className="student-action-stats-divider" />
                    {/* Trend */}
                    <div className="student-action-stats-col">
                        <p className="student-action-stats-label">Trend</p>
                        <span className="material-symbols-outlined student-action-trend-icon" style={{ color: trendClass }}>{trendIcon}</span>
                    </div>
                    <div className="student-action-stats-divider" />
                    {/* Badge/Participation */}
                    <div className="student-action-stats-col">
                        <p className="student-action-stats-label">Badge</p>
                        <p className="student-action-stats-value">{participationToday}</p>
                    </div>
                </div>
            </div>
            {/* Actions */}
            <div className="student-action-actions">
                <p className="student-action-actions-label">Azioni Rapide</p>
                <button
                    onClick={() => {
                        onAddEvaluation();
                        onClose();
                    }}
                    className="m3-interactive-button student-action-add-btn"
                >
                    <span className="material-symbols-outlined student-action-add-icon">add_circle</span>
                    <span>Nuova Valutazione</span>
                </button>
                <button
                    onClick={() => {
                        onViewProfile();
                        onClose();
                    }}
                    className="m3-interactive-button student-action-profile-btn"
                >
                    <span className="material-symbols-outlined student-action-profile-icon">person_search</span>
                    <span>Profilo Completo</span>
                </button>
            </div>
        </M3Popover>
    );
};

export default StudentActionMenu;


