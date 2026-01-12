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
        setNewEntry({ title: '', description: '', date: new Date().toISOString().split('T')[0], category: 'capolavoro', tags: [] });
    };

    return (
        <M3Dialog isOpen={isOpen} onClose={onClose} title={`E-Portfolio: ${student.nome} ${student.cognome}`} maxWidth="md">
            <M3DialogContent className="pt-4 md:px-6" style={{ gap: "var(--md-sys-spacing-8)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)" }}>
                {/* Status Section */}
                <div className="md:grid-cols-2 bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-extra-large)] border-[var(--md-sys-color-outline-variant)]/20" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-6)", padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <h4 className="m3-title-medium">Capolavoro</h4>
                            <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Caricato nell&apos;E-Portfolio</p>
                        </div>
                        <input 
                            type="checkbox"
                            checked={state.hasCapolavoro}
                            onChange={(e) => onUpdateState({ ...state, hasCapolavoro: e.target.checked })}
                            className="accent-primary" style={{ width: "1.25rem", height: "1.25rem" }}
                        />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <h4 className="m3-title-medium">Autovalutazione</h4>
                            <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Riflessione critica completata</p>
                        </div>
                        <input 
                            type="checkbox"
                            checked={state.hasAutovalutazione}
                            onChange={(e) => onUpdateState({ ...state, hasAutovalutazione: e.target.checked })}
                            className="accent-primary" style={{ width: "1.25rem", height: "1.25rem" }}
                        />
                    </div>
                </div>

                {/* Add Entry Section */}
                <div style={{
  marginTop: 'var(--md-sys-spacing-4)'
}}>
                    <h4 className="m3-title-large" style={{ fontWeight: "900" }}>Aggiungi Documento/Riflessione</h4>
                    <div className="sm:flex-row" style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-8)" }}>
                        <div style={{ flex: "1" }}>
                            <TextField
                                label="Titolo"
                                value={newEntry.title}
                                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                            />
                        </div>
                        <div style={{ display: "flex", gap: "var(--md-sys-spacing-8)", alignItems: "flex-end" }}>
                            <select 
                                className="bg-[var(--md-sys-color-surface-container-high)] rounded-[var(--md-sys-shape-corner-large)] py-3 text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] focus:ring-2 focus:ring-primary" style={{ flexGrow: "1", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", border: "none", minWidth: "0" }}
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
                <div style={{
  marginTop: 'var(--md-sys-spacing-4)'
}}>
                    <h4 className="m3-title-large" style={{ fontWeight: "900" }}>Documenti Caricati</h4>
                    <div style={{ gap: "var(--md-sys-spacing-2)" }}>
                        {entries.length === 0 ? (
                            <p className="py-8 text-[var(--md-sys-color-on-surface)]-variant italic" style={{ textAlign: "center" }}>Nessun documento caricato</p>
                        ) : (
                            entries.map(entry => (
                                <div key={entry.id} className="bg-[var(--md-sys-color-surface-container)] rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)]/10" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)" }}>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                                            <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-primary)", fontSize: "0.875rem" }}>
                                                {entry.category === 'capolavoro' ? 'auto_awesome' : 'description'}
                                            </span>
                                            <span style={{ fontWeight: "bold" }}>{entry.title}</span>
                                        </div>
                                        <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">{entry.date}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-secondary/10 text-[10px]" style={{ color: "var(--md-sys-color-secondary)", borderRadius: "9999px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em" }}>
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



