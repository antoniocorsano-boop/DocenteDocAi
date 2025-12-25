import React, { useState, useEffect } from 'react';
import { AiSettings, KnowledgeBaseEntry } from '../types';
import VoiceNoteRecorder from './VoiceNoteRecorder';
import { generateLessonFromIdea } from '../services/aiService';
import { SelectField, TextArea } from './M3Components';
import AiThinkingGem from './AiThinkingGem';

interface IdeaGeneratorModalProps {
    onClose: () => void;
    onGenerate: (content: { title: string; htmlContent: string }) => void;
    aiSettings: AiSettings;
    userClasses: string[];
    knowledgeBase: KnowledgeBaseEntry[];
}

const IdeaGeneratorModal: React.FC<IdeaGeneratorModalProps> = ({ onClose, onGenerate, aiSettings, userClasses, knowledgeBase }) => {
    const [ideaText, setIdeaText] = useState('');
    const [targetClass, setTargetClass] = useState<string>(userClasses[0] || '');
    const [useKb, setUseKb] = useState(true);
    const [selectedKbIds, setSelectedKbIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (knowledgeBase.length > 0) {
            const defaults = knowledgeBase
                .filter(k => k.category === 'programmazione' || k.fileName.toLowerCase().includes('programmazione'))
                .map(k => k.id);
            setSelectedKbIds(defaults);
        }
    }, [knowledgeBase]);

    const handleTranscription = (text: string) => {
        setIdeaText(prev => prev ? `${prev} ${text}` : text);
    };

    const handleKbToggle = (id: string) => {
        setSelectedKbIds(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]);
    };

    const handleGenerate = async () => {
        if (!ideaText.trim()) { setError("Descrivi la tua idea."); return; }
        if (!targetClass) { setError("Seleziona una classe."); return; }

        setIsLoading(true);
        setError('');
        try {
            const kbContent = useKb 
                ? knowledgeBase.filter(k => selectedKbIds.includes(k.id)).map(k => `--- ${k.fileName} ---\n${k.content}`).join('\n\n') 
                : undefined;
                
            const result = await generateLessonFromIdea(aiSettings, ideaText, targetClass, kbContent);
            onGenerate(result);
            onClose();
        } catch (err: any) {
            setError(err.message || "Errore generazione lezione.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dialog-backdrop">
            <div className="dialog-container w-full max-w-xl shadow-xl animate-in zoom-in-95">
                <div className="dialog-header border-b border-outline-variant p-6 bg-surface-container-high">
                    <h2 className="m3-headline-small font-black flex items-center gap-3">
                        <span className="material-symbols-outlined text-tertiary filled-icon">lightbulb</span>
                        AI Lesson Lab
                    </h2>
                    <button onClick={onClose} className="icon-button"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="dialog-content p-8 space-y-8 bg-surface">
                    <SelectField label="Classe Destinazione" value={targetClass} onChange={e => setTargetClass(e.target.value)}>
                        <option value="" disabled>Seleziona...</option>
                        {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                    </SelectField>

                    <div className="relative">
                         <div className="absolute right-4 top-10 z-10">
                            <VoiceNoteRecorder onTranscription={handleTranscription} compact />
                        </div>
                        <TextArea 
                            label="Descrizione Idea" 
                            value={ideaText} 
                            onChange={e => setIdeaText(e.target.value)} 
                            rows={6} 
                            placeholder="Es. 'Lezione attiva su Dante usando i social media'..." 
                            autoFocus
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <label className="flex items-center gap-4 cursor-pointer select-none">
                                <div className="switch"><input type="checkbox" checked={useKb} onChange={e => setUseKb(e.target.checked)} /><span className="slider"></span></div>
                                <span className="m3-label-large font-black uppercase tracking-widest text-[11px] text-on-surface-variant">Usa Context Knowledge Base</span>
                            </label>
                             <span className="text-[10px] font-black uppercase text-primary tracking-widest">{selectedKbIds.length} file</span>
                        </div>
                        
                        {useKb && (
                            <div className="selection-container row-layout !bg-surface-container-low !rounded-[24px] max-h-[140px] p-2 border border-outline-variant/30">
                                {knowledgeBase.map(kb => (
                                    <div key={kb.id} className="chip-checkbox">
                                        <input type="checkbox" id={`kb-idea-${kb.id}`} checked={selectedKbIds.includes(kb.id)} onChange={() => handleKbToggle(kb.id)} />
                                        <label htmlFor={`kb-idea-${kb.id}`} className={`chip !justify-start !h-10 ${selectedKbIds.includes(kb.id) ? 'chip-selected' : ''}`}>
                                            {selectedKbIds.includes(kb.id) && <span className="material-symbols-outlined text-lg">check</span>}
                                            <span className="truncate text-[10px] font-black uppercase tracking-tighter">{kb.fileName}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && <div className="p-4 bg-error-container text-on-error-container rounded-2xl text-center text-xs font-black uppercase tracking-widest">{error}</div>}
                </div>
                
                <div className="dialog-footer border-t border-outline-variant p-6 bg-surface-container-high">
                    <button onClick={onClose} className="button button-text font-bold" disabled={isLoading}>Annulla</button>
                    <button onClick={handleGenerate} className="button button-filled shadow-xl !px-10 font-black" disabled={isLoading || !ideaText.trim()}>
                        {isLoading ? <AiThinkingGem size="small" inline /> : <><span className="material-symbols-outlined mr-2 font-black">auto_awesome</span> Genera Piano</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IdeaGeneratorModal;
