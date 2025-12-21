
import React, { useEffect, useRef } from 'react';
import { EventoCalendario } from '../types';

interface EventActionPopoverProps {
    event: EventoCalendario;
    anchorEl: HTMLElement;
    onClose: () => void;
    onEdit: (event: EventoCalendario) => void;
    onDelete: (eventId: string) => void;
}

const EventActionPopover: React.FC<EventActionPopoverProps> = ({ event, anchorEl, onClose, onEdit, onDelete }) => {
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
        let top = rect.bottom + 8;
        let left = rect.left;
        // Boundary adjustment
        if (top + 200 > window.innerHeight) top = rect.top - 200;
        if (left + 280 > window.innerWidth) left = window.innerWidth - 280 - 16;
        style.top = `${top}px`;
        style.left = `${left}px`;
    }

    return (
        <div ref={popoverRef} className="m3-popup-menu" style={style}>
            <div className="p-4 bg-surface-container-high rounded-xl mb-2">
                <h3 className="m3-title-medium">{event.titolo}</h3>
                <p className="m3-body-small text-on-surface-variant mt-1">
                    {new Date(event.data).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long' })}
                    {event.oraInizio && ` • ${event.oraInizio}`}
                </p>
                {event.descrizione && <p className="m3-body-medium mt-2 opacity-80 line-clamp-3">{event.descrizione}</p>}
            </div>
            
            <button onClick={() => { onEdit(event); onClose(); }} className="m3-menu-item">
                <span className="material-symbols-outlined">edit</span>
                <span>Modifica</span>
            </button>
            <button onClick={() => { if (window.confirm('Sei sicuro?')) onDelete(event.id); onClose(); }} className="m3-menu-item">
                <span className="material-symbols-outlined text-error">delete</span>
                <span className="text-error">Elimina</span>
            </button>
        </div>
    );
};

export default EventActionPopover;
