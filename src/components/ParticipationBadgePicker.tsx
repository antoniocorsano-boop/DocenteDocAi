// LEGACY - MD3 Non-compliant

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
        <div ref={popoverRef}  style={style}>
            <p >Assegna Badge</p>
            <div >
                {PARTICIPATION_BADGES.map(badge => (
                    <button 
                        key={badge.id}
                        
                        onClick={() => onSelect(badge.id)}
                    >
                        <span  style={{ color: badge.color }}>
                            {badge.icon}
                        </span>
                        <span >{badge.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ParticipationBadgePicker;







