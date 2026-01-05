
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
        <div ref={popoverRef} className="m3-popup-menu !p-3 w-[280px]" style={style}>
            <p className="m3-label-small text-on-surface-variant mb-6 px-1">Assegna Badge</p>
            <div className="grid grid-cols-2 gap-6">
                {PARTICIPATION_BADGES.map(badge => (
                    <button 
                        key={badge.id}
                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border border-transparent hover:border-outline-variant"
                        onClick={() => onSelect(badge.id)}
                    >
                        <span className="material-symbols-outlined m3-icon-medium mb-4" style={{ color: badge.color }}>
                            {badge.icon}
                        </span>
                        <span className="m3-label-small text-center">{badge.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ParticipationBadgePicker;
