import React from 'react';
import { saveAs } from '../utils/documentUtils';
import { M3Dialog, M3DialogContent, M3DialogActions } from './M3Dialog';

interface ImageViewerModalProps {
    prompt: string;
    imageData: string;
    mimeType: string;
    onClose: () => void;
    onSaveToKb: (prompt: string, imageData: { data: string, mimeType: string }) => void;
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ prompt, imageData, mimeType, onClose, onSaveToKb }) => {

    const dataUrl = `data:${mimeType};base64,${imageData}`;

    const handleDownload = () => {
        fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
                saveAs(blob, `AI_Image_${prompt.substring(0, 20).replace(/\s/g, '_')}.jpg`);
            });
    };
    
    const handleSave = () => {
        onSaveToKb(prompt, { data: imageData, mimeType });
    };

    return (
        <M3Dialog
            title="Immagine Generata"
            onClose={onClose}
            maxWidth="lg"
        >
            <M3DialogContent className="flex justify-center items-center bg-surface-container-lowest">
                <img src={dataUrl} alt={prompt} className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-md" />
            </M3DialogContent>

            <M3DialogActions className="gap-2">
                <button onClick={handleSave} className="button button-outlined mr-auto rounded-lg hover:shadow-md transition-all">
                    <span className="material-symbols-outlined mr-2">save</span>
                    Salva in Knowledge Base
                </button>
                <button onClick={onClose} className="button button-text rounded-lg hover:shadow-md transition-all">Chiudi</button>
                <button onClick={handleDownload} className="button button-filled rounded-lg hover:shadow-md transition-all">
                    <span className="material-symbols-outlined mr-2">download</span>
                    Scarica Immagine
                </button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default ImageViewerModal;
