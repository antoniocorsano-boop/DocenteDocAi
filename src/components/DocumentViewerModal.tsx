import React, { useState } from 'react';
import { sanitizeHTML } from '../utils/securityUtils';
import { M3Dialog, M3DialogContent, M3DialogActions } from './M3Dialog';

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
        >
            <M3DialogContent>
                {!safeHtml ? (
                     <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div
                        className="document-viewer-content"
                        dangerouslySetInnerHTML={{ __html: safeHtml }}
                    />
                )}
            </M3DialogContent>
            <M3DialogActions>
                 {onSaveToKb && (
                    <button onClick={handleSave} className="button button-outlined mr-auto rounded-lg hover:shadow-md transition-all">
                        <span className="material-symbols-outlined mr-2">save</span>
                        Salva in KB
                    </button>
                )}
                <button onClick={onClose} className="button button-text rounded-lg hover:shadow-md transition-all">Chiudi</button>
                <button onClick={handleCopyToClipboard} className="button button-tonal rounded-lg hover:shadow-md transition-all">
                     <span className="material-symbols-outlined mr-2">{copyStatus === 'copied' ? 'check' : 'content_copy'}</span>
                    {copyStatus === 'copied' ? 'Copiato!' : 'Copia Testo'}
                </button>
                {onOpenCreateLesson && (
                    <button onClick={handleCreateLesson} className="button button-filled rounded-lg hover:shadow-md transition-all">
                         <span className="material-symbols-outlined mr-2">add_task</span>
                        Crea Lezione
                    </button>
                )}
            </M3DialogActions>
        </M3Dialog>
    );
};

export default DocumentViewerModal;
