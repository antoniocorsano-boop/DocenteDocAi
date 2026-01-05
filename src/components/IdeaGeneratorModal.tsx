import React, { useState, useEffect } from 'react';
import { AiSettings, KnowledgeBaseEntry } from '../types';
import VoiceNoteRecorder from './VoiceNoteRecorder';
import { generateLessonFromIdea } from '../services/aiService';
import { SelectField, TextArea, M3Dialog, M3DialogContent, M3DialogActions, M3Button, AiThinkingGem } from './ui';

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
        } catch (err: unknown) {
                let message = 'Errore durante la generazione delle idee.';
                if (err instanceof Error) message = err.message;
                setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <M3Dialog
            title={
                <div className="flex items-center gap-6">
                    <span className="material-symbols-outlined text-tertiary">lightbulb</span>
                    <span>AI Lesson Lab</span>
                </div>
            }
            onClose={onClose}
            maxWidth="xl"
            level={1}
        >
            <M3DialogContent className="bg-surface-container-low/30 backdrop-blur-xl p-12 space-y-12">
                <SelectField 
                    label="Classe Destinazione" 
                    value={targetClass} 
                    onChange={e => setTargetClass(e.target.value)}
                    className="bg-surface-container-high/50"
                >
                    <option value="" disabled>Seleziona...</option>
                    {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                </SelectField>

                <div className="relative">
                    <VoiceNoteRecorder onTranscription={handleTranscription} compact />
                </div>
                <TextArea 
                    label="Descrizione Idea" 
                    value={ideaText} 
                    onChange={e => setIdeaText(e.target.value)} 
                    rows={6} 
                    placeholder="Es. 'Lezione attiva su Dante usando i social media'..." 
                    autoFocus
                    className="bg-surface-container-high/50"
                />

                <div className="space-y-12">
                    <div className="flex items-center justify-between px-8">
                        <label className="flex items-center gap-8 cursor-pointer select-none">
                            <div className="switch"><input type="checkbox" checked={useKb} onChange={e => setUseKb(e.target.checked)} /><span className="slider"></span></div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Usa Context Knowledge Base</span>
                        </label>
                        <span className="text-[10px] font-black uppercase text-primary tracking-widest">{selectedKbIds.length} file</span>
                    </div>
                    
                    {useKb && knowledgeBase.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 p-12 bg-surface-container-low/50 rounded-xl border border-outline-variant/10 max-h-48 overflow-y-auto">
                            {knowledgeBase.map(k => (
                                <label key={k.id} className={`flex items-center gap-8 p-12 rounded-2xl border transition-all cursor-pointer ${selectedKbIds.includes(k.id) ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-high/30 border-outline-variant/10'}`}>
                                    <input type="checkbox" checked={selectedKbIds.includes(k.id)} onChange={() => handleKbToggle(k.id)} className="hidden" />
                                    <span className={`material-symbols-outlined text-sm ${selectedKbIds.includes(k.id) ? 'text-primary' : 'text-on-surface-variant'}`}>
                                        {selectedKbIds.includes(k.id) ? 'check_box' : 'check_box_outline_blank'}
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-widest truncate">{k.fileName}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-12 bg-error/10 border border-error/20 rounded-2xl flex items-center gap-8 text-error">
                        <span className="material-symbols-outlined">error</span>
                        <p className="text-xs font-black uppercase tracking-widest">{error}</p>
                    </div>
                )}
            </M3DialogContent>

            <M3DialogActions className="bg-surface-container-low/30 backdrop-blur-xl border-t border-outline-variant/10 px-12 pb-12 pt-0 gap-12">
                <M3Button onClick={onClose} variant="text" className="font-black text-xs uppercase tracking-widest">Annulla</M3Button>
                <M3Button 
                    onClick={handleGenerate} 
                    variant="filled" 
                    disabled={isLoading || !ideaText.trim()}
                    className="font-black text-xs uppercase tracking-widest shadow-lg !px-10"
                >
                    {isLoading ? <AiThinkingGem size={20} /> : (
                        <div className="flex items-center gap-8">
                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                            <span>Genera Piano</span>
                        </div>
                    )}
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default IdeaGeneratorModal;
