
/* M3Expressive - ParticipationBadgePicker Component */

import React, { useEffect, useRef } from 'react';
import { ParticipationBadge } from '../types';
import { PARTICIPATION_BADGES } from '../constants';

interface ParticipationBadgePickerProps {
    anchorEl: HTMLElement | null;
    onSelect: (badgeId: ParticipationBadge['id']) => void;
    onClose: () => void;
}

const ParticipationBadgePicker: React.FC<ParticipationBadgePickerProps> = ({ anchorEl, onSelect, onClose }) => {
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

    const style: React.CSSProperties = {};
    if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        style.position = 'fixed';
        style.top = `${rect.bottom + 8}px`;
        const leftPos = Math.min(window.innerWidth - 300, Math.max(16, rect.left - 100));
        style.left = `${leftPos}px`;
    }

    return (
        <div ref={popoverRef} className="participation-badge-picker-container m3-popup-menu" style={style}>
            <p className="participation-badge-picker-title">Assegna Badge</p>
            <div className="participation-badge-picker-grid">
                {PARTICIPATION_BADGES.map(badge => (
                    <button 
                        key={badge.id}
                        className="participation-badge-picker-button"
                        onClick={() => onSelect(badge.id)}
                    >
                        <span className="participation-badge-picker-icon material-symbols-outlined" style={{ color: badge.color }}>
                            {badge.icon}
                        </span>
                        <span className="participation-badge-picker-label">{badge.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ParticipationBadgePicker;


