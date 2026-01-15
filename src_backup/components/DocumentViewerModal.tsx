// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { sanitizeHTML } from '../utils/securityUtils';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';
import { useTheme } from '../theme/theme';

interface DocumentViewerModalProps {
    title: string;
    htmlContent: string;
    onClose: () => void;
    onSaveToKb?: (isFormattedDoc: boolean, data: { title: string, content: string, htmlContent: string }) => void;
    onOpenCreateLesson?: (content: { title: string; htmlContent: string }) => void;
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ title, htmlContent, onClose, onSaveToKb, onOpenCreateLesson }) => {
  const { layers } = useTheme();
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

    // Sanitize content before rendering to prevent XSS
    const safeHtml = sanitizeHTML(htmlContent);

    const handleCopyToClipboard = () => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = safeHtml;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        navigator.clipboard.writeText(textContent).then(() => {
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Impossibile copiare il testo.');
        });
    };

    const handleSave = () => {
        if (!onSaveToKb) return;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = safeHtml;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';

        onSaveToKb(true, {
            title: title,
            content: textContent,
            htmlContent: safeHtml
        });
    };

    const handleCreateLesson = () => {
        if (onOpenCreateLesson) {
            onOpenCreateLesson({ title, htmlContent: safeHtml });
            onClose();
        }
    };

    return (
        <M3Dialog
            title={`Anteprima: ${title}`}
            onClose={onClose}
            maxWidth="xl"
            level={2}
        >
            <M3DialogContent >
                {!safeHtml ? (
                     <div  style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div  style={{borderRadius: ref.spacing[9999], height: ref.spacing[48], width: ref.spacing[48], borderColor: "layers.sys.colors.primary"}}></div>
                    </div>
                ) : (
                    <div
                        
                        dangerouslySetInnerHTML={{ __html: safeHtml }}
                    />
                )}
            </M3DialogContent>
            <M3DialogActions  style={{ paddingTop: "0" }}>
                 {onSaveToKb && (
                    <M3Button onClick={handleSave} variant="outlined" >
                        <span  style={{ marginRight: "0.5rem" }}>save</span>
                        Salva in KB
                    </M3Button>
                )}
                <M3Button onClick={onClose} variant="text">Chiudi</M3Button>
                <M3Button onClick={handleCopyToClipboard} variant="tonal">
                     <span  style={{ marginRight: "0.5rem" }}>{copyStatus === 'copied' ? 'check' : 'content_copy'}</span>
                    {copyStatus === 'copied' ? 'Copiato!' : 'Copia Testo'}
                </M3Button>
                {onOpenCreateLesson && (
                    <M3Button onClick={handleCreateLesson} variant="filled">
                         <span  style={{ marginRight: "0.5rem" }}>add_task</span>
                        Crea Lezione
                    </M3Button>
                )}
            </M3DialogActions>
        </M3Dialog>
    );
};

export default DocumentViewerModal;



