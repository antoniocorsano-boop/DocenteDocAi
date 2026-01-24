// LEGACY - MD3 Non-compliant

import React, { useState, useCallback } from 'react';
import { useFileDrop } from '../hooks/useFileDrop';
import { analyzeImage } from '../services/aiService';
import { AiSettings } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard } from './ui';
import { useTheme } from '../theme/theme';

interface ImageAnalysisModalProps {
  onClose: () => void;
  aiSettings: AiSettings;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      if (!result) {
          reject(new Error("File could not be read as a data URL."));
          return;
      }
      resolve(result);
    };
    reader.onerror = error => reject(error);
  });
};

const ImageAnalysisModal: React.FC<ImageAnalysisModalProps> = ({ onClose, aiSettings }) => {
  const { layers } = useTheme();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useFileDrop({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });
  
  const handleSubmit = async () => {
    if (!imageFile || !prompt) {
        setError("Per favore, carica un'immagine e inserisci una domanda.");
        return;
    }
    setError('');
    setIsLoading(true);
    setAnalysisResult('');
    try {
        const imageDataUrl = await fileToBase64(imageFile);
        const result = await analyzeImage(aiSettings, imageDataUrl, prompt);
        setAnalysisResult(result);
    } catch (error) {
        console.error("Error during image analysis:", error);
        setAnalysisResult("Si è verificato un errore durante l'analisi. Riprova.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <M3Dialog
      title="Analisi Immagine con AI"
      onClose={onClose}
      maxWidth="4xl"
      hideBackdrop={true}
    >
      <M3DialogContent style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)]/30 }} style={{ display: "grid", gridTemplateColumns: "1fr" }}>
        {/* Left Panel: Upload and Prompt */}
        <div style={{ padding: ref.spacing[12] }} style={{borderRight: "1px solid layers.sys.colors.outline", display: "flex", flexDirection: "column"}}>
          <div>
            <h3 style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{fontSize: "0.875rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: layers.ref.spacing['6']}}>1. Carica un'immagine</h3>
            <div 
              {...getRootProps()}
              className={`flex flex-col items-center justify-center border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors h-48 rounded-[var(--md-sys-shape-corner-large)] cursor-pointer overflow-hidden ${isDragActive ? 'border-primary bg-primary/20' : ''}`}
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview"  style={{ height: "100%", width: "100%" }} />
              ) : (
                <>
                  <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)] }} style={{width: ref.spacing[48], height: ref.spacing[48], borderRadius: ref.spacing[9999], display: "flex", alignItems: "center", justifyContent: "center", marginBottom: layers.ref.spacing['8']}}>
                      <span style={{ color: sys.colors.3xl }} style={{color: "layers.sys.colors.primary"}}>add_photo_alternate</span>
                  </div>
                  <div style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{ textAlign: "center" }}>
                      <p style={{ fontWeight: "bold" }}>Trascina o clicca</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div style={{ flexGrow: "1", display: "flex", flexDirection: "column" }}>
            <label htmlFor="prompt-textarea" style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{fontSize: "0.875rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: layers.ref.spacing['8']}}>2. Chiedi qualcosa</label>
            <textarea
              id="prompt-textarea"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (error) setError('');
              }}
              placeholder="Es. 'Descrivi cosa vedi in questa immagine'..."
              style={{ padding: ref.spacing[12], borderRadius: ref.shape[] }} style={{width: "100%", flexGrow: "1", backgroundColor: "layers.sys.colors.surface", border: "1px solid layers.sys.colors.outline"}}
              rows={4}
              disabled={!imageFile}
            />
          </div>
          <M3Button 
            onClick={handleSubmit} 
            disabled={isLoading || !imageFile || !prompt} 
            variant="filled"
             style={{ width: "100%" }}
          >
            {isLoading ? <span >progress_activity</span> : 'Analizza Immagine'}
          </M3Button>
          {error && <p style={{color: "layers.sys.colors.error", fontSize: "0.75rem", marginTop: layers.ref.spacing['4'], textAlign: "center", fontWeight: "bold"}}>{error}</p>}
        </div>

        {/* Right Panel: Analysis Result */}
        <div style={{ padding: ref.spacing[12], backgroundColor: sys.colors.surface/50 }} style={{ overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <h3 style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{fontSize: "0.875rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: layers.ref.spacing['8']}}>Risultato Analisi</h3>
          <InfoCard variant="elevated" style={{ padding: ref.spacing[12] }} style={{ flexGrow: "1", overflowY: "auto" }}>
            {isLoading && (
              <div  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <div  style={{borderRadius: ref.spacing[9999], height: ref.spacing[48], width: ref.spacing[48], borderColor: "layers.sys.colors.primary"}}></div>
                <p  style={{fontSize: "0.875rem", fontWeight: "bold", color: "layers.sys.colors.primary"}}>L'AI sta analizzando...</p>
              </div>
            )}
            {analysisResult && (
                <div >
                    <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{ whiteSpace: "pre-wrap", lineHeight: "1.625" }}>{analysisResult}</p>
                </div>
            )}
            {!analysisResult && !isLoading && (
                <div style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", opacity: "0.5" }}>
                    <span style={{ color: sys.colors.6xl }} style={{marginBottom: layers.ref.spacing['8']}}>visibility</span>
                    <p style={{ fontWeight: "500" }}>Il risultato dell'analisi apparirà qui.</p>
                </div>
            )}
          </InfoCard>
        </div>
      </M3DialogContent>
      <M3DialogActions  style={{ paddingTop: "0" }}>
        <M3Button onClick={onClose} variant="text">Chiudi</M3Button>
      </M3DialogActions>
    </M3Dialog>
  );
};

export default ImageAnalysisModal;



