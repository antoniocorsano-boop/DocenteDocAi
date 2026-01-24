// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { Studente, StudentOrientamentoState, EPortfolioEntry } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField } from './ui';
import { useTheme } from '../theme/theme';

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
  const { layers } = useTheme();
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
            <M3DialogContent  style={{gap: layers.ref.spacing['8'], paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4']}}>
                {/* Status Section */}
                <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)], borderRadius: ref.shape[] }} style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['6'], padding: layers.ref.spacing['6'], border: "1px solid layers.sys.colors.outline"}}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <h4 >Capolavoro</h4>
                            <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>Caricato nell&apos;E-Portfolio</p>
                        </div>
                        <input 
                            type="checkbox"
                            checked={state.hasCapolavoro}
                            onChange={(e) => onUpdateState({ ...state, hasCapolavoro: e.target.checked })}
                             style={{ width: "1.25rem", height: "1.25rem" }}
                        />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <h4 >Autovalutazione</h4>
                            <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>Riflessione critica completata</p>
                        </div>
                        <input 
                            type="checkbox"
                            checked={state.hasAutovalutazione}
                            onChange={(e) => onUpdateState({ ...state, hasAutovalutazione: e.target.checked })}
                             style={{ width: "1.25rem", height: "1.25rem" }}
                        />
                    </div>
                </div>

                {/* Add Entry Section */}
                <div style={{marginTop: layers.ref.spacing['4']}}>
                    <h4  style={{ fontWeight: "900" }}>Aggiungi Documento/Riflessione</h4>
                    <div  style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['8']}}>
                        <div style={{ flex: "1" }}>
                            <TextField
                                label="Titolo"
                                value={newEntry.title}
                                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                            />
                        </div>
                        <div style={{display: "flex", gap: layers.ref.spacing['8'], alignItems: "flex-end"}}>
                            <select 
                                style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)], borderRadius: ref.shape[], color: sys.colors.[var(--md-sys-typescale-body-medium)] }} style={{flexGrow: "1", paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], border: "none", minWidth: "0"}}
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
                <div style={{marginTop: layers.ref.spacing['4']}}>
                    <h4  style={{ fontWeight: "900" }}>Documenti Caricati</h4>
                    <div style={{gap: layers.ref.spacing['2']}}>
                        {entries.length === 0 ? (
                            <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{ textAlign: "center" }}>Nessun documento caricato</p>
                        ) : (
                            entries.map(entry => (
                                <div key={entry.id} style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container)], borderRadius: ref.shape[] }} style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: layers.ref.spacing['8'], border: "1px solid layers.sys.colors.outline"}}>
                                    <div>
                                        <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                                            <span  style={{color: "layers.sys.colors.primary", fontSize: "0.875rem"}}>
                                                {entry.category === 'capolavoro' ? 'auto_awesome' : 'description'}
                                            </span>
                                            <span style={{ fontWeight: "bold" }}>{entry.title}</span>
                                        </div>
                                        <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>{entry.date}</p>
                                    </div>
                                    <span style={{ backgroundColor: sys.colors.secondary/10, color: sys.colors.[10px] }} style={{color: "layers.sys.colors.secondary", borderRadius: ref.spacing[9999], fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em"}}>
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




