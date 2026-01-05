
import React from 'react';
import { Popover, Box, Button } from '@mui/material';
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

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
                sx: {
                    backgroundColor: 'var(--sys-surface)',
                    border: '1px solid var(--sys-outline-variant)',
                    borderRadius: 'var(--shape-xl)',
                    boxShadow: 'var(--elevation-3)',
                    minWidth: '280px',
                }
            }}
        >
            <Box sx={{ p: 2 }}>
                {/* Event Header */}
                <Box sx={{ p: 2, mb: 2, backgroundColor: 'var(--sys-surface-container-high)', borderRadius: 'calc(var(--shape-md))' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: 'var(--sys-on-surface)', fontSize: '14px', fontWeight: 500 }}>
                        {event.titolo}
                    </h3>
                    <p style={{ margin: '0 0 8px 0', color: 'var(--sys-on-surface-variant)', fontSize: '12px' }}>
                        {new Date(event.data).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long' })}
                        {event.oraInizio && ` • ${event.oraInizio}`}
                    </p>
                    {event.descrizione && (
                        <p style={{ margin: '0', color: 'var(--sys-on-surface)', fontSize: '13px', opacity: 0.8, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {event.descrizione}
                        </p>
                    )}
                </Box>

                {/* Action Buttons */}
                <Button
                    fullWidth
                    onClick={handleEdit}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        justifyContent: 'flex-start',
                        px: 2,
                        py: 1.5,
                        borderRadius: '20px',
                        cursor: 'pointer',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--sys-on-surface)',
                        fontSize: '13px',
                        textTransform: 'none',
                        fontFamily: 'var(--font-family)',
                        '&:hover': { backgroundColor: 'var(--sys-surface-container-highest)' },
                        mb: 1
                    }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                    <span>Modifica</span>
                </Button>

                <Button
                    fullWidth
                    onClick={handleDelete}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        justifyContent: 'flex-start',
                        px: 2,
                        py: 1.5,
                        borderRadius: '20px',
                        cursor: 'pointer',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--sys-error)',
                        fontSize: '13px',
                        textTransform: 'none',
                        fontFamily: 'var(--font-family)',
                        '&:hover': { backgroundColor: 'var(--sys-error-container)' },
                    }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                    <span>Elimina</span>
                </Button>
            </Box>
        </Popover>
    );
};

export default EventActionPopover;
