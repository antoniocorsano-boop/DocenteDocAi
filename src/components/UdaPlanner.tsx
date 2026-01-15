// LEGACY - MD3 Non-compliant
/**
 * UdaPlanner.tsx
 * // M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for layout, colors, spacing, and typography.
 */

import React, { useState } from 'react';
import { Uda, Competenza, UdaPlannerProps } from '../types';
import { UdaExportModal } from './UdaExportModal';
import Guidance from './Guidance';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, TextArea, EmptyState } from './ui';
import { useTheme } from '../theme/theme';

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
  const { layers } = useTheme();
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
        <div >
            {/* M3Expressive refactor: Aura ornaments with CSS classes */}
            <div  />
            
            <div >
                <div >
                    <div >
                        <div >
                            <span >{udaProp === 'new' ? 'add_task' : 'edit_document'}</span>
                        </div>
                        <div>
                            <h2 >{udaProp === 'new' ? 'Nuovo Progetto' : 'Modifica Progetto'}</h2>
                            <p >{currentUda.title || 'Senza titolo'}</p>
                        </div>
                    </div>
                    <M3Button onClick={handleClose} variant="text" >
                        <span >close</span>
                    </M3Button>
                </div>
                
                <div >
                    <div >
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

                    <div >
                        <TextField 
                            label="Link Deliverable (NotebookLM)"
                            value={currentUda.externalLink || ''}
                            onChange={e => handleFieldChange('externalLink', e.target.value)}
                            placeholder="Incolla l'URL dell'analisi di NotebookLM..."
                            leadingIcon="auto_awesome"
                            
                        />
                        <div >
                            <span >auto_awesome</span>
                            <p >Bridge AI: Connetti il progetto al tuo spazio di lavoro esterno.</p>
                        </div>
                    </div>
                    
                    <TextArea 
                        label="Introduzione / Contesto" 
                        value={currentUda.introduction} 
                        onChange={e => handleFieldChange('introduction', e.target.value)} 
                        rows={4} 
                        placeholder="Descrivi brevemente l'argomento e il contesto didattico..." 
                    />
                    
                    <div >
                        <label >Competenze Target</label>
                        <div 
                            
                            onClick={handlePickerOpen}
                        >
                            {currentUda.competencyIds.length > 0 ? (
                                currentUda.competencyIds.map(id => {
                                    const c = competenze.find(comp => comp.id === id);
                                    return (
                                        <span key={id} >
                                            {c?.codice}
                                        </span>
                                    );
                                })
                            ) : (
                                <div >
                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>add_circle</span>
                                    <span >Tocca per selezionare competenze</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div >
                        {udaProp !== 'new' && (
                            <M3Button 
                                onClick={handleDelete} 
                                variant="text" 
                                
                            >
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>delete</span>
                                Elimina
                            </M3Button>
                        )}
                        <M3Button onClick={handleClose} variant="text">Annulla</M3Button>
                        <M3Button onClick={handleSave} variant="primary" >
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>save</span>
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
                        <M3DialogContent >
                            <div >
                                {competenze.map(comp => {
                                    const isSelected = currentUda.competencyIds.includes(comp.id);
                                    return (
                                        <div 
                                            key={comp.id} 
                                            onClick={() => handleCompetencyToggle(comp.id)}
                                            className={`uda-picker-item ${isSelected ? 'uda-picker-item-selected' : ''}`}
                                        >
                                            <div className={`uda-picker-checkbox ${isSelected ? 'uda-picker-checkbox-selected' : ''}`}>
                                                {isSelected && <span >check</span>}
                                            </div>
                                            <div style={{ minWidth: "0" }}>
                                                <p >{comp.codice}</p>
                                                <p >{comp.nome}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </M3DialogContent>
                        <M3DialogActions >
                            <M3Button onClick={handlePickerClose} variant="primary" style={{ width: "100%" }}>Conferma Selezione</M3Button>
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
        <div >
            {/* M3Expressive refactor: Aura ornaments with CSS classes */}
            <div  />
            <div  />

            <div >
                <div >
                    <div >
                        <div >
                            <span >assignment</span>
                        </div>
                        <div>
                            <h1 >Planner Progetti</h1>
                            <p >Organizza le tue UDA</p>
                        </div>
                    </div>
                    <M3Button 
                        onClick={handleNewUda} 
                        variant="primary" 
                        
                    >
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>add</span>
                        Nuovo Progetto
                    </M3Button>
                </div>
                
                <div >
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
                    <div  style={{paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4']}}>
                        <div >
                            {udas.length > 0 ? (
                                <div  style={{ overflowX: "auto" }}>
                                    <table >
                                        <thead >
                                            <tr>
                                                <th >Titolo Progetto</th>
                                                <th >Classe</th>
                                                <th >Materia</th>
                                                <th >AI Bridge</th>
                                                <th >Azioni</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {udas.map((uda) => (
                                                <tr 
                                                    key={uda.id} 
                                                    
                                                    onClick={() => handleTableRowClick(uda)}
                                                >
                                                    <td >
                                                        <span >{uda.title}</span>
                                                    </td>
                                                    <td >
                                                        <span >{uda.classe}</span>
                                                    </td>
                                                    <td >
                                                        <span >{uda.materia}</span>
                                                    </td>
                                                    <td >
                                                        {uda.externalLink && (
                                                            <a 
                                                                href={uda.externalLink} 
                                                                target="_blank" 
                                                                rel="noreferrer" 
                                                                onClick={(e) => handleAiBridgeClick(uda, e)}
                                                                
                                                            >
                                                                <span >auto_awesome</span>
                                                            </a>
                                                        )}
                                                    </td>
                                                    <td  onClick={e => e.stopPropagation()}>
                                                        <div >
                                                            <M3Button 
                                                                onClick={() => handleExportUda(uda)} 
                                                                variant="text" 
                                                                
                                                            >
                                                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>ios_share</span>
                                                            </M3Button>
                                                            <M3Button 
                                                                onClick={() => handleEditUda(uda)} 
                                                                variant="text" 
                                                                
                                                            >
                                                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>edit</span>
                                                            </M3Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div >
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








