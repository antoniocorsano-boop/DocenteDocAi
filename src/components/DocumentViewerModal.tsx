import React, { useState } from 'react';
import { sanitizeHTML } from '../utils/securityUtils';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';

interface DocumentViewerModalProps {
    title: string;
    htmlContent: string;
    onClose: () => void;
    onSaveToKb?: (isFormattedDoc: boolean, data: { title: string, content: string, htmlContent: string }) => void;
    onOpenCreateLesson?: (content: { title: string; htmlContent: string }) => void;
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ title, htmlContent, onClose, onSaveToKb, onOpenCreateLesson }) => {
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
            <M3DialogContent className="px-12 pt-12 pb-0">
                {!safeHtml ? (
                     <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div
                        className="document-viewer-content prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: safeHtml }}
                    />
                )}
            </M3DialogContent>
            <M3DialogActions className="gap-12 px-12 pb-12 pt-0">
                 {onSaveToKb && (
                    <M3Button onClick={handleSave} variant="outlined" className="mr-auto">
                        <span className="material-symbols-outlined mr-2">save</span>
                        Salva in KB
                    </M3Button>
                )}
                <M3Button onClick={onClose} variant="text">Chiudi</M3Button>
                <M3Button onClick={handleCopyToClipboard} variant="tonal">
                     <span className="material-symbols-outlined mr-2">{copyStatus === 'copied' ? 'check' : 'content_copy'}</span>
                    {copyStatus === 'copied' ? 'Copiato!' : 'Copia Testo'}
                </M3Button>
                {onOpenCreateLesson && (
                    <M3Button onClick={handleCreateLesson} variant="filled">
                         <span className="material-symbols-outlined mr-2">add_task</span>
                        Crea Lezione
                    </M3Button>
                )}
            </M3DialogActions>
        </M3Dialog>
    );
};

export default DocumentViewerModal;
