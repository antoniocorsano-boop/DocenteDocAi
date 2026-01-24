// LEGACY - MD3 Non-compliant

// M3Expressive: QuickNotePopover - Quick note input popover with voice recording
import React, { useState } from 'react';
import { M3Popover, TextField, M3Button } from './ui';
import VoiceNoteRecorder from './VoiceNoteRecorder';
import { useTheme } from '../theme/theme';

interface QuickNotePopoverProps {
    anchorEl: HTMLElement | null;
    initialValue: string;
    onSave: (note: string) => void;
    onClose: () => void;
}

const QuickNotePopover: React.FC<QuickNotePopoverProps> = ({ anchorEl, initialValue, onSave, onClose }) => {
  const { layers } = useTheme();
  const { layers } = useTheme();
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
            <div >
                <h3 >
                    Nota Rapida
                </h3>
                <div >
                    <VoiceNoteRecorder onTranscription={handleTranscription} compact={true} />
                    <button
                        onClick={onClose}
                        
                        aria-label="Chiudi nota"
                    >
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}} style={{fontSize: 'var(--md-sys-typescale-body-medium-size)'}}>
                            close
                        </span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div >
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
                    
                >
                    Salva Nota
                </M3Button>
            </div>
        </M3Popover>
    );
};

export default QuickNotePopover;




