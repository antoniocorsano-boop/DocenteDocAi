import React, { useState } from 'react';
import { saveAs } from '../utils/documentUtils';
import { sanitizeHTML } from '../utils/securityUtils';

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
        <div className="dialog-backdrop">
            <div className="dialog-container w-full max-w-4xl h-[90vh]">
                <div className="dialog-header">
                    <h2 className="m3-headline-medium truncate" title={title}>Anteprima: {title}</h2>
                    <button onClick={onClose} className="icon-button rounded-lg hover:shadow-md transition-all">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="dialog-content">
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
                </div>
                <div className="dialog-footer">
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
                </div>
            </div>
        </div>
    );
};

export default DocumentViewerModal;
