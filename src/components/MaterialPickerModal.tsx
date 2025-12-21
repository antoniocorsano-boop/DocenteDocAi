
import React, { useState, useMemo, useCallback } from 'react';
import { KnowledgeBaseEntry, MaterialeDidattico } from '../types';
import { useDropzone } from 'react-dropzone';
import { blobToBase64Parts } from '../utils/documentUtils';

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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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

    return (
        <div className="dialog-backdrop">
            <div className="dialog-container w-full max-w-4xl h-[90vh]">
                <div className="dialog-header">
                    <h2 className="m3-headline-medium">Allega Materiali</h2>
                    <button onClick={onClose} className="icon-button"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="dialog-content-grid-tall">
                    {/* Left: Source */}
                    <div className="p-4 border-r border-outline-variant flex flex-col gap-4">
                        <div className="m3-option-group full-width">
                            <button onClick={() => setActiveTab('kb')} className={`m3-option-item ${activeTab === 'kb' ? 'active' : ''}`}>KB</button>
                            <button onClick={() => setActiveTab('file')} className={`m3-option-item ${activeTab === 'file' ? 'active' : ''}`}>File</button>
                            <button onClick={() => setActiveTab('link')} className={`m3-option-item ${activeTab === 'link' ? 'active' : ''}`}>Link</button>
                        </div>

                        {activeTab === 'kb' && (
                            <div className="flex-grow flex flex-col gap-4 overflow-hidden">
                                <input type="text" placeholder="Cerca..." className="form-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                <div className="selection-container flex-grow">
                                    {filteredKb.map(entry => {
                                        const isSelected = materials.some(m => m.type === 'kb' && m.kbId === entry.id);
                                        return (
                                            <div key={entry.id} className="chip-checkbox">
                                                <input type="checkbox" checked={isSelected} onChange={() => handleToggleKb(entry)} />
                                                <label className="chip w-full justify-start">
                                                    {isSelected && <span className="material-symbols-outlined text-lg">check</span>}
                                                    <span className="truncate">{entry.fileName}</span>
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {activeTab === 'file' && (
                            <div {...getRootProps()} className={`dropzone-area ${isUploading ? 'disabled' : ''}`} data-active={isDragActive}>
                                <input {...getInputProps()} />
                                <div className="upload-icon-circle"><span className="material-symbols-outlined text-3xl text-on-surface-variant">upload_file</span></div>
                                <p className="m3-title-medium">Carica file</p>
                            </div>
                        )}

                        {activeTab === 'link' && (
                            <div className="space-y-4">
                                <input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="form-input w-full" placeholder="URL (www.esempio.it)" />
                                <input type="text" value={linkLabel} onChange={e => setLinkLabel(e.target.value)} className="form-input w-full" placeholder="Etichetta" />
                                <button onClick={handleAddLink} className="button button-filled w-full">Aggiungi</button>
                            </div>
                        )}
                    </div>
                    {/* Right: Selected */}
                    <div className="p-4 flex flex-col gap-4">
                        <h3 className="m3-title-medium">Selezionati ({materials.length})</h3>
                        <div className="chip-input-container stack flex-grow overflow-y-auto">
                            {materials.map(material => (
                                <div key={material.id} className="chip justify-between">
                                    <div className="flex items-center gap-2 truncate">
                                        <span className="material-symbols-outlined">{getMaterialIcon(material)}</span>
                                        <span className="truncate">{getMaterialLabel(material)}</span>
                                    </div>
                                    <button onClick={() => handleRemoveMaterial(material.id)} className="icon-button text-error !w-6 !h-6"><span className="material-symbols-outlined text-sm">close</span></button>
                                </div>
                            ))}
                            {materials.length === 0 && <p className="text-center text-on-surface-variant mt-10">Nessun materiale.</p>}
                        </div>
                    </div>
                </div>
                <div className="dialog-footer">
                    <button onClick={onClose} className="button button-text">Annulla</button>
                    <button onClick={() => onSave(materials)} className="button button-filled">Salva</button>
                </div>
            </div>
        </div>
    );
};

export default MaterialPickerModal;
