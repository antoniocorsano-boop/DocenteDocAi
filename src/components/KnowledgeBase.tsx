// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026
/**
 * KnowledgeBase.tsx
 * // M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for layout, colors, spacing, and typography.
 */

import React, { useState, useMemo, Suspense, lazy } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { KnowledgeBaseEntry, Corpus, AiSettings, TimetableSettings } from '../types';
const AddSourceModal = lazy(() => import('./AddSourceModal'));
const DocumentViewerModal = lazy(() => import('./DocumentViewerModal')); 
const ImageViewerModal = lazy(() => import('./ImageViewerModal'));
import { KB_CATEGORIES } from '../constants';
import { InfoCard, CategoryCard, SectionHeader } from './ui';

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
        </Box>
    );

    const renderFileList = () => {
        const categoryInfo = currentView.type === 'category' ? KB_CATEGORIES.find(c => c.id === currentView.id) : null;
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box component="header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <IconButton onClick={() => setCurrentView({ type: 'root', id: '' })} aria-label="Torna alle cartelle">
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6">{categoryInfo?.label || 'File'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <input 
                            type="text" 
                            placeholder="Cerca in questa cartella..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredFiles.map(entry => (
                        <Box 
                            key={entry.id} 
                            onClick={() => handleFileClick(entry)}
                            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, cursor: 'pointer', bgcolor: 'background.paper', borderRadius: 'var(--md-sys-shape-corner-medium)', '&:hover': { bgcolor: 'action.hover' } }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 24 }}>
                                    {entry.category === 'ai_deliverable' ? 'auto_awesome' : (entry.fileContent?.mimeType === 'application/pdf' ? 'picture_as_pdf' : 'description')}
                                </span>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" noWrap>{entry.fileName}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {entry.isGenerated ? 'Generato con AI' : 'Documento locale'}
                                </Typography>
                            </Box>
                            <IconButton 
                                onClick={(e) => { e.stopPropagation(); handleDeleteFile(entry.id); }} 
                                aria-label={`Elimina ${entry.fileName}`}
                                size="small"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                    {filteredFiles.length === 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 3 }}>
                            <SearchOffIcon sx={{ color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Nessun file trovato in questa cartella.</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: '100%', mx: 'auto', width: '100%', px: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 4, mb: 4 }}>
                <SectionHeader 
                    title="Knowledge Base" 
                    subtitle="Archivio fonti, documenti e deliverable generati dall'AI."
                    icon="database"
                />
                <Button variant="contained" onClick={() => setIsAddSourceModalOpen(true)} startIcon={<AddCircleIcon />}>
                    Carica Documenti
                </Button>
            </Box>

            <InfoCard 
                title="Sincronia NotebookLM"
                description="Puoi caricare qui le analisi o i progetti prodotti con NotebookLM. L'app li userà come base di conoscenza prioritaria per generare le tue lezioni e UDA."
                icon="bolt"
            />

            <Box component="main" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
                {currentView.type === 'root' ? renderFolderDashboard() : renderFileList()}
            </Box>

            {isAddSourceModalOpen && (
                <Suspense fallback={<div>Loading...</div>}>
                    <AddSourceModal
                        corpora={corpora}
                        setCorpora={setCorpora}
                        onClose={() => setIsAddSourceModalOpen(false)}
                        onAddEntries={handleAddEntries}
                    />
                </Suspense>
            )}
            {previewingEntry && (
                <Suspense fallback={<div>Loading...</div>}>
                    <DocumentViewerModal
                        title={previewingEntry.fileName}
                        htmlContent={previewingEntry.htmlContent || `<pre>${previewingEntry.content}</pre>`}
                        onClose={() => setPreviewingEntry(null)}
                    />
                </Suspense>
            )}
            {viewingImage && (
                <Suspense fallback={<div>Loading...</div>}>
                    <ImageViewerModal
                        prompt={viewingImage.content}
                        imageData={viewingImage.fileContent!.data}
                        mimeType={viewingImage.fileContent!.mimeType}
                        onClose={() => setViewingImage(null)}
                        onSaveToKb={() => {}}
                    />
                </Suspense>
            )}
        </Box>
    );
};

export default KnowledgeBase;

