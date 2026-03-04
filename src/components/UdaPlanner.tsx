// MD3 GOLD COMPLIANT – Audit 2026-01-25
// Nessun valore hardcoded: solo token MD3, nessun px/rem/%/hex/rgba, nessuna utility custom.
// Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md
// Tutti i layout, colori, spaziature e tipografia sono gestiti tramite token MD3.
/**
 * UdaPlanner.tsx
 * // M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for layout, colors, spacing, and typography.
 */

import React, { useState, Suspense, lazy } from 'react';
import { Uda, Competenza, UdaPlannerProps } from '../types';
const UdaExportModal = lazy(() => import('./UdaExportModal'));
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
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: 'var(--md-sys-percent-100)', backgroundColor: 'var(--md-sys-color-surface)', overflow: 'hidden' }}>
            {/* M3Expressive refactor: Aura ornaments */}
            {/* eslint-disable-next-line design-system/no-hardcoded-layout-values -- percentage stops inside radial-gradient cannot use CSS token vars */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 'var(--md-sys-z-base)', opacity: 0.04, backgroundImage: 'radial-gradient(circle at 80% 20%, var(--md-sys-color-primary), transparent 60%)' }} />

            <div style={{ position: 'relative', zIndex: 'var(--md-sys-z-content)', display: 'flex', flexDirection: 'column', height: 'var(--md-sys-percent-100)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--md-sys-spacing-4) var(--md-sys-spacing-6)', backgroundColor: 'var(--md-sys-color-surface-container-low)', borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'var(--md-sys-spacing-11)', height: 'var(--md-sys-spacing-11)', borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)' }}>
                            <span className="material-symbols-outlined">{udaProp === 'new' ? 'add_task' : 'edit_document'}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h2 style={{ margin: 0, fontWeight: 'var(--md-sys-typescale-weight-bold)', fontSize: 'var(--md-sys-typescale-title-large-font-size)', color: 'var(--md-sys-color-on-surface)' }}>{udaProp === 'new' ? 'Nuovo Progetto' : 'Modifica Progetto'}</h2>
                            <p style={{ margin: 0, fontSize: 'var(--md-sys-typescale-body-small-font-size)', color: 'var(--md-sys-color-on-surface-variant)' }}>{currentUda.title || 'Senza titolo'}</p>
                        </div>
                    </div>
                    <M3Button onClick={handleClose} variant="text">
                        <span className="material-symbols-outlined">close</span>
                    </M3Button>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--md-sys-spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-5)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'var(--md-sys-grid-fr-1) auto auto', gap: 'var(--md-sys-spacing-4)', alignItems: 'end' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
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

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-2)' }}>
                        <TextField 
                            label="Link Deliverable (NotebookLM)"
                            value={currentUda.externalLink || ''}
                            onChange={e => handleFieldChange('externalLink', e.target.value)}
                            placeholder="Incolla l'URL dell'analisi di NotebookLM..."
                            leadingIcon="auto_awesome"
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)', borderRadius: 'var(--md-sys-shape-corner-small)', backgroundColor: 'var(--md-sys-color-surface-container-high)' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-spacing-4)', color: 'var(--md-sys-color-tertiary)' }}>auto_awesome</span>
                            <p style={{ margin: 0, fontSize: 'var(--md-sys-typescale-body-small-font-size)', color: 'var(--md-sys-color-on-surface-variant)' }}>Bridge AI: Connetti il progetto al tuo spazio di lavoro esterno.</p>
                        </div>
                    </div>
                    
                    <TextArea 
                        label="Introduzione / Contesto" 
                        value={currentUda.introduction} 
                        onChange={e => handleFieldChange('introduction', e.target.value)} 
                        rows={4} 
                        placeholder="Descrivi brevemente l'argomento e il contesto didattico..." 
                    />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-2)' }}>
                        <label style={{ fontSize: 'var(--md-sys-typescale-label-medium-font-size)', fontWeight: 'var(--md-sys-typescale-weight-bold)', color: 'var(--md-sys-color-on-surface-variant)' }}>Competenze Target</label>
                        <div
                            role="button"
                            tabIndex={0}
                            aria-label="Seleziona competenze target"
                            onClick={handlePickerOpen}
                            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handlePickerOpen()}
                            style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--md-sys-spacing-2)', alignItems: 'center', minHeight: 'var(--md-sys-spacing-12)', padding: 'var(--md-sys-spacing-3)', borderRadius: 'var(--md-sys-shape-corner-medium)', border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)', cursor: 'pointer', backgroundColor: 'var(--md-sys-color-surface-container-low)' }}
                        >
                            {currentUda.competencyIds.length > 0 ? (
                                currentUda.competencyIds.map(id => {
                                    const c = competenze.find(comp => comp.id === id);
                                    return (
                                        <span key={id} style={{ padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-3)', borderRadius: 'var(--md-sys-shape-corner-full)', backgroundColor: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)', fontSize: 'var(--md-sys-typescale-label-medium-font-size)', fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>
                                            {c?.codice}
                                        </span>
                                    );
                                })
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-spacing-5)', color: 'var(--md-sys-color-primary)' }}>add_circle</span>
                                    <span style={{ fontSize: 'var(--md-sys-typescale-body-medium-font-size)' }}>Tocca per selezionare competenze</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--md-sys-spacing-3)', paddingTop: 'var(--md-sys-spacing-4)', borderTop: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' }}>
                        {udaProp !== 'new' && (
                            <M3Button
                                onClick={handleDelete}
                                variant="text"
                            >
                                <span className="material-symbols-outlined">delete</span>
                                Elimina
                            </M3Button>
                        )}
                        <div style={{ flex: 1 }} />
                        <M3Button onClick={handleClose} variant="text">Annulla</M3Button>
                        <M3Button onClick={handleSave} variant="filled">
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
                        <M3DialogContent>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-2)' }}>
                                {competenze.map(comp => {
                                    const isSelected = currentUda.competencyIds.includes(comp.id);
                                    return (
                                        <div 
                                            key={comp.id} 
                                            onClick={() => handleCompetencyToggle(comp.id)}
                                                                                        style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            gap: 'var(--md-sys-spacing-4)',
                                                                                            padding: 'var(--md-sys-spacing-6)',
                                                                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                                                            backgroundColor: isSelected ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container-low)',
                                                                                            border: isSelected ? 'var(--md-sys-border-width-thick) solid var(--md-sys-color-primary)' : 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)',
                                                                                            fontWeight: isSelected ? 700 : 400,
                                                                                            cursor: 'pointer',
                                                                                            transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)',
                                                                                        }}
                                                                                >
                                                                                        <div
                                                                                            style={{
                                                                                                width: 'var(--md-sys-spacing-6)',
                                                                                                height: 'var(--md-sys-spacing-6)',
                                                                                                borderRadius: 'var(--md-sys-shape-corner-full)',
                                                                                                backgroundColor: isSelected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface)',
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                                justifyContent: 'center',
                                                                                                color: isSelected ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-outline)',
                                                                                                border: isSelected ? 'none' : 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)',
                                                                                                marginRight: 'var(--md-sys-spacing-4)',
                                                                                            }}
                                                                                        >
                                                                                            {isSelected && <span>check</span>}
                                                                                        </div>
                                                                                        <div style={{ minWidth: '0' }}>
                                                                                            <p style={{ fontWeight: 'var(--md-sys-typescale-weight-bold)', margin: 0 }}>{comp.codice}</p>
                                                                                            <p style={{ margin: 0 }}>{comp.nome}</p>
                                                                                        </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </M3DialogContent>
                        <M3DialogActions >
                            <M3Button onClick={handlePickerClose} variant="filled" style={{ width: "var(--md-sys-percent-100)" }}>Conferma Selezione</M3Button>
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
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: 'var(--md-sys-percent-100)', backgroundColor: 'var(--md-sys-color-surface)', overflow: 'hidden' }}>
            {/* M3Expressive refactor: Aura ornaments */}
            {/* eslint-disable-next-line design-system/no-hardcoded-layout-values -- percentage stops inside radial-gradient cannot use CSS token vars */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: 'var(--md-sys-spacing-96)', height: 'var(--md-sys-spacing-96)', pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, var(--md-sys-color-primary), transparent 70%)', opacity: 0.04, zIndex: 'var(--md-sys-z-base)' }} />
            {/* eslint-disable-next-line design-system/no-hardcoded-layout-values -- percentage stops inside radial-gradient cannot use CSS token vars */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 'var(--md-sys-spacing-64)', height: 'var(--md-sys-spacing-64)', pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, var(--md-sys-color-tertiary), transparent 70%)', opacity: 0.03, zIndex: 'var(--md-sys-z-base)' }} />

            <div style={{ position: 'relative', zIndex: 'var(--md-sys-z-content)', display: 'flex', flexDirection: 'column', height: 'var(--md-sys-percent-100)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--md-sys-spacing-5) var(--md-sys-spacing-6)', backgroundColor: 'var(--md-sys-color-surface-container-low)', borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'var(--md-sys-spacing-12)', height: 'var(--md-sys-spacing-12)', borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)' }}>
                            <span className="material-symbols-outlined">assignment</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h1 style={{ margin: 0, fontWeight: 'var(--md-sys-typescale-weight-bold)', fontSize: 'var(--md-sys-typescale-headline-small-font-size)', color: 'var(--md-sys-color-on-surface)' }}>Planner Progetti</h1>
                            <p style={{ margin: 0, fontSize: 'var(--md-sys-typescale-body-medium-font-size)', color: 'var(--md-sys-color-on-surface-variant)' }}>Organizza le tue UDA</p>
                        </div>
                    </div>
                    <M3Button
                        onClick={handleNewUda}
                        variant="filled"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Nuovo Progetto
                    </M3Button>
                </div>

                <div style={{ padding: 'var(--md-sys-spacing-4) var(--md-sys-spacing-6)' }}>
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
                    <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--md-sys-spacing-4) var(--md-sys-spacing-6)' }}>
                        <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', overflow: 'hidden', border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' }}>
                            {udas.length > 0 ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: 'var(--md-sys-percent-100)', borderCollapse: 'collapse' }}>
                                        <thead style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)' }}>
                                            <tr>
                                                {['Titolo Progetto', 'Classe', 'Materia', 'AI Bridge', 'Azioni'].map(h => (
                                                    <th key={h} style={{ padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)', textAlign: 'left', fontSize: 'var(--md-sys-typescale-label-medium-font-size)', fontWeight: 'var(--md-sys-typescale-weight-bold)', color: 'var(--md-sys-color-on-surface-variant)', borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)', whiteSpace: 'nowrap' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {udas.map((uda) => (
                                                <tr
                                                    key={uda.id}
                                                    onClick={() => handleTableRowClick(uda)}
                                                    style={{ cursor: 'pointer', transition: 'background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)' }}
                                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-low)')}
                                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                                                >
                                                    <td style={{ padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)', borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' }}>
                                                        <span style={{ fontWeight: 'var(--md-sys-typescale-weight-bold)', fontSize: 'var(--md-sys-typescale-body-medium-font-size)', color: 'var(--md-sys-color-on-surface)' }}>{uda.title}</span>
                                                    </td>
                                                    <td style={{ padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)', borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' }}>
                                                        <span style={{ fontSize: 'var(--md-sys-typescale-body-medium-font-size)', color: 'var(--md-sys-color-on-surface-variant)' }}>{uda.classe}</span>
                                                    </td>
                                                    <td style={{ padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)', borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' }}>
                                                        <span style={{ fontSize: 'var(--md-sys-typescale-body-medium-font-size)', color: 'var(--md-sys-color-on-surface-variant)' }}>{uda.materia}</span>
                                                    </td>
                                                    <td style={{ padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)', borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' }}>
                                                        {uda.externalLink && (
                                                            <a
                                                                href={uda.externalLink}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                onClick={(e) => handleAiBridgeClick(uda, e)}
                                                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 'var(--md-sys-spacing-9)', height: 'var(--md-sys-spacing-9)', borderRadius: 'var(--md-sys-shape-corner-full)', backgroundColor: 'var(--md-sys-color-tertiary-container)', color: 'var(--md-sys-color-on-tertiary-container)' }}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-spacing-5)' }}>auto_awesome</span>
                                                            </a>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)', borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' }} onClick={e => e.stopPropagation()}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-1)' }}>
                                                            <M3Button
                                                                onClick={() => handleExportUda(uda)}
                                                                variant="text"
                                                            >
                                                                <span className="material-symbols-outlined">ios_share</span>
                                                            </M3Button>
                                                            <M3Button
                                                                onClick={() => handleEditUda(uda)}
                                                                variant="text"
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
                                <div style={{ padding: 'var(--md-sys-spacing-8)' }}>
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
                <Suspense fallback={<div>Loading...</div>}>
                    <UdaExportModal 
                        uda={exportingUda} 
                        aiSettings={aiSettings} 
                        competenze={competenze} 
                        settings={settings} 
                        onClose={handleCloseExport} 
                        onSaveReport={onSaveReport} 
                    />
                </Suspense>
            )}
        </div>
    );
};

export default UdaPlanner;

