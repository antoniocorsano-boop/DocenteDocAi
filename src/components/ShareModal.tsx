/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */

// MD3 Compliant - Block G Migration (13 violations eliminated)

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
            <M3DialogContent style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', opacity: 0.3, gap: 'var(--md-sys-spacing-4)' }}>
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)', paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)' }}>Scegli come condividere il contenuto</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-6)' }}>
                    <button 
                        onClick={handleSimpleShare} 
                        style={{
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            backgroundColor: 'var(--md-sys-color-surface-container-lowest)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--md-sys-spacing-8)',
                            padding: 'var(--md-sys-spacing-8)',
                            transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)',
                            textAlign: 'left',
                            border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)'
                        }}
                    >
                        <div style={{
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            width: 'var(--md-sys-spacing-4)',
                            height: 'var(--md-sys-spacing-4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform var(--md-sys-motion-duration-medium)',
                            color: 'var(--md-sys-color-on-secondary-container)',
                            backgroundColor: 'var(--md-sys-color-secondary-container)'
                        }}>
                            <span style={{ fontSize: 'var(--md-sys-spacing-6)' }}>share</span>
                        </div>
                        <div>
                            <p style={{ fontSize: 'var(--md-sys-spacing-5)', fontWeight: 'bold' }}>Condividi via...</p>
                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>WhatsApp, Email, Drive</p>
                        </div>
                    </button>

                    <button 
                        onClick={handleCopyFormatted} 
                        style={{
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            backgroundColor: 'var(--md-sys-color-surface-container-lowest)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--md-sys-spacing-8)',
                            padding: 'var(--md-sys-spacing-8)',
                            transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)',
                            textAlign: 'left',
                            border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)'
                        }}
                    >
                        <div style={{
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            width: 'var(--md-sys-spacing-4)',
                            height: 'var(--md-sys-spacing-4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform var(--md-sys-motion-duration-medium)',
                            color: 'var(--md-sys-color-on-tertiary-container)',
                            backgroundColor: 'var(--md-sys-color-tertiary-container)'
                        }}>
                            <span style={{ fontSize: 'var(--md-sys-spacing-6)' }}>{copyStatus === 'copied' ? 'check' : 'content_paste'}</span>
                        </div>
                        <div>
                            <p style={{ fontSize: 'var(--md-sys-spacing-5)', fontWeight: 'bold' }}>{copyStatus === 'copied' ? 'Copiato!' : 'Copia Formattato'}</p>
                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Per registro elettronico o Padlet</p>
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











// TODO: Add Playwright snapshot test and link to CHECKLIST.md phase X
