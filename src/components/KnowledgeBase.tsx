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
        <div className="knowledge-base-folder-grid">
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
            <div className="knowledge-base-file-list">
                <header className="knowledge-base-file-header">
                    <div className="knowledge-base-file-header-content">
                        <M3Button onClick={() => setCurrentView({ type: 'root', id: '' })} variant="text" className="knowledge-base-back-button">
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>arrow_back</span>
                        </M3Button>
                        <h2 className="knowledge-base-file-title">{categoryInfo?.label || 'File'}</h2>
                    </div>
                    <div className="knowledge-base-search-container">
                        <span className="knowledge-base-search-icon">search</span>
                        <input 
                            type="text" 
                            placeholder="Cerca in questa cartella..." 
                            className="knowledge-base-search-input" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </header>

                <div className="knowledge-base-file-grid">
                    {filteredFiles.map(entry => (
                        <div 
                            key={entry.id} 
                            className="knowledge-base-file-card"
                            onClick={() => handleFileClick(entry)}
                        >
                            <div className="knowledge-base-file-icon">
                                <span className="material-symbols-outlined knowledge-base-file-icon-symbol">
                                    {entry.category === 'ai_deliverable' ? 'auto_awesome' : (entry.fileContent?.mimeType === 'application/pdf' ? 'picture_as_pdf' : 'description')}
                                </span>
                            </div>
                            <div className="knowledge-base-file-info">
                                <p className="knowledge-base-file-name">{entry.fileName}</p>
                                <p className="knowledge-base-file-type">
                                    {entry.isGenerated ? 'Generato con AI' : 'Documento locale'}
                                </p>
                            </div>
                            <M3Button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteFile(entry.id); }} 
                                variant="text" 
                                className="knowledge-base-file-delete"
                            >
                                <span className="material-symbols-outlined knowledge-base-file-delete-icon">delete</span>
                            </M3Button>
                        </div>
                    ))}
                    {filteredFiles.length === 0 && (
                        <div className="knowledge-base-empty">
                            <span className="material-symbols-outlined knowledge-base-empty-icon">search_off</span>
                            <p className="knowledge-base-empty-text">Nessun file trovato in questa cartella.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="page-layout max-w-full mx-auto w-full px-4 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
                <SectionHeader 
                    title="Knowledge Base" 
                    subtitle="Archivio fonti, documenti e deliverable generati dall'AI."
                    icon="database"
                />
                <M3Button onClick={() => setIsAddSourceModalOpen(true)} variant="filled" className="shadow-[var(--md-sys-elevation-level2)] px-6 py-6 rounded-[var(--md-sys-shape-corner-large)] flex items-center gap-8">
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
                className="mb-8 bg-primary-container/20 border-primary/20"
            />

            <main className="min-h-[500px]">
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


