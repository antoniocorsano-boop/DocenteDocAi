
import React, { useEffect, useRef, useMemo } from 'react';
import { Studente, Valutazione, ParticipationEntry } from '../types';
import { calculatePerformance } from '../utils/evaluationUtils';
import Avatar from './Avatar';

interface StudentActionMenuProps {
    student: Studente;
    anchorEl: HTMLElement;
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
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const { grade, trend } = useMemo(
        () => calculatePerformance(student.id, 'Complessivo', evaluations),
        [student.id, evaluations]
    );

    const participationToday = useMemo(
        () => participation.filter(p => p.type === 'positive' || p.type === 'collaboration' || p.type === 'question').length,
        [participation]
    );

    const trendClass = trend === 'up' ? 'text-tertiary' : trend === 'down' ? 'text-error' : 'text-on-surface-variant';
    const trendIcon = trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'trending_flat';

    const style: React.CSSProperties = {};
    if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        style.position = 'fixed';
        style.top = `${rect.bottom + 8}px`;
        const leftPos = Math.min(window.innerWidth - 300, Math.max(16, rect.left - 200));
        style.left = `${leftPos}px`;
    }

    return (
        <div ref={popoverRef} className="m3-popup-menu" style={{ ...style, width: '280px' }}>
            <div className="popup-header bg-primary-container text-on-primary-container">
                <div className="flex items-center gap-3 mb-2">
                    <Avatar name={student.nome} surname={student.cognome} size="medium" />
                    <div className="min-w-0">
                        <h3 className="m3-title-medium truncate">{student.cognome} {student.nome}</h3>
                        <p className="text-xs opacity-80">Classe {student.classe}</p>
                    </div>
                </div>
                
                {/* Refactored Stats Row */}
                <div className="student-popup-stats-row">
                    <div className="student-popup-stat-item">
                        <span className="text-[10px] uppercase font-bold opacity-70">Media</span>
                        <span className="m3-title-medium font-bold">{grade || '-'}</span>
                    </div>
                    <div className="student-popup-stat-divider"></div>
                    <div className="student-popup-stat-item">
                        <span className="text-[10px] uppercase font-bold opacity-70">Trend</span>
                        <span className={`material-symbols-outlined text-lg ${trendClass}`}>{trendIcon}</span>
                    </div>
                    <div className="student-popup-stat-divider"></div>
                    <div className="student-popup-stat-item">
                        <span className="text-[10px] uppercase font-bold opacity-70">Badge</span>
                        <span className="m3-title-medium">{participationToday}</span>
                    </div>
                </div>
            </div>
            
            <div className="p-1">
                <div className="m3-menu-section-label">Azioni Rapide</div>
                
                <button onClick={onAddEvaluation} className="m3-menu-item">
                    <span className="material-symbols-outlined text-primary">add_circle</span>
                    <span>Nuova Valutazione</span>
                </button>
                 <button onClick={onViewProfile} className="m3-menu-item">
                    <span className="material-symbols-outlined text-secondary">person_search</span>
                    <span>Profilo Completo</span>
                </button>
            </div>
        </div>
    );
};

export default StudentActionMenu;
