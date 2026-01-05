
import React, { useState } from 'react';
import { Popover, Box, Button, TextField } from '@mui/material';
import VoiceNoteRecorder from './VoiceNoteRecorder';

interface QuickNotePopoverProps {
    anchorEl: HTMLElement | null;
    initialValue: string;
    onSave: (note: string) => void;
    onClose: () => void;
}

const QuickNotePopover: React.FC<QuickNotePopoverProps> = ({ anchorEl, initialValue, onSave, onClose }) => {
    const [note, setNote] = useState(initialValue);

    const handleSave = () => {
        onSave(note);
        onClose();
    };

    const handleTranscription = (text: string) => {
        setNote(prev => prev ? `${prev} ${text}` : text);
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
                    width: '300px',
                }
            }}
        >
            <Box>
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        backgroundColor: 'var(--sys-surface-container-highest)',
                        borderBottom: '1px solid var(--sys-outline-variant)',
                        gap: 1
                    }}
                >
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--sys-on-surface)' }}>
                        Nota Rapida
                    </h3>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VoiceNoteRecorder onTranscription={handleTranscription} compact={true} />
                        <button
                            onClick={onClose}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                border: 'none',
                                backgroundColor: 'var(--sys-surface-container)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            aria-label="Chiudi nota"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--sys-on-surface)' }}>
                                close
                            </span>
                        </button>
                    </Box>
                </Box>

                {/* Content */}
                <Box sx={{ padding: '16px' }}>
                    <TextField
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Scrivi una nota..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        autoFocus
                        slotProps={{
                            input: {
                                sx: {
                                    backgroundColor: 'var(--sys-surface-container-low)',
                                    border: 'none',
                                    color: 'var(--sys-on-surface)',
                                    fontFamily: 'var(--font-family)',
                                    fontSize: '13px',
                                    '&:focus-within': {
                                        boxShadow: `0 0 0 1px var(--sys-primary)`,
                                    }
                                }
                            }
                        }}
                        sx={{
                            '& .MuiInputBase-root': {
                                backgroundColor: 'var(--sys-surface-container-low)',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'transparent',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'transparent',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'var(--sys-primary)',
                                    borderWidth: '1px',
                                },
                            },
                        }}
                    />

                    {/* Save Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                            mt: 2,
                            backgroundColor: 'var(--sys-primary)',
                            color: 'var(--sys-on-primary)',
                            textTransform: 'none',
                            fontWeight: 500,
                            borderRadius: '8px',
                            fontFamily: 'var(--font-family)',
                            fontSize: '13px',
                            '&:hover': {
                                backgroundColor: 'var(--sys-primary-dark)',
                            }
                        }}
                    >
                        Salva Nota
                    </Button>
                </Box>
            </Box>
        </Popover>
    );
};

export default QuickNotePopover;
