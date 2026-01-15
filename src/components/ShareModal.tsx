// LEGACY - MD3 Non-compliant

import React, { useState } from 'react';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';
import { useTheme } from '../theme/theme';

interface ShareModalProps {
    title: string;
    text: string;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ title, text, onClose }) => {
  const { layers } = useTheme();
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
            <M3DialogContent style={{ backgroundColor:  layers.sys.color.surfaceContainerHigh/30 }} style={{gap: layers.ref.spacing['4']}}>
                <p style={{ color: layers.sys.color.onSurfaceVariant, paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'] }}>Scegli come condividere il contenuto</p>
                
                <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['6']}}>
                    <button onClick={handleSimpleShare} style={{ borderRadius: layers.ref.shape.corner.large, backgroundColor:  layers.sys.color.surfaceContainerLowest }} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], padding: layers.ref.spacing['8'], transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", textAlign: "left", border: "1px solid layers.sys.color.outline"}}>
                        <div style={{ borderRadius: layers.ref.shape.corner.large, color: sys.colors.on-secondary-container }} style={{width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], backgroundColor: "layers.sys.color.secondary-container", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 300ms"}}>
                            <span  style={{ fontSize: "1.5rem" }}>share</span>
                        </div>
                        <div>
                            <p  style={{ fontSize: "1.125rem", fontWeight: "bold" }}>Condividi via...</p>
                            <p style={{ color:  layers.sys.color.onSurfaceVariant }}>WhatsApp, Email, Drive</p>
                        </div>
                    </button>

                    <button onClick={handleCopyFormatted} style={{ borderRadius: layers.ref.shape.corner.large, backgroundColor:  layers.sys.color.surfaceContainerLowest }} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], padding: layers.ref.spacing['8'], transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", textAlign: "left", border: "1px solid layers.sys.color.outline"}}>
                        <div style={{ borderRadius: layers.ref.shape.corner.large, color: sys.colors.on-tertiary-container }} style={{width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], backgroundColor: "layers.sys.color.tertiary-container", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 300ms"}}>
                            <span  style={{ fontSize: "1.5rem" }}>{copyStatus === 'copied' ? 'check' : 'content_paste'}</span>
                        </div>
                        <div>
                            <p  style={{ fontSize: "1.125rem", fontWeight: "bold" }}>{copyStatus === 'copied' ? 'Copiato!' : 'Copia Formattato'}</p>
                            <p style={{ color:  layers.sys.color.onSurfaceVariant }}>Per registro elettronico o Padlet</p>
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







