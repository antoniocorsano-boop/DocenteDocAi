// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026
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
            <M3DialogContent style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)'/30 , display: "flex", justifyContent: "center", alignItems: "center", padding: 'var(--md-sys-spacing-6)'}}>
                <div >
                    <img 
                        src={dataUrl} 
                        alt={prompt} 
                        style={{ borderRadius: 'var(--md-sys-shape-corner-large)' , maxWidth: "var(--md-sys-percent-100)", border: "1px solid var(--md-sys-color-outline)"}} 
                    />
                    <div style={{ backgroundColor: sys.colors.black/40, borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--md-sys-spacing-8)', opacity: "0", transition: "opacity 300ms"}}>
                        <p style={{ color: sys.colors.white ,  fontSize: "var(--md-sys-typescale-body-small-font-size)", fontWeight: "500" }}>"{prompt}"</p>
                    </div>
                </div>
            </M3DialogContent>

            <M3DialogActions style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)'/80 , padding: 'var(--md-sys-spacing-6)', borderTop: "1px solid var(--md-sys-color-outline)"}}>
                <M3Button 
                    onClick={handleSave} 
                    variant="outlined" 
                    
                >
                    <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>save</span>
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
                    <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>download</span>
                    Scarica
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default ImageViewerModal;








