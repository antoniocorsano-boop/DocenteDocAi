
import React, { useState } from 'react';
import { M3Dialog } from './M3Components';

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
            isOpen={true}
            onClose={onClose}
            title="Condividi"
            headline="Scegli come condividere il contenuto"
            buttons={
                <button onClick={onClose} className="button button-text">Chiudi</button>
            }
            fullscreen={false}
        >
            <div className="flex flex-col gap-3 pt-2">
                <button onClick={handleSimpleShare} className="flex items-center gap-4 p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all text-left group">
                    <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">share</span>
                    </div>
                    <div>
                        <p className="m3-label-large text-lg">Condividi via...</p>
                        <p className="m3-body-medium text-on-surface-variant">WhatsApp, Email, Drive</p>
                    </div>
                </button>

                <button onClick={handleCopyFormatted} className="flex items-center gap-4 p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all text-left group">
                    <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">{copyStatus === 'copied' ? 'check' : 'content_paste'}</span>
                    </div>
                    <div>
                        <p className="m3-label-large text-lg">{copyStatus === 'copied' ? 'Copiato!' : 'Copia Formattato'}</p>
                        <p className="m3-body-medium text-on-surface-variant">Per registro elettronico o Padlet</p>
                    </div>
                </button>
            </div>
        </M3Dialog>
    );
};

export default ShareModal;
