import React from 'react';
import { saveAs } from '../utils/documentUtils';
import { 
    M3Dialog, 
    M3DialogContent, 
    M3DialogActions, 
    M3Button 
} from './ui';

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
            <M3DialogContent className="flex justify-center items-center bg-surface-container-high/30 backdrop-blur-sm p-6">
                <div className="relative group">
                    <img 
                        src={dataUrl} 
                        alt={prompt} 
                        className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10" 
                    />
                    <div className="absolute bottom-4 left-4 right-4 p-8 bg-black/40 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-medium line-clamp-2 italic">"{prompt}"</p>
                    </div>
                </div>
            </M3DialogContent>

            <M3DialogActions className="bg-surface-container-high/80 backdrop-blur-md p-6 border-t border-outline-variant/30">
                <M3Button 
                    onClick={handleSave} 
                    variant="outlined" 
                    className="mr-auto"
                >
                    <span className="material-symbols-outlined mr-2">save</span>
                    Salva in Knowledge Base
                </M3Button>
                <M3Button 
                    onClick={onClose} 
                    variant="text"
                >
                    Chiudi
                </M3Button>
                <M3Button 
                    onClick={handleDownload} 
                    variant="filled"
                >
                    <span className="material-symbols-outlined mr-2">download</span>
                    Scarica
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default ImageViewerModal;
