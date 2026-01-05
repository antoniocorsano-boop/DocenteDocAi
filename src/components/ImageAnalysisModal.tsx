
import React, { useState, useCallback } from 'react';
import { useFileDrop } from '../hooks/useFileDrop';
import { analyzeImage } from '../services/aiService';
import { AiSettings } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard } from './ui';

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
      hideBackdrop={true}
    >
      <M3DialogContent className="bg-surface-container-high/30 backdrop-blur-sm grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden px-0">
        {/* Left Panel: Upload and Prompt */}
        <div className="p-12 border-r border-outline-variant flex flex-col gap-12">
          <div>
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-6">1. Carica un'immagine</h3>
            <div 
              {...getRootProps()}
              className={`flex flex-col items-center justify-center border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors h-48 rounded-2xl cursor-pointer overflow-hidden ${isDragActive ? 'border-primary bg-primary/20' : ''}`}
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-8">
                      <span className="material-symbols-outlined text-3xl text-primary">add_photo_alternate</span>
                  </div>
                  <div className="text-center text-on-surface-variant">
                      <p className="font-bold">Trascina o clicca</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex-grow flex flex-col">
            <label htmlFor="prompt-textarea" className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-8">2. Chiedi qualcosa</label>
            <textarea
              id="prompt-textarea"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (error) setError('');
              }}
              placeholder="Es. 'Descrivi cosa vedi in questa immagine'..."
              className="w-full flex-grow p-12 bg-surface border border-outline rounded-2xl focus:border-primary focus:outline-none resize-none"
              rows={4}
              disabled={!imageFile}
            />
          </div>
          <M3Button 
            onClick={handleSubmit} 
            disabled={isLoading || !imageFile || !prompt} 
            variant="filled"
            className="w-full mt-8"
          >
            {isLoading ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : 'Analizza Immagine'}
          </M3Button>
          {error && <p className="text-error text-xs mt-4 text-center font-bold">{error}</p>}
        </div>

        {/* Right Panel: Analysis Result */}
        <div className="p-12 overflow-y-auto flex flex-col bg-surface/50">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-8">Risultato Analisi</h3>
          <InfoCard variant="elevated" className="flex-grow p-12 overflow-y-auto">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full gap-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                <p className="text-sm font-bold text-primary animate-pulse">L'AI sta analizzando...</p>
              </div>
            )}
            {analysisResult && (
                <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-on-surface leading-relaxed">{analysisResult}</p>
                </div>
            )}
            {!analysisResult && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant opacity-50">
                    <span className="material-symbols-outlined text-6xl mb-8">visibility</span>
                    <p className="font-medium">Il risultato dell'analisi apparirà qui.</p>
                </div>
            )}
          </InfoCard>
        </div>
      </M3DialogContent>
      <M3DialogActions className="gap-12 px-12 pb-12 pt-0">
        <M3Button onClick={onClose} variant="text">Chiudi</M3Button>
      </M3DialogActions>
    </M3Dialog>
  );
};

export default ImageAnalysisModal;
