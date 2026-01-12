
import React, { useState, useMemo, useCallback } from 'react';
import { KnowledgeBaseEntry, MaterialeDidattico } from '../types';
import { useFileDrop } from '../hooks/useFileDrop';
import { blobToBase64Parts } from '../utils/documentUtils';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, TabGroup } from './ui';

interface MaterialPickerModalProps {
    knowledgeBase: KnowledgeBaseEntry[];
    currentMaterials: MaterialeDidattico[];
    onClose: () => void;
    onSave: (materials: MaterialeDidattico[]) => void;
}

const MaterialPickerModal: React.FC<MaterialPickerModalProps> = ({ knowledgeBase, currentMaterials, onClose, onSave }) => {
    const [activeTab, setActiveTab] = useState<'kb' | 'file' | 'link'>('kb');
    const [materials, setMaterials] = useState<MaterialeDidattico[]>(currentMaterials);

    const [searchTerm, setSearchTerm] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [linkLabel, setLinkLabel] = useState('');
    const [linkUrl, setLinkUrl] = useState('');

    const filteredKb = useMemo(() => {
        return knowledgeBase.filter(entry =>
            entry.fileName.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => a.fileName.localeCompare(b.fileName));
    }, [knowledgeBase, searchTerm]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setIsUploading(true);
        const newFileMaterials: MaterialeDidattico[] = [];
        for (const file of acceptedFiles) {
            try {
                const { data, mimeType } = await blobToBase64Parts(file);
                newFileMaterials.push({
                    type: 'file',
                    id: `mat-file-${Date.now()}-${Math.random()}`,
                    file: { name: file.name, content: data, mimeType },
                });
            } catch (e) {
                console.error("Error processing file", e);
            }
        }
        setMaterials(prev => [...prev, ...newFileMaterials]);
        setIsUploading(false);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useFileDrop({ onDrop });

    const handleToggleKb = (kbEntry: KnowledgeBaseEntry) => {
        const existing = materials.find(m => m.type === 'kb' && m.kbId === kbEntry.id);
        if (existing) {
            setMaterials(prev => prev.filter(m => m.id !== existing.id));
        } else {
            const newMaterial: MaterialeDidattico = {
                type: 'kb',
                id: `mat-kb-${kbEntry.id}`,
                kbId: kbEntry.id,
                fileName: kbEntry.fileName,
            };
            setMaterials(prev => [...prev, newMaterial]);
        }
    };

    const handleAddLink = () => {
        if (!linkLabel.trim() || !linkUrl.trim()) {
            alert("Compila URL ed etichetta.");
            return;
        }
        let correctedUrl = linkUrl.trim();
        if (!/^https?:\/\//i.test(correctedUrl)) correctedUrl = 'https://' + correctedUrl;

        const newLink: MaterialeDidattico = {
            type: 'link',
            id: `mat-link-${Date.now()}`,
            label: linkLabel,
            url: correctedUrl,
        };
        setMaterials(prev => [...prev, newLink]);
        setLinkLabel('');
        setLinkUrl('');
    };

    const handleRemoveMaterial = (id: string) => {
        setMaterials(prev => prev.filter(m => m.id !== id));
    };

    const getMaterialLabel = (material: MaterialeDidattico): string => {
        switch (material.type) {
            case 'kb': return material.fileName || 'Doc';
            case 'link': return material.label || 'Link';
            case 'file': return material.file?.name || 'File';
            case 'ai_deliverable': return material.label || 'AI Deliverable';
            default: return 'Materiale';
        }
    };

    const getMaterialIcon = (material: MaterialeDidattico): string => {
        switch (material.type) {
            case 'kb': return 'cloud_done';
            case 'link': return 'link';
            case 'file': return 'attach_file';
            case 'ai_deliverable': return 'auto_awesome';
            default: return 'inventory_2';
        }
    };

    const tabs = [
        { id: 'kb', label: 'Knowledge Base', icon: 'database' },
        { id: 'file', label: 'File Locale', icon: 'upload_file' },
        { id: 'link', label: 'Link Web', icon: 'link' },
    ];

    return (
        <M3Dialog
            title="Allega Materiali"
            onClose={onClose}
            maxWidth="4xl"
            level={2}
        >
            <M3DialogContent className="p-0 bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm">
                <div className="md:grid-cols-2 h-[500px]" style={{ display: "grid", gridTemplateColumns: "1fr" }}>
                    {/* Left: Source */}
                    <div className="border-[var(--md-sys-color-outline-variant)]/30 overflow-hidden" style={{ padding: "var(--md-sys-spacing-6)", borderRight: "1px solid var(--md-sys-color-outline)", display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-6)" }}>
                        <TabGroup
                            tabs={tabs}
                            activeTab={activeTab}
                            onChange={(id) => setActiveTab(id)}
                            variant="secondary"
                        />

                        {activeTab === 'kb' && (
                            <div className="overflow-hidden" style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-8)" }}>
                                <TextField 
                                    label="Cerca nella KB..." 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    fullWidth
                                />
                                <div className="custom-scrollbar pr-2" style={{ flexGrow: "1", overflowY: "auto", gap: "var(--md-sys-spacing-2)" }}>
                                    {filteredKb.map(entry => {
                                        const isSelected = materials.some(m => m.type === 'kb' && m.kbId === entry.id);
                                        return (
                                            <div 
                                                key={entry.id} 
                                                onClick={() => handleToggleKb(entry)}
                                                className={`flex items-center gap-6 p-6 rounded-[var(--md-sys-shape-corner-large)] cursor-pointer transition-all border ${
                                                    isSelected 
                                                        ? 'bg-primary/10 border-primary text-primary' 
                                                        : 'bg-[var(--md-sys-color-surface-container-low)] border-[var(--md-sys-color-outline-variant)]/30 hover:bg-[var(--md-sys-color-surface-container)]'
                                                }`}
                                            >
                                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>
                                                    {isSelected ? 'check_circle' : 'description'}
                                                </span>
                                                <span className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: "1" }}>{entry.fileName}</span>
                                            </div>
                                        )
                                    })}
                                    {filteredKb.length === 0 && (
                                        <div className="py-10" style={{ textAlign: "center", opacity: "0.5" }}>Nessun documento trovato.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'file' && (
                            <div 
                                {...getRootProps()} 
                                className={`flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-[var(--md-sys-shape-corner-extra-large)] transition-all ${
                                    isDragActive 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-[var(--md-sys-color-outline-variant)]/50 bg-[var(--md-sys-color-surface-container-low)]'
                                } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[var(--md-sys-color-surface-container)]'}`}
                            >
                                <input {...getInputProps()} />
                                <div className="bg-primary/10" style={{ width: "4rem", height: "4rem", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--md-sys-spacing-8)" }}>
                                    <span className="material-symbols-outlined text-3xl" style={{ color: "var(--md-sys-color-primary)" }}>upload_file</span>
                                </div>
                                <p className="m3-title-medium">Trascina qui i file</p>
                                <p className="m3-body-small" style={{ opacity: "0.7", marginTop: "var(--md-sys-spacing-4)" }}>oppure clicca per sfogliare</p>
                            </div>
                        )}

                        {activeTab === 'link' && (
                            <div style={{
  marginTop: 'var(--md-sys-spacing-4)'
}}>
                                <TextField 
                                    label="URL (es. https://...)" 
                                    value={linkUrl} 
                                    onChange={e => setLinkUrl(e.target.value)} 
                                    fullWidth 
                                />
                                <TextField 
                                    label="Etichetta (es. Video Lezione)" 
                                    value={linkLabel} 
                                    onChange={e => setLinkLabel(e.target.value)} 
                                    fullWidth 
                                />
                                <M3Button onClick={handleAddLink} variant="filled" className="!h-14" style={{ width: "100%" }}>
                                    <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>add</span>
                                    Aggiungi Link
                                </M3Button>
                            </div>
                        )}
                    </div>

                    {/* Right: Selected */}
                    <div className="overflow-hidden bg-[var(--md-sys-color-surface-container-low)]est/50" style={{ padding: "var(--md-sys-spacing-6)", display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-8)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <h3 className="m3-title-medium">Selezionati</h3>
                            <span className="px-3 py-1" style={{ borderRadius: "9999px", backgroundColor: "var(--md-sys-color-primary)", color: "var(--md-sys-color-on-primary)", fontSize: "0.75rem", fontWeight: "bold" }}>
                                {materials.length}
                            </span>
                        </div>
                        <div className="custom-scrollbar pr-2" style={{ flexGrow: "1", overflowY: "auto", gap: "var(--md-sys-spacing-2)" }}>
                            {materials.map(material => (
                                <div key={material.id} className="rounded-[var(--md-sys-shape-corner-large)] bg-[var(--md-sys-color-surface-container)] border-[var(--md-sys-color-outline-variant)]/30 group" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-primary)" }}>{getMaterialIcon(material)}</span>
                                        <span className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getMaterialLabel(material)}</span>
                                    </div>
                                    <M3Button 
                                        onClick={() => handleRemoveMaterial(material.id)} 
                                        variant="text" 
                                        className="!p-8 !min-w-0 group-hover:opacity-100" style={{ color: "var(--md-sys-color-error)", opacity: "0", transition: "opacity 300ms" }}
                                    >
                                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>close</span>
                                    </M3Button>
                                </div>
                            ))}
                            {materials.length === 0 && (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", opacity: "0.3" }}>
                                    <span className="material-symbols-outlined text-6xl" style={{ marginBottom: "var(--md-sys-spacing-8)" }}>inventory_2</span>
                                    <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">Nessun materiale selezionato</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </M3DialogContent>
            <M3DialogActions className="bg-[var(--md-sys-color-surface-container-low)]est border-[var(--md-sys-color-outline-variant)]/30" style={{ borderTop: "1px solid var(--md-sys-color-outline)" }}>
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button onClick={() => onSave(materials)} variant="filled">Salva</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default MaterialPickerModal;

export default MaterialPickerModal;


