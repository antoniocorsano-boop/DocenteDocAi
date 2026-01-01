
import React, { useState, useCallback } from 'react';
import { useFileDrop } from '../hooks/useFileDrop';
import { analyzeImage } from '../services/aiService';
import { AiSettings } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions } from './M3Dialog';

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
    >
      <M3DialogContent className="dialog-content-grid-tall">
        {/* Left Panel: Upload and Prompt */}
        <div className="p-4 md:p-6 border-r border-outline-variant flex flex-col gap-4">
          <div>
            <h3 className="m3-title-medium mb-2">1. Carica un'immagine</h3>
            <div 
              {...getRootProps()}
              className={`dropzone-area ${isDragActive ? 'active' : ''}`}
              data-active={isDragActive}
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-[180px] max-w-full object-contain rounded shadow-sm" />
              ) : (
                <>
                  <div className="upload-icon-circle">
                      <span className="material-symbols-outlined text-3xl text-on-surface-variant">add_photo_alternate</span>
                  </div>
                  <div className="text-center text-on-surface-variant">
                      <p className="m3-title-medium">Trascina o clicca</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex-grow flex flex-col">
            <label htmlFor="prompt-textarea" className="form-label m3-title-medium">2. Chiedi qualcosa</label>
            <textarea
              id="prompt-textarea"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (error) setError('');
              }}
              placeholder="Es. 'Descrivi cosa vedi in questa immagine'..."
              className="form-textarea w-full flex-grow"
              rows={4}
              disabled={!imageFile}
            />
          </div>
          <button onClick={handleSubmit} disabled={isLoading || !imageFile || !prompt} className="button button-filled w-full mt-4">
            {isLoading ? <span className="button-spinner"></span> : 'Analizza Immagine'}
          </button>
          {error && <p className="text-error text-sm mt-2 text-center">{error}</p>}
        </div>

        {/* Right Panel: Analysis Result */}
        <div className="p-4 md:p-6 overflow-y-auto flex flex-col">
          <h3 className="m3-title-medium mb-2">Risultato Analisi</h3>
          <div className="flex-grow p-4 bg-surface-container-lowest rounded-lg border border-outline-variant">
            {isLoading && (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                </div>
            )}
            {analysisResult && (
                <div className="prose">
                    <p className="whitespace-pre-wrap m3-body-medium">{analysisResult}</p>
                </div>
            )}
            {!analysisResult && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-6xl">visibility</span>
                    <p>Il risultato dell'analisi apparirà qui.</p>
                </div>
            )}
          </div>
        </div>
      </M3DialogContent>
    </M3Dialog>
  );
};

export default ImageAnalysisModal;
