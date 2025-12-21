import React from 'react';
import { saveAs } from '../utils/documentUtils';

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
        <div className="dialog-backdrop">
            <div className="dialog-container w-full max-w-2xl">
                <div className="dialog-header">
                    <h2 className="m3-headline-medium truncate" title={prompt}>Immagine Generata</h2>
                    <button onClick={onClose} className="icon-button rounded-lg hover:shadow-md transition-all">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="dialog-content flex justify-center items-center bg-surface-container-lowest">
                    <img src={dataUrl} alt={prompt} className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-md" />
                </div>
                <div className="dialog-footer">
                    <button onClick={handleSave} className="button button-outlined mr-auto rounded-lg hover:shadow-md transition-all">
                        <span className="material-symbols-outlined mr-2">save</span>
                        Salva in Knowledge Base
                    </button>
                    <button onClick={onClose} className="button button-text rounded-lg hover:shadow-md transition-all">Chiudi</button>
                    <button onClick={handleDownload} className="button button-filled rounded-lg hover:shadow-md transition-all">
                         <span className="material-symbols-outlined mr-2">download</span>
                        Scarica Immagine
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageViewerModal;
