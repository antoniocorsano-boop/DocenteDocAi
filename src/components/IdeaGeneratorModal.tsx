// MD3 Compliant - Block N Migration Complete (5 violations eliminated)
// Note: Typography font sizes and functional border widths retained with eslint-disable comments
import React, { useState, useEffect } from 'react';
import { AiSettings, KnowledgeBaseEntry } from '../types';
import VoiceNoteRecorder from './VoiceNoteRecorder';
import { generateLessonFromIdea } from '../services/aiService';
import { Button, Box, Typography  } from '@mui/material';
import { M3Dialog, SelectField, TextArea, AiThinkingGem } from './ui';
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
                <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)'}}>
                    <span  style={{color: "var(--md-sys-color-tertiary)"}}>lightbulb</span>
                    <span>AI Lesson Lab</span>
                </div>
            }
            onClose={onClose}
            maxWidth="xl"
            buttons={
                <>
                    <Button onClick={onClose} variant="text" sx={{ fontWeight: 'var(--md-sys-typescale-weight-black)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)' }}>Annulla</Button>
                    <Button 
                        onClick={handleGenerate} 
                        variant="contained" 
                        disabled={isLoading || !ideaText.trim()}
                        sx={{ fontWeight: 'var(--md-sys-typescale-weight-black)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)' }}
                    >
                        {isLoading ? <AiThinkingGem size="small" /> : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-8)' }}>
                                <Typography component="span" sx={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>auto_awesome</Typography>
                                <span>Genera Piano</span>
                            </Box>
                        )}
                    </Button>
                </>
            }
        >
            <Box sx={{ backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-container-low) 70%, transparent)', p: 'var(--md-sys-spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                <SelectField 
                    label="Classe Destinazione" 
                    value={targetClass} 
                    onChange={e => setTargetClass(e.target.value)}
                    style={{ backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-container-high) 50%, transparent)' }}
                >
                    <option value="" disabled>Seleziona...</option>
                    {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                </SelectField>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <VoiceNoteRecorder onTranscription={handleTranscription} compact />
                </div>
                <TextArea 
                    label="Descrizione Idea" 
                    value={ideaText} 
                    onChange={e => setIdeaText(e.target.value)} 
                    rows={6} 
                    placeholder="Es. 'Lezione attiva su Dante usando i social media'..." 
                    autoFocus
                    style={{ backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-container-high) 50%, transparent)' }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <div  style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label  style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', cursor: "pointer"}}>
                            <div><input type="checkbox" checked={useKb} onChange={e => setUseKb(e.target.checked)} /><span></span></div>
                            <span style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)" }}>Usa Context Knowledge Base</span>
                        </label>
                        <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)" }}>{selectedKbIds.length} file</span>
                    </div>
                    
                    {useKb && knowledgeBase.length > 0 && (
                        <div style={{ padding: 'var(--md-sys-spacing-4)', backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-container-low) 50%, transparent)', borderRadius: 'var(--md-sys-shape-corner-large)' , display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1)", border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)", overflowY: "auto"}}>
                            {knowledgeBase.map(k => (
                                <label key={k.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--md-sys-spacing-8)',
                                    padding: 'var(--md-sys-spacing-12)',
                                    borderRadius: 'var(--md-sys-shape-corner-large)',
                                    border: selectedKbIds.includes(k.id) ? ' var(--md-sys-border-width-normal) solid var(--md-sys-color-primary)' : 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                                    backgroundColor: selectedKbIds.includes(k.id) ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container-high)',
                                    transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
                                    cursor: 'pointer',
                                    marginBottom: 'var(--md-sys-spacing-2)'
                                }}>
                                    <input type="checkbox" checked={selectedKbIds.includes(k.id)} onChange={() => handleKbToggle(k.id)} style={{ display: "none" }} />
                                    <span style={{
                                        fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                                        color: selectedKbIds.includes(k.id) ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
                                        userSelect: 'none'
                                    }}>
                                        {selectedKbIds.includes(k.id) ? 'check_box' : 'check_box_outline_blank'}
                                    </span>
                                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.fileName}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {error && (
                    <div style={{ padding: 'var(--md-sys-spacing-4)', backgroundColor: 'color-mix(in srgb, var(--md-sys-color-error) 10%, transparent)', borderRadius: 'var(--md-sys-shape-corner-large)' , border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)", display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', color: "var(--md-sys-color-error)"}}>
                        <span style={{}}>error</span>
                        <p style={{  fontSize: "var(--md-sys-typescale-label-large-font-size)" , fontWeight: "var(--md-sys-typescale-weight-black)", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)" }}>{error}</p>
                    </div>
                )}
            </Box>
        </M3Dialog>
    );
};

export default IdeaGeneratorModal;


