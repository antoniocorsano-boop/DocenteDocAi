// LEGACY - MD3 Non-compliant
import React, { useState, useEffect } from 'react';
import { AiSettings, KnowledgeBaseEntry } from '../types';
import VoiceNoteRecorder from './VoiceNoteRecorder';
import { generateLessonFromIdea } from '../services/aiService';
import { SelectField, TextArea, M3Dialog, M3DialogContent, M3DialogActions, M3Button, AiThinkingGem } from './ui';
import { useTheme } from '../theme/theme';

interface IdeaGeneratorModalProps {
    onClose: () => void;
    onGenerate: (content: { title: string; htmlContent: string }) => void;
    aiSettings: AiSettings;
    userClasses: string[];
    knowledgeBase: KnowledgeBaseEntry[];
}

const IdeaGeneratorModal: React.FC<IdeaGeneratorModalProps> = ({ onClose, onGenerate, aiSettings, userClasses, knowledgeBase }) => {
  const { layers } = useTheme();
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
                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6']}}>
                    <span  style={{color: "layers.sys.colors.tertiary"}}>lightbulb</span>
                    <span>AI Lesson Lab</span>
                </div>
            }
            onClose={onClose}
            maxWidth="xl"
            level={1}
        >
            <M3DialogContent style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]/30, padding: ref.spacing[12] }}>
                <SelectField 
                    label="Classe Destinazione" 
                    value={targetClass} 
                    onChange={e => setTargetClass(e.target.value)}
                    style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)]/50 }}
                >
                    <option value="" disabled>Seleziona...</option>
                    {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                </SelectField>

                <div >
                    <VoiceNoteRecorder onTranscription={handleTranscription} compact />
                </div>
                <TextArea 
                    label="Descrizione Idea" 
                    value={ideaText} 
                    onChange={e => setIdeaText(e.target.value)} 
                    rows={6} 
                    placeholder="Es. 'Lezione attiva su Dante usando i social media'..." 
                    autoFocus
                    style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)]/50 }}
                />

                <div >
                    <div  style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label  style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], cursor: "pointer"}}>
                            <div ><input type="checkbox" checked={useKb} onChange={e => setUseKb(e.target.checked)} /><span ></span></div>
                            <span style={{ color: sys.colors.[11px], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>Usa Context Knowledge Base</span>
                        </label>
                        <span style={{ color: sys.colors.[10px] }} style={{fontWeight: "900", textTransform: "uppercase", color: "layers.sys.colors.primary", letterSpacing: "0.1em"}}>{selectedKbIds.length} file</span>
                    </div>
                    
                    {useKb && knowledgeBase.length > 0 && (
                        <div style={{ padding: ref.spacing[12], backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]/50, borderRadius: ref.shape[] }} style={{display: "grid", gridTemplateColumns: "1fr", border: "1px solid layers.sys.colors.outline", overflowY: "auto"}}>
                            {knowledgeBase.map(k => (
                                <label key={k.id} className={`flex items-center gap-8 p-12 rounded-[var(--md-sys-shape-corner-large)] border transition-all cursor-pointer ${selectedKbIds.includes(k.id) ? 'bg-primary/10 border-primary/30' : 'bg-[var(--md-sys-color-surface-container-high)]/30 border-[var(--md-sys-color-outline-variant)]/10'}`}>
                                    <input type="checkbox" checked={selectedKbIds.includes(k.id)} onChange={() => handleKbToggle(k.id)} style={{ display: "none" }} />
                                    <span className={`material-symbols-outlined text-sm ${selectedKbIds.includes(k.id) ? 'text-primary' : 'text-[var(--md-sys-color-on-surface)]-variant'}`}>
                                        {selectedKbIds.includes(k.id) ? 'check_box' : 'check_box_outline_blank'}
                                    </span>
                                    <span style={{ color: sys.colors.[10px] }} style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.fileName}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {error && (
                    <div style={{ padding: ref.spacing[12], backgroundColor: sys.colors.error/10, borderRadius: ref.shape[] }} style={{border: "1px solid layers.sys.colors.outline", display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], color: "layers.sys.colors.error"}}>
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>error</span>
                        <p style={{ fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>{error}</p>
                    </div>
                )}
            </M3DialogContent>

            <M3DialogActions style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]/30 }} style={{borderTop: "1px solid layers.sys.colors.outline", paddingTop: "0"}}>
                <M3Button onClick={onClose} variant="text" style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Annulla</M3Button>
                <M3Button 
                    onClick={handleGenerate} 
                    variant="filled" 
                    disabled={isLoading || !ideaText.trim()}
                     style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}
                >
                    {isLoading ? <AiThinkingGem size={20} /> : (
                        <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                            <span  style={{ fontSize: "0.875rem" }}>auto_awesome</span>
                            <span>Genera Piano</span>
                        </div>
                    )}
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default IdeaGeneratorModal;



