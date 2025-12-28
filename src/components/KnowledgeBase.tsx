import React, { useState, useMemo } from 'react';
import { KnowledgeBaseEntry, Corpus } from '../types';
import AddSourceModal from './AddSourceModal';
import DocumentViewerModal from './DocumentViewerModal'; 
import ImageViewerModal from './ImageViewerModal';
import { KB_CATEGORIES } from '../constants';
import { InfoCard, CategoryCard } from './M3Components';

interface KnowledgeBaseProps {
    knowledgeBase: KnowledgeBaseEntry[];
    setKnowledgeBase: React.Dispatch<React.SetStateAction<KnowledgeBaseEntry[]>>;
    corpora: Corpus[];
    setCorpora: React.Dispatch<React.SetStateAction<Corpus[]>>;
    showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in">
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
            <div className="space-y-4 animate-in slide-in-from-right-4">
                <header className="flex items-center justify-between bg-surface-container p-4 rounded-2xl border border-outline-variant">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setCurrentView({ type: 'root', id: '' })} className="icon-button"><span className="material-symbols-outlined">arrow_back</span></button>
                        <h2 className="m3-headline-small font-black">{categoryInfo?.label || 'File'}</h2>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Cerca in questa cartella..." 
                        className="form-input !h-10 !rounded-full max-w-xs" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredFiles.map(entry => (
                        <div key={entry.id} className="m3-list-item-card !p-4 hover:bg-surface-container-high transition-all" onClick={() => handleFileClick(entry)}>
                            <div className="flex items-center gap-4 flex-grow min-w-0">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${entry.category === 'ai_deliverable' ? 'bg-secondary-container text-secondary' : 'bg-primary-container text-primary'}`}>
                                    <span className="material-symbols-outlined">
                                        {entry.category === 'ai_deliverable' ? 'auto_awesome' : (entry.fileContent?.mimeType === 'application/pdf' ? 'picture_as_pdf' : 'description')}
                                    </span>
                                </div>
                                <div className="truncate">
                                    <p className="font-bold text-sm truncate">{entry.fileName}</p>
                                    <p className="m3-body-small opacity-60">
                                        {entry.isGenerated ? 'Generato con AI' : 'Documento locale'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteFile(entry.id); }} className="icon-button text-error !w-8 !h-8"><span className="material-symbols-outlined text-base">delete</span></button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="page-layout p-4 md:p-8 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="m3-display-small font-black">Knowledge Base</h1>
                    <p className="m3-body-medium text-on-surface-variant">Archivio fonti e deliverable AI.</p>
                </div>
                <button onClick={() => setIsAddSourceModalOpen(true)} className="button button-filled shadow-lg">
                    <span className="material-symbols-outlined mr-2">add_circle</span> Carica Documenti
                </button>
            </header>

            <InfoCard 
                title="Sincronia NotebookLM"
                description="Puoi caricare qui le analisi o i progetti prodotti con NotebookLM. L'app li userà come base di conoscenza prioritaria per generare le tue lezioni e UDA."
                icon="bolt"
                variant="primary"
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
