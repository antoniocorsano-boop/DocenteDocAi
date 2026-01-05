
import React, { useState, useEffect, useRef } from 'react';
import VoiceNoteRecorder from './VoiceNoteRecorder';

interface QuickNotePopoverProps {
    anchorEl: HTMLElement | null;
    initialValue: string;
    onSave: (note: string) => void;
    onClose: () => void;
}

const QuickNotePopover: React.FC<QuickNotePopoverProps> = ({ anchorEl, initialValue, onSave, onClose }) => {
    const [note, setNote] = useState(initialValue);
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
    
    const handleSave = () => {
        onSave(note);
    }

    const handleTranscription = (text: string) => {
        setNote(prev => prev ? `${prev} ${text}` : text);
    }

    const style: React.CSSProperties = {};
    if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        style.position = 'fixed';
        style.top = `${rect.bottom + 8}px`;
        const leftPos = Math.min(window.innerWidth - 320, Math.max(16, rect.left - 150));
        style.left = `${leftPos}px`;
    }

    return (
        <div ref={popoverRef} className="m3-popup-menu !p-0 w-[300px]" style={style}>
            <div className="popup-header-alt bg-surface-container-highest">
                <h3 className="m3-title-small text-on-surface">Nota Rapida</h3>
                <div className="flex items-center gap-8">
                    <VoiceNoteRecorder onTranscription={handleTranscription} compact={true} />
                    <button onClick={onClose} className="icon-button !w-8 !h-8">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            </div>
            <div className="p-6 pt-2">
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="form-textarea w-full mb-6 bg-surface-container-low border-none focus:ring-1 focus:ring-primary"
                    rows={4}
                    placeholder="Scrivi una nota..."
                    autoFocus
                />
                <div className="flex justify-end gap-8">
                    <button onClick={handleSave} className="m3-button-filled w-full justify-center">
                        Salva Nota
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickNotePopover;
