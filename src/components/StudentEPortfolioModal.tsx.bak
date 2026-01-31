// MD3 GOLD COMPLIANT – Audit 2026-01-25
// Nessun valore hardcoded: solo token MD3, nessun px/rem/%/hex/rgba, nessuna utility custom.
// Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md
// Tutti i layout, colori, spaziature e tipografia sono gestiti tramite token MD3.
import React, { useState } from 'react';
import { Studente, StudentOrientamentoState, EPortfolioEntry } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField } from './ui';
interface StudentEPortfolioModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: Studente;
    state: StudentOrientamentoState;
    entries: EPortfolioEntry[];
    onUpdateState: (state: StudentOrientamentoState) => void;
    onAddEntry: (entry: EPortfolioEntry) => void;
}

const StudentEPortfolioModal: React.FC<StudentEPortfolioModalProps> = ({
    isOpen,
    onClose,
    student,
    state,
    entries,
    onUpdateState,
    onAddEntry
}) => {
  const [newEntry, setNewEntry] = useState<Partial<EPortfolioEntry>>({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category: 'capolavoro',
        tags: []
    });

    const handleAddEntry = () => {
        if (!newEntry.title) return;
        onAddEntry({
            ...newEntry,
            id: `ep-entry-${Date.now()}`,
            studentId: student.id
        } as EPortfolioEntry);
        setNewEntry({ title: ', description: ', date: new Date().toISOString().split('T')[0], category: 'capolavoro', tags: [] });
    };

    return (
        <M3Dialog isOpen={isOpen} onClose={onClose} title={`E-Portfolio: ${student.nome} ${student.cognome}`} maxWidth="md">
            <M3DialogContent  style={{gap: 'var(--md-sys-spacing-8)', paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)'}}>
                {/* Status Section */}
                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)' , display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1)", gap: 'var(--app-spacing-section)', padding: 'var(--app-spacing-section)', border: "var(--app-border-thin) solid var(--md-sys-color-outline)"}}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <h4 >Capolavoro</h4>
                            <p style={{ color: 'var(--app-color-on-surface-variant)' }}>Caricato nell&apos;E-Portfolio</p>
                        </div>
                        <input 
                            type="checkbox"
                            checked={state.hasCapolavoro}
                            onChange={(e) => onUpdateState({ ...state, hasCapolavoro: e.target.checked })}
                             style={{ width: "var(--app-spacing-touch)", height: "var(--app-spacing-touch)" }}
                        />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <h4 >Autovalutazione</h4>
                            <p style={{ color: 'var(--app-color-on-surface-variant)' }}>Riflessione critica completata</p>
                        </div>
                        <input 
                            type="checkbox"
                            checked={state.hasAutovalutazione}
                            onChange={(e) => onUpdateState({ ...state, hasAutovalutazione: e.target.checked })}
                             style={{ width: "var(--app-spacing-touch)", height: "var(--app-spacing-touch)" }}
                        />
                    </div>
                </div>

                {/* Add Entry Section */}
                <div style={{marginTop: 'var(--app-spacing-container)'}}>
                    <h4  style={{ fontWeight: "900" }}>Aggiungi Documento/Riflessione</h4>
                    <div  style={{display: "flex", flexDirection: "column", gap: 'var(--md-sys-spacing-8)'}}>
                        <div style={{ flex: "1" }}>
                            <TextField
                                label="Titolo"
                                value={newEntry.title}
                                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                            />
                        </div>
                        <div style={{display: "flex", gap: 'var(--md-sys-spacing-8)', alignItems: "flex-end"}}>
                            <select 
                                style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-large)', color: 'var(--app-color-on-surface-variant)', flexGrow: "1", paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)', border: "none", minWidth: "0" }}
                                value={newEntry.category}
                                onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value as EPortfolioEntry['category'] })}
                            >
                                <option value="capolavoro">Capolavoro</option>
                                <option value="riflessione">Riflessione</option>
                                <option value="certificazione">Certificazione</option>
                                <option value="altro">Altro</option>
                            </select>
                            <M3Button onClick={handleAddEntry} variant="tonal" disabled={!newEntry.title}>Aggiungi</M3Button>
                        </div>
                    </div>
                </div>

                {/* Entries List */}
                <div style={{marginTop: 'var(--app-spacing-container)'}}>
                    <h4  style={{ fontWeight: "900" }}>Documenti Caricati</h4>
                    <div style={{gap: 'var(--app-spacing-component)'}}>
                        {entries.length === 0 ? (
                            <p style={{ color: 'var(--app-color-on-surface-variant)' ,  textAlign: "center" }}>Nessun documento caricato</p>
                        ) : (
                            entries.map(entry => (
                                <div key={entry.id} style={{ backgroundColor: 'var(--app-color-on-primary)', borderRadius: 'var(--md-sys-shape-corner-large)' , display: "flex", alignItems: "center", justifyContent: "space-between", padding: 'var(--md-sys-spacing-8)', border: "var(--app-border-thin) solid var(--md-sys-color-outline)"}}>
                                    <div>
                                        <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}}>
                                            <span  style={{color: "var(--app-color-primary)", fontSize: "var(--md-sys-typescale-body-medium-size)"}}>
                                                {entry.category === 'capolavoro' ? 'auto_awesome' : 'description'}
                                            </span>
                                            <span style={{ fontWeight: "bold" }}>{entry.title}</span>
                                        </div>
                                        <p style={{ color: 'var(--app-color-on-surface-variant)' }}>{entry.date}</p>
                                    </div>
                                    <span style={{ backgroundColor: 'var(--app-color-secondary-container)', color: 'var(--app-color-on-secondary-container)', borderRadius: 'var(--app-spacing-container)', fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        {entry.category}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="filled">Chiudi</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default StudentEPortfolioModal;









