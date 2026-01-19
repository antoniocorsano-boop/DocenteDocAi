// LEGACY - MD3 Non-compliant
/**
 * KnowledgeBase.tsx
 * // M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for layout, colors, spacing, and typography.
 */

import React, { useState, useMemo } from 'react';
import { KnowledgeBaseEntry, Corpus, AiSettings, TimetableSettings } from '../types';
import AddSourceModal from './AddSourceModal';
import DocumentViewerModal from './DocumentViewerModal'; 
import ImageViewerModal from './ImageViewerModal';
import { KB_CATEGORIES } from '../constants';
import {
    InfoCard,
    CategoryCard,
    SectionHeader,
    M3Button
} from './ui';

interface KnowledgeBaseProps {
    knowledgeBase: KnowledgeBaseEntry[];
    setKnowledgeBase: React.Dispatch<React.SetStateAction<KnowledgeBaseEntry[]>>;
    corpora: Corpus[];
    setCorpora: React.Dispatch<React.SetStateAction<Corpus[]>>;
    aiSettings?: AiSettings;
    showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
    settings?: TimetableSettings;
    showGuidanceTips?: boolean;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ knowledgeBase, setKnowledgeBase, corpora, setCorpora, showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<{ type: 'root' | 'category' | 'corpus', id: string }>({ type: 'root', id: '' });
    const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);
    const [previewingEntry, setPreviewingEntry] = useState<KnowledgeBaseEntry | null>(null);
    const [viewingImage, setViewingImage] = useState<KnowledgeBaseEntry | null>(null);
    // aiSettings, settings, showGuidanceTips sono ricevuti come props ma non usati attualmente

    const handleDeleteFile = (fileId: string) => {
        if (!window.confirm(`Sei sicuro di voler eliminare questo file?`)) return;
        setKnowledgeBase(prev => prev.filter(entry => entry.id !== fileId));
    };

    const handleAddEntries = (newEntries: KnowledgeBaseEntry[]) => {
        setKnowledgeBase(prev => [...prev, ...newEntries]);
        showToast(`${newEntries.length} file aggiunti con successo!`, 'success');
    };

    const filteredFiles = useMemo(() => {
        return knowledgeBase.filter(entry => {
            const matchesSearch = entry.fileName.toLowerCase().includes(searchTerm.toLowerCase());
            if (!matchesSearch) return false;
            if (currentView.type === 'category') {
                if (currentView.id === 'archivio') return entry.category === 'archivio' || !entry.category;
                return entry.category === currentView.id;
            }
            if (currentView.type === 'corpus') return entry.corpusId === currentView.id;
            return false; 
        }).sort((a, b) => a.fileName.localeCompare(b.fileName));
    }, [knowledgeBase, searchTerm, currentView]);

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        KB_CATEGORIES.forEach(c => counts[c.id] = 0);
        knowledgeBase.forEach(entry => {
            const cat = entry.category || 'archivio';
            const target = counts[cat] !== undefined ? cat : 'archivio';
            counts[target] = (counts[target] || 0) + 1;
        });
        return counts;
    }, [knowledgeBase]);

    const handleFileClick = (entry: KnowledgeBaseEntry) => {
        if (entry.fileContent?.mimeType.startsWith('image/')) setViewingImage(entry);
        else setPreviewingEntry(entry);
    };

    const renderFolderDashboard = () => (
        <div >
             {KB_CATEGORIES.map(cat => (
                 <CategoryCard 
                    key={cat.id} 
                    id={cat.id}
                    label={cat.label}
                    icon={cat.icon}
                    color={cat.color}
                    isSelected={currentView.type === 'category' && currentView.id === cat.id}
                    onClick={() => setCurrentView({ type: 'category', id: cat.id })}
                    description={`${categoryCounts[cat.id] || 0} file salvati`}
                />
             ))}
        </div>
    );

    const renderFileList = () => {
        const categoryInfo = currentView.type === 'category' ? KB_CATEGORIES.find(c => c.id === currentView.id) : null;
        return (
            <div >
                <header >
                    <div >
                        <M3Button onClick={() => setCurrentView({ type: 'root', id: '' })} variant="text" >
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>arrow_back</span>
                        </M3Button>
                        <h2 >{categoryInfo?.label || 'File'}</h2>
                    </div>
                    <div >
                        <span >search</span>
                        <input 
                            type="text" 
                            placeholder="Cerca in questa cartella..." 
                             
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </header>

                <div >
                    {filteredFiles.map(entry => (
                        <div 
                            key={entry.id} 
                            
                            onClick={() => handleFileClick(entry)}
                        >
                            <div >
                                <span >
                                    {entry.category === 'ai_deliverable' ? 'auto_awesome' : (entry.fileContent?.mimeType === 'application/pdf' ? 'picture_as_pdf' : 'description')}
                                </span>
                            </div>
                            <div >
                                <p >{entry.fileName}</p>
                                <p >
                                    {entry.isGenerated ? 'Generato con AI' : 'Documento locale'}
                                </p>
                            </div>
                            <M3Button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteFile(entry.id); }} 
                                variant="text" 
                                
                            >
                                <span >delete</span>
                            </M3Button>
                        </div>
                    ))}
                    {filteredFiles.length === 0 && (
                        <div >
                            <span >search_off</span>
                            <p >Nessun file trovato in questa cartella.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div  style={{maxWidth: "100%", marginLeft: "auto", marginRight: "auto", width: "100%", paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)'}}>
            <div  style={{display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 'var(--md-sys-spacing-8)', marginBottom: 'var(--md-sys-spacing-8)'}}>
                <SectionHeader 
                    title="Knowledge Base" 
                    subtitle="Archivio fonti, documenti e deliverable generati dall'AI."
                    icon="database"
                />
                <M3Button onClick={() => setIsAddSourceModalOpen(true)} variant="filled" style={{ borderRadius: 'var(--md-sys-shape-corner-large)' , display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}}>
                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>add_circle</span>
                    Carica Documenti
                </M3Button>
            </div>

            <InfoCard 
                title="Sincronia NotebookLM"
                description="Puoi caricare qui le analisi o i progetti prodotti con NotebookLM. L'app li userà come base di conoscenza prioritaria per generare le tue lezioni e UDA."
                icon="bolt"
                variant="primary"
                style={{ backgroundColor: sys.colors.primaryContainer/20 , marginBottom: 'var(--md-sys-spacing-8)'}}
            />

            <main >
                {currentView.type === 'root' ? renderFolderDashboard() : renderFileList()}
            </main>

            {isAddSourceModalOpen && (
                <AddSourceModal
                    corpora={corpora}
                    setCorpora={setCorpora}
                    onClose={() => setIsAddSourceModalOpen(false)}
                    onAddEntries={handleAddEntries}
                />
            )}
            {previewingEntry && (
                <DocumentViewerModal
                    title={previewingEntry.fileName}
                    htmlContent={previewingEntry.htmlContent || `<pre>${previewingEntry.content}</pre>`}
                    onClose={() => setPreviewingEntry(null)}
                />
            )}
            {viewingImage && (
                 <ImageViewerModal
                    prompt={viewingImage.content}
                    imageData={viewingImage.fileContent!.data}
                    mimeType={viewingImage.fileContent!.mimeType}
                    onClose={() => setViewingImage(null)}
                    onSaveToKb={() => {}}
                />
            )}
        </div>
    );
};

export default KnowledgeBase;







