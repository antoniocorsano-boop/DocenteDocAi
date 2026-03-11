// MD3 Compliant

// M3Expressive: EventActionPopover - Event action management popover with M3 tokens
import React from 'react';
import Box from '@mui/material/Box';
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    {event.descrizione}
                </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                <button
                    onClick={handleEdit}
                    
                >
                    <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{
  fontSize: 'var(--md-sys-typescale-body-medium-font-size)'
}}>
                        edit
                    </Box>
                    <span>Modifica</span>
                </button>

                <button
                    onClick={handleDelete}
                    
                >
                    <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{
  fontSize: 'var(--md-sys-typescale-body-medium-font-size)'
}}>
                        delete
                    </Box>
                    <span>Elimina</span>
                </button>
            </div>
        </M3Popover>
    );
};

export default EventActionPopover;

