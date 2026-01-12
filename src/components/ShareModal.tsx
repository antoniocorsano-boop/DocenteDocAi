
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
            <M3DialogContent className="bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm" style={{ gap: "var(--md-sys-spacing-4)" }}>
                <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant" style={{ paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)" }}>Scegli come condividere il contenuto</p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-6)" }}>
                    <button onClick={handleSimpleShare} className="rounded-[var(--md-sys-shape-corner-extra-large)] bg-[var(--md-sys-color-surface-container-low)]est hover:bg-secondary-container/30 group border-[var(--md-sys-color-outline-variant)]/30" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", padding: "var(--md-sys-spacing-8)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", textAlign: "left", border: "1px solid var(--md-sys-color-outline)" }}>
                        <div className="rounded-[var(--md-sys-shape-corner-large)] text-on-secondary-container group-hover:scale-110 shadow-sm" style={{ width: "3rem", height: "3rem", backgroundColor: "var(--md-sys-color-secondary-container)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 300ms" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>share</span>
                        </div>
                        <div>
                            <p className="m3-label-large" style={{ fontSize: "1.125rem", fontWeight: "bold" }}>Condividi via...</p>
                            <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">WhatsApp, Email, Drive</p>
                        </div>
                    </button>

                    <button onClick={handleCopyFormatted} className="rounded-[var(--md-sys-shape-corner-extra-large)] bg-[var(--md-sys-color-surface-container-low)]est hover:bg-tertiary-container/30 group border-[var(--md-sys-color-outline-variant)]/30" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", padding: "var(--md-sys-spacing-8)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", textAlign: "left", border: "1px solid var(--md-sys-color-outline)" }}>
                        <div className="rounded-[var(--md-sys-shape-corner-large)] text-on-tertiary-container group-hover:scale-110 shadow-sm" style={{ width: "3rem", height: "3rem", backgroundColor: "var(--md-sys-color-tertiary-container)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 300ms" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>{copyStatus === 'copied' ? 'check' : 'content_paste'}</span>
                        </div>
                        <div>
                            <p className="m3-label-large" style={{ fontSize: "1.125rem", fontWeight: "bold" }}>{copyStatus === 'copied' ? 'Copiato!' : 'Copia Formattato'}</p>
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


