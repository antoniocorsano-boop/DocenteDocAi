
import React from 'react';
import { M3Popover } from './ui';
import { EventoCalendario } from '../types';

interface EventActionPopoverProps {
    event: EventoCalendario;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onEdit: (event: EventoCalendario) => void;
    onDelete: (eventId: string) => void;
}

const EventActionPopover: React.FC<EventActionPopoverProps> = ({ event, anchorEl, onClose, onEdit, onDelete }) => {
    const handleEdit = () => {
        onEdit(event);
        onClose();
    };

    const handleDelete = () => {
        if (window.confirm('Sei sicuro?')) {
            onDelete(event.id);
            onClose();
        }
    };

    // Format event date
    const eventDate = new Date(event.data).toLocaleDateString('it-IT', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'long' 
    });
    const eventTime = event.oraInizio ? ` - ${event.oraInizio}` : '';
    const subtitle = `${eventDate}${eventTime}`;

    return (
        <M3Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            title={event.titolo}
            subtitle={subtitle}
            minWidth={280}
        >
            {/* Event Description */}
            {event.descrizione && (
                <div style={{
                    padding: 'var(--md-sys-spacing-4)',
                    marginBottom: 'var(--md-sys-spacing-2)',
                    backgroundColor: 'var(--md-sys-color-surface-container-high)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    color: 'var(--md-sys-color-on-surface)',
                    fontSize: 'var(--md-sys-typescale-body-small-size)',
                    opacity: 0.8,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}>
                    {event.descrizione}
                </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', padding: '0 var(--md-sys-spacing-2) var(--md-sys-spacing-2) var(--md-sys-spacing-2)', gap: 'var(--md-sys-spacing-1)' }}>
                <button
                    onClick={handleEdit}
                    className="m3-interactive-button"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)' }}>
                        edit
                    </span>
                    <span>Modifica</span>
                </button>

                <button
                    onClick={handleDelete}
                    className="m3-interactive-button m3-interactive-error"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)' }}>
                        delete
                    </span>
                    <span>Elimina</span>
                </button>
            </div>
        </M3Popover>
    );
};

export default EventActionPopover;

