/**
 * UdaPlanner.tsx
 * // M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for layout, colors, spacing, and typography.
 */

import React, { useState } from 'react';
import { Uda, Competenza, UdaPlannerProps } from '../types';
import { UdaExportModal } from './UdaExportModal';
import Guidance from './Guidance';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, TextArea, EmptyState } from './ui';

const createNewUda = (): Uda => ({
    id: `uda-${Date.now()}`,
    title: '',
    classe: '',
    materia: '',
    introduction: '',
    finalProduct: '',
    competencyIds: [],
    phases: [{ id: `phase-${Date.now()}`, title: '', description: '', activities: '', duration: '' }],
    evaluation: '',
    tools: '',
    externalLink: '',
    startPos: 0,
    width: 100,
    color: 'var(--md-sys-color-primary)',
    borderColor: 'var(--md-sys-color-outline)',
    textColor: 'var(--md-sys-color-on-primary)'
});

interface UdaEditorProps {
    udaProp: Uda | 'new';
    onSaveUda: (uda: Uda) => void;
    onDeleteUda: (id: string) => void;
    onClose: () => void;
    competenze: Competenza[];
}

const UdaEditor: React.FC<UdaEditorProps> = ({ udaProp, onSaveUda, onDeleteUda, onClose, competenze }) => {
    const [currentUda, setCurrentUda] = useState<Uda>(udaProp === 'new' ? createNewUda() : { ...udaProp });
    const [isCompetencyPickerOpen, setIsCompetencyPickerOpen] = useState(false);

    const handleFieldChange = (field: keyof Uda, value: unknown) => setCurrentUda(prev => ({ ...prev, [field]: value }));
    
    const handleCompetencyToggle = (id: string) => {
        console.log(`Audit: Toggled competency ${id} for UDA ${currentUda.id}`);
        setCurrentUda(prev => ({ 
            ...prev, 
            competencyIds: prev.competencyIds.includes(id) 
                ? prev.competencyIds.filter(c => c !== id) 
                : [...prev.competencyIds, id] 
        }));
    };
    
    const handleSave = () => {
        if (!currentUda.title || !currentUda.classe) { alert("Titolo e Classe obbligatori."); return; }
        console.log(`Audit: Saved UDA ${currentUda.id}: ${currentUda.title}`);
        onSaveUda(currentUda);
        onClose();
    };

    const handleDelete = () => {
        if (confirm('Eliminare questo progetto?')) {
            console.log(`Audit: Deleted UDA ${currentUda.id}`);
            onDeleteUda(currentUda.id);
            onClose();
        }
    };

    const handleClose = () => {
        console.log(`Audit: Closed UDA editor for ${currentUda.id}`);
        onClose();
    };

    const handlePickerOpen = () => {
        console.log('Audit: Opened competency picker');
        setIsCompetencyPickerOpen(true);
    };

    const handlePickerClose = () => {
        console.log('Audit: Closed competency picker');
        setIsCompetencyPickerOpen(false);
    };

    return (
        <div className="uda-editor-container">
            {/* M3Expressive refactor: Aura ornaments with CSS classes */}
            <div className="uda-editor-aura" />
            
            <div className="uda-editor-content">
                <div className="uda-editor-header">
                    <div className="uda-editor-header-content">
                        <div className="uda-editor-icon">
                            <span className="material-symbols-outlined uda-editor-icon-font">{udaProp === 'new' ? 'add_task' : 'edit_document'}</span>
                        </div>
                        <div>
                            <h2 className="uda-editor-title">{udaProp === 'new' ? 'Nuovo Progetto' : 'Modifica Progetto'}</h2>
                            <p className="uda-editor-subtitle">{currentUda.title || 'Senza titolo'}</p>
                        </div>
                    </div>
                    <M3Button onClick={handleClose} variant="text" className="uda-editor-close-button">
                        <span className="material-symbols-outlined uda-editor-close-icon">close</span>
                    </M3Button>
                </div>
                
                <div className="uda-editor-form">
                    <div className="uda-editor-grid">
                        <div>
                            <TextField 
                                label="Titolo UDA" 
                                value={currentUda.title} 
                                onChange={e => handleFieldChange('title', e.target.value)} 
                                placeholder="Es. Il Rinascimento Scientifico" 
                                required
                            />
                        </div>
                        <TextField 
                            label="Classe" 
                            value={currentUda.classe} 
                            onChange={e => handleFieldChange('classe', e.target.value)} 
                            placeholder="Es. 3A" 
                            required
                        />
                        <TextField 
                            label="Materia" 
                            value={currentUda.materia} 
                            onChange={e => handleFieldChange('materia', e.target.value)} 
                            placeholder="Es. Storia" 
                            required
                        />
                    </div>

                    <div className="uda-editor-link-section">
                        <TextField 
                            label="Link Deliverable (NotebookLM)"
                            value={currentUda.externalLink || ''}
                            onChange={e => handleFieldChange('externalLink', e.target.value)}
                            placeholder="Incolla l'URL dell'analisi di NotebookLM..."
                            leadingIcon="auto_awesome"
                            className="uda-editor-link-field"
                        />
                        <div className="uda-editor-link-hint">
                            <span className="material-symbols-outlined uda-editor-link-icon">auto_awesome</span>
                            <p className="uda-editor-link-text">Bridge AI: Connetti il progetto al tuo spazio di lavoro esterno.</p>
                        </div>
                    </div>
                    
                    <TextArea 
                        label="Introduzione / Contesto" 
                        value={currentUda.introduction} 
                        onChange={e => handleFieldChange('introduction', e.target.value)} 
                        rows={4} 
                        placeholder="Descrivi brevemente l'argomento e il contesto didattico..." 
                    />
                    
                    <div className="uda-competency-section">
                        <label className="uda-competency-label">Competenze Target</label>
                        <div 
                            className="uda-competency-picker"
                            onClick={handlePickerOpen}
                        >
                            {currentUda.competencyIds.length > 0 ? (
                                currentUda.competencyIds.map(id => {
                                    const c = competenze.find(comp => comp.id === id);
                                    return (
                                        <span key={id} className="uda-competency-chip">
                                            {c?.codice}
                                        </span>
                                    );
                                })
                            ) : (
                                <div className="uda-competency-placeholder">
                                    <span className="material-symbols-outlined">add_circle</span>
                                    <span className="uda-competency-placeholder-text">Tocca per selezionare competenze</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="uda-editor-actions">
                        {udaProp !== 'new' && (
                            <M3Button 
                                onClick={handleDelete} 
                                variant="text" 
                                className="uda-editor-actions-delete"
                            >
                                <span className="material-symbols-outlined">delete</span>
                                Elimina
                            </M3Button>
                        )}
                        <M3Button onClick={handleClose} variant="text">Annulla</M3Button>
                        <M3Button onClick={handleSave} variant="primary" className="shadow-elevation-level3">
                            <span className="material-symbols-outlined">save</span>
                            Salva Progetto
                        </M3Button>
                    </div>
                </div>

                 {isCompetencyPickerOpen && (
                    <M3Dialog
                        onClose={handlePickerClose}
                        title="Seleziona Competenze"
                        maxWidth="2xl"
                        level={2}
                    >
                        <M3DialogContent className="uda-picker-dialog-content">
                            <div className="uda-picker-grid">
                                {competenze.map(comp => {
                                    const isSelected = currentUda.competencyIds.includes(comp.id);
                                    return (
                                        <div 
                                            key={comp.id} 
                                            onClick={() => handleCompetencyToggle(comp.id)}
                                            className={`uda-picker-item ${isSelected ? 'uda-picker-item-selected' : ''}`}
                                        >
                                            <div className={`uda-picker-checkbox ${isSelected ? 'uda-picker-checkbox-selected' : ''}`}>
                                                {isSelected && <span className="material-symbols-outlined uda-picker-check-icon">check</span>}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="uda-picker-code">{comp.codice}</p>
                                                <p className="uda-picker-name">{comp.nome}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </M3DialogContent>
                        <M3DialogActions className="uda-picker-actions">
                            <M3Button onClick={handlePickerClose} variant="primary" className="w-full">Conferma Selezione</M3Button>
                        </M3DialogActions>
                    </M3Dialog>
                )}
            </div>
        </div>
    );
};

const UdaPlanner: React.FC<UdaPlannerProps & { udas?: Uda[] }> = (props) => {
    // Accept both 'uda' and 'udas' for backward compatibility
    const udas: Uda[] = Array.isArray(props.udas)
        ? props.udas
        : Array.isArray(props.uda)
            ? props.uda
            : [];
    const { onSaveUda, onDeleteUda, aiSettings, competenze, settings, onSaveReport, showGuidanceTips } = props;
    const [editingUda, setEditingUda] = useState<Uda | 'new' | null>(null);
    const [exportingUda, setExportingUda] = useState<Uda | null>(null);

    const handleNewUda = () => {
        console.log('Audit: Opened new UDA modal');
        setEditingUda('new');
    };

    const handleEditUda = (uda: Uda) => {
        console.log(`Audit: Opened edit modal for UDA ${uda.id}`);
        setEditingUda(uda);
    };

    const handleExportUda = (uda: Uda) => {
        console.log(`Audit: Opened export modal for UDA ${uda.id}`);
        setExportingUda(uda);
    };

    const handleCloseExport = () => {
        console.log('Audit: Closed export modal');
        setExportingUda(null);
    };

    const handleTableRowClick = (uda: Uda) => {
        console.log(`Audit: Clicked on UDA ${uda.id} in table`);
        setEditingUda(uda);
    };

    const handleAiBridgeClick = (uda: Uda, e: React.MouseEvent) => {
        e.stopPropagation();
        console.log(`Audit: Clicked AI bridge link for UDA ${uda.id}`);
    };

    return (
        <div className="uda-planner-layout">
            {/* M3Expressive refactor: Aura ornaments with CSS classes */}
            <div className="uda-planner-aura-primary" />
            <div className="uda-planner-aura-secondary" />

            <div className="uda-planner-content">
                <div className="uda-planner-header">
                    <div className="uda-planner-title-section">
                        <div className="uda-planner-icon">
                            <span className="material-symbols-outlined uda-planner-icon-font">assignment</span>
                        </div>
                        <div>
                            <h1 className="uda-planner-title">Planner Progetti</h1>
                            <p className="uda-planner-subtitle">Organizza le tue UDA</p>
                        </div>
                    </div>
                    <M3Button 
                        onClick={handleNewUda} 
                        variant="primary" 
                        className="shadow-elevation-level3"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Nuovo Progetto
                    </M3Button>
                </div>
                
                <div className="uda-planner-guidance">
                    <Guidance id="uda-planner-intro" icon="auto_awesome" title="Organizza i tuoi Progetti" isGloballyEnabled={showGuidanceTips}>
                        <p>Crea le tue Unit� di Apprendimento. Puoi collegare link esterni (es. NotebookLM) per accedere velocemente alle tue analisi AI.</p>
                    </Guidance>
                </div>
                
                {editingUda ? (
                    <UdaEditor 
                        udaProp={editingUda} 
                        onSaveUda={onSaveUda} 
                        onDeleteUda={onDeleteUda} 
                        onClose={() => setEditingUda(null)} 
                        competenze={competenze}
                    />
                ) : (
                    <div className="px-4 md:px-0">
                        <div className="uda-planner-table-container">
                            {udas.length > 0 ? (
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="uda-planner-table">
                                        <thead className="uda-planner-table-header">
                                            <tr>
                                                <th className="uda-planner-table-header th">Titolo Progetto</th>
                                                <th className="uda-planner-table-header th">Classe</th>
                                                <th className="uda-planner-table-header th">Materia</th>
                                                <th className="uda-planner-table-header th uda-table-cell-ai-bridge">AI Bridge</th>
                                                <th className="uda-planner-table-header th">Azioni</th>
                                            </tr>
                                        </thead>
                                        <tbody className="uda-planner-table-body">
                                            {udas.map((uda) => (
                                                <tr 
                                                    key={uda.id} 
                                                    className="uda-planner-table-row"
                                                    onClick={() => handleTableRowClick(uda)}
                                                >
                                                    <td className="uda-table-cell">
                                                        <span className="uda-table-cell-title">{uda.title}</span>
                                                    </td>
                                                    <td className="uda-table-cell">
                                                        <span className="uda-table-cell-classe">{uda.classe}</span>
                                                    </td>
                                                    <td className="uda-table-cell">
                                                        <span className="uda-table-cell-materia">{uda.materia}</span>
                                                    </td>
                                                    <td className="uda-table-cell-ai-bridge">
                                                        {uda.externalLink && (
                                                            <a 
                                                                href={uda.externalLink} 
                                                                target="_blank" 
                                                                rel="noreferrer" 
                                                                onClick={(e) => handleAiBridgeClick(uda, e)}
                                                                className="uda-ai-bridge-link"
                                                            >
                                                                <span className="material-symbols-outlined uda-ai-bridge-icon filled-icon">auto_awesome</span>
                                                            </a>
                                                        )}
                                                    </td>
                                                    <td className="uda-table-cell-actions" onClick={e => e.stopPropagation()}>
                                                        <div className="uda-table-actions">
                                                            <M3Button 
                                                                onClick={() => handleExportUda(uda)} 
                                                                variant="text" 
                                                                className="uda-table-action-button"
                                                            >
                                                                <span className="material-symbols-outlined">ios_share</span>
                                                            </M3Button>
                                                            <M3Button 
                                                                onClick={() => handleEditUda(uda)} 
                                                                variant="text" 
                                                                className="uda-table-action-button"
                                                            >
                                                                <span className="material-symbols-outlined">edit</span>
                                                            </M3Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="uda-planner-empty">
                                    <EmptyState 
                                        title="Nessun progetto" 
                                        description="Crea la tua prima UDA per iniziare a pianificare l'anno scolastico." 
                                        icon="assignment" 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
             {exportingUda && (
                <UdaExportModal 
                    uda={exportingUda} 
                    aiSettings={aiSettings} 
                    competenze={competenze} 
                    settings={settings} 
                    onClose={handleCloseExport} 
                    onSaveReport={onSaveReport} 
                />
            )}
        </div>
    );
};

export default UdaPlanner;



