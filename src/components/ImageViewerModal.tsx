// LEGACY - MD3 Non-compliant
import React from 'react';
import { saveAs } from '../utils/documentUtils';
import { useTheme } from '../theme/theme';
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
  const { layers } = useTheme();

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
            <M3DialogContent style={{ backgroundColor:  layers.sys.color.surfaceContainerHigh/30 }} style={{display: "flex", justifyContent: "center", alignItems: "center", padding: layers.ref.spacing['6']}}>
                <div >
                    <img 
                        src={dataUrl} 
                        alt={prompt} 
                        style={{ borderRadius: layers.ref.shape.corner.large }} style={{maxWidth: "100%", border: "1px solid layers.sys.color.outline"}} 
                    />
                    <div style={{ backgroundColor: sys.colors.black/40, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['8'], opacity: "0", transition: "opacity 300ms"}}>
                        <p style={{ color: sys.colors.white }} style={{ fontSize: "0.75rem", fontWeight: "500" }}>"{prompt}"</p>
                    </div>
                </div>
            </M3DialogContent>

            <M3DialogActions style={{ backgroundColor:  layers.sys.color.surfaceContainerHigh/80 }} style={{padding: layers.ref.spacing['6'], borderTop: "1px solid layers.sys.color.outline"}}>
                <M3Button 
                    onClick={handleSave} 
                    variant="outlined" 
                    
                >
                    <span  style={{ marginRight: "0.5rem" }}>save</span>
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
                    <span  style={{ marginRight: "0.5rem" }}>download</span>
                    Scarica
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default ImageViewerModal;







