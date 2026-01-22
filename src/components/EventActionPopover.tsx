// LEGACY - MD3 Non-compliant

// M3Expressive: EventActionPopover - Event action management popover with M3 tokens
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
                <div >
                    {event.descrizione}
                </div>
            )}

            {/* Action Buttons */}
            <div >
                <button
                    onClick={handleEdit}
                    
                >
                    <span style={{
  fontFamily: 'Material Symbols Outlined',
  fontSize: 'var(--md-sys-typescale-body-medium-size)'
}}>
                        edit
                    </span>
                    <span>Modifica</span>
                </button>

                <button
                    onClick={handleDelete}
                    
                >
                    <span style={{
  fontFamily: 'Material Symbols Outlined',
  fontSize: 'var(--md-sys-typescale-body-medium-size)'
}}>
                        delete
                    </span>
                    <span>Elimina</span>
                </button>
            </div>
        </M3Popover>
    );
};

export default EventActionPopover;








