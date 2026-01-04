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

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ knowledgeBase, setKnowledgeBase, corpora, setCorpora, aiSettings, showToast, settings, showGuidanceTips }) => {
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
            <div className="space-y-6 animate-in slide-in-from-right-4">
                <header className="flex items-center justify-between bg-surface-container-high/30 backdrop-blur-md p-4 rounded-3xl border border-outline-variant/30 shadow-sm">
                    <div className="flex items-center gap-3">
                        <M3Button onClick={() => setCurrentView({ type: 'root', id: '' })} variant="text" className="!min-w-0 !p-2">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </M3Button>
                        <h2 className="m3-headline-small font-black text-on-surface">{categoryInfo?.label || 'File'}</h2>
                    </div>
                    <div className="relative max-w-xs w-full">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">search</span>
                        <input 
                            type="text" 
                            placeholder="Cerca in questa cartella..." 
                            className="form-input !h-11 !pl-10 !rounded-full w-full bg-surface-container-low/50 border-outline-variant/30 focus:border-primary transition-all" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFiles.map(entry => (
                        <div 
                            key={entry.id} 
                            className="bg-surface-container-low/40 backdrop-blur-sm p-4 rounded-2xl border border-outline-variant/20 hover:bg-surface-container-high/60 transition-all cursor-pointer group flex items-center gap-4 shadow-sm hover:shadow-md"
                            onClick={() => handleFileClick(entry)}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${entry.category === 'ai_deliverable' ? 'bg-secondary-container/50 text-secondary' : 'bg-primary-container/50 text-primary'}`}>
                                <span className="material-symbols-outlined text-2xl">
                                    {entry.category === 'ai_deliverable' ? 'auto_awesome' : (entry.fileContent?.mimeType === 'application/pdf' ? 'picture_as_pdf' : 'description')}
                                </span>
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className="font-bold text-sm truncate text-on-surface">{entry.fileName}</p>
                                <p className="m3-label-small opacity-60 text-on-surface-variant uppercase tracking-wider">
                                    {entry.isGenerated ? 'Generato con AI' : 'Documento locale'}
                                </p>
                            </div>
                            <M3Button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteFile(entry.id); }} 
                                variant="text" 
                                className="!min-w-0 !p-2 text-error opacity-0 group-hover:opacity-100 hover:bg-error-container/30 transition-all"
                            >
                                <span className="material-symbols-outlined text-xl">delete</span>
                            </M3Button>
                        </div>
                    ))}
                    {filteredFiles.length === 0 && (
                        <div className="col-span-full py-20 text-center opacity-50">
                            <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
                            <p className="m3-body-large">Nessun file trovato in questa cartella.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="page-layout max-w-full mx-auto w-full px-4 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <SectionHeader 
                    title="Knowledge Base" 
                    subtitle="Archivio fonti, documenti e deliverable generati dall'AI."
                    icon="database"
                />
                <M3Button onClick={() => setIsAddSourceModalOpen(true)} variant="filled" className="shadow-lg px-6 py-6 rounded-2xl flex items-center gap-2">
                    <span className="material-symbols-outlined">add_circle</span>
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
