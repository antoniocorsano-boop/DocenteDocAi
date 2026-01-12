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
            <M3DialogContent className="bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "var(--md-sys-spacing-6)" }}>
                <div className="relative group">
                    <img 
                        src={dataUrl} 
                        alt={prompt} 
                        className="max-h-[70vh] object-contain rounded-[var(--md-sys-shape-corner-large)] shadow-[var(--md-sys-elevation-level4)] border-white/10" style={{ maxWidth: "100%", border: "1px solid var(--md-sys-color-outline)" }} 
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md rounded-[var(--md-sys-shape-corner-medium)] group-hover:opacity-100" style={{ padding: "var(--md-sys-spacing-8)", opacity: "0", transition: "opacity 300ms" }}>
                        <p className="text-white line-clamp-2 italic" style={{ fontSize: "0.75rem", fontWeight: "500" }}>"{prompt}"</p>
                    </div>
                </div>
            </M3DialogContent>

            <M3DialogActions className="bg-[var(--md-sys-color-surface-container-high)]/80 backdrop-blur-md border-[var(--md-sys-color-outline-variant)]/30" style={{ padding: "var(--md-sys-spacing-6)", borderTop: "1px solid var(--md-sys-color-outline)" }}>
                <M3Button 
                    onClick={handleSave} 
                    variant="outlined" 
                    className="mr-auto"
                >
                    <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>save</span>
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
                    <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>download</span>
                    Scarica
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default ImageViewerModal;


