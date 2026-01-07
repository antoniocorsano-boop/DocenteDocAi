
import React, { useState } from 'react';
import { M3Popover, TextField, M3Button } from './ui';
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
        <M3Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            minWidth={300}
            maxWidth={300}
        >
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                    borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                    gap: 'var(--md-sys-spacing-2)',
                }}
            >
                <h3 style={{ 
                    margin: 0, 
                    fontSize: 'var(--md-sys-typescale-body-medium-size)', 
                    fontWeight: 'var(--md-sys-typescale-body-medium-weight)', 
                    color: 'var(--md-sys-color-on-surface)' 
                }}>
                    Nota Rapida
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
                    <VoiceNoteRecorder onTranscription={handleTranscription} compact={true} />
                    <button
                        onClick={onClose}
                        className="m3-interactive-close"
                        aria-label="Chiudi nota"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)' }}>
                            close
                        </span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: 'var(--md-sys-spacing-4)' }}>
                <TextField
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Scrivi una nota..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    autoFocus
                />

                {/* Save Button */}
                <M3Button
                    variant="filled"
                    fullWidth
                    onClick={handleSave}
                    className="mt-4"
                    style={{ marginTop: 'var(--md-sys-spacing-4)' }}
                >
                    Salva Nota
                </M3Button>
            </div>
        </M3Popover>
    );
};

export default QuickNotePopover;

