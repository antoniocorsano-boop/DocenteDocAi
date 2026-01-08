
import React, { useState } from 'react';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';

interface ShareModalProps {
    title: string;
    text: string;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ title, text, onClose }) => {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

    const handleSimpleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: text,
                });
                onClose();
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            alert('La condivisione nativa non è supportata su questo browser.');
        }
    };

    const handleCopyFormatted = () => {
        const markdownText = text.split('\n').map(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return trimmed;
            }
            return `- ${trimmed}`;
        }).join('\n');

        navigator.clipboard.writeText(markdownText).then(() => {
            setCopyStatus('copied');
            setTimeout(() => {
                setCopyStatus('idle');
                onClose();
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy markdown text: ', err);
            alert('Impossibile copiare il testo formattato.');
        });
    };

    return (
        <M3Dialog
            onClose={onClose}
            title="Condividi"
            maxWidth="sm"
            level={1}
        >
            <M3DialogContent className="space-y-4 bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm">
                <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant px-4">Scegli come condividere il contenuto</p>
                
                <div className="flex flex-col gap-6">
                    <button onClick={handleSimpleShare} className="flex items-center gap-8 p-8 rounded-[var(--md-sys-shape-corner-extra-large)] bg-[var(--md-sys-color-surface-container-low)]est hover:bg-secondary-container/30 transition-all text-left group border border-[var(--md-sys-color-outline-variant)]/30">
                        <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-large)] bg-secondary-container text-on-secondary-container flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                            <span className="material-symbols-outlined text-2xl">share</span>
                        </div>
                        <div>
                            <p className="m3-label-large text-lg font-bold">Condividi via...</p>
                            <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">WhatsApp, Email, Drive</p>
                        </div>
                    </button>

                    <button onClick={handleCopyFormatted} className="flex items-center gap-8 p-8 rounded-[var(--md-sys-shape-corner-extra-large)] bg-[var(--md-sys-color-surface-container-low)]est hover:bg-tertiary-container/30 transition-all text-left group border border-[var(--md-sys-color-outline-variant)]/30">
                        <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-large)] bg-tertiary-container text-on-tertiary-container flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                            <span className="material-symbols-outlined text-2xl">{copyStatus === 'copied' ? 'check' : 'content_paste'}</span>
                        </div>
                        <div>
                            <p className="m3-label-large text-lg font-bold">{copyStatus === 'copied' ? 'Copiato!' : 'Copia Formattato'}</p>
                            <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Per registro elettronico o Padlet</p>
                        </div>
                    </button>
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="text">Chiudi</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default ShareModal;


