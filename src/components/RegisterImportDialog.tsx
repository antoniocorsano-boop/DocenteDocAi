import React, { useState, useCallback } from 'react';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, SectionHeader } from './ui';
import { ImportService, ImportResult } from '../services/importService';
import { RegisterService, RegisterProvider } from '../services/registerService';
import { useFileDrop } from '../hooks/useFileDrop';
import { useUIStore } from '../stores/useUIStore';
import { SelectField } from './ui';

interface RegisterImportDialogProps {
    onClose: () => void;
    onImport: (result: ImportResult) => void;
}

type ImportStep = 'upload' | 'mapping' | 'preview';

const RegisterImportDialog: React.FC<RegisterImportDialogProps> = ({ onClose, onImport }) => {
    const [step, setStep] = useState<ImportStep>('upload');
    const [provider, setProvider] = useState<RegisterProvider>('generic');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ImportResult | null>(null);
    const [rawData, setRawData] = useState<{ headers: string[], data: Record<string, unknown>[] } | null>(null);
    const [mapping, setMapping] = useState<Record<string, string>>({
        cognome: '',
        nome: '',
        classe: '',
        voto: '',
        data: '',
        materia: '',
        argomento: ''
    });

    const { showToast } = useUIStore(state => ({ showToast: state.actions.showToast }));

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setIsLoading(true);
        setError(null);
        const file = acceptedFiles[0];

        try {
            // Prima proviamo l'importazione automatica (euristica)
            const importResult = await ImportService.parseFile(file);
            
            // Se non trova nulla o vogliamo forzare il mapping manuale
            const raw = await ImportService.getRawData(file);
            setRawData(raw);

            if (importResult.students.length > 0) {
                setResult(importResult);
                setStep('preview');
            } else if (raw.headers.length > 0) {
                // Se l'euristica fallisce ma abbiamo dati, passiamo al mapping manuale
                setStep('mapping');
                // Tentativo di pre-mapping basato sui nomi delle colonne
                const newMapping = { ...mapping };
                raw.headers.forEach(h => {
                    const lower = h.toLowerCase();
                    if (lower.includes('cognome')) newMapping.cognome = h;
                    if (lower.includes('nome')) newMapping.nome = h;
                    if (lower.includes('classe')) newMapping.classe = h;
                    if (lower.includes('voto') || lower.includes('valutazione')) newMapping.voto = h;
                    if (lower.includes('data')) newMapping.data = h;
                    if (lower.includes('materia')) newMapping.materia = h;
                });
                setMapping(newMapping);
            } else {
                setError("Nessun dato trovato nel file. Assicurati che il formato sia corretto.");
            }
        } catch (err) {
            setError("Errore durante l'importazione del file.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [mapping]);

    const { getRootProps, getInputProps, isDragActive } = useFileDrop({
        onDrop,
        accept: 'text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
        multiple: false,
        disabled: isLoading
    });

    const handleApplyMapping = () => {
        if (!rawData) return;
        
        if (!mapping.cognome || !mapping.nome) {
            showToast("Mappa almeno Cognome e Nome per procedere", "error");
            return;
        }

        const mappedResult = ImportService.mapRawData(rawData.data, mapping);
        setResult(mappedResult);
        setStep('preview');
    };

    const handleConfirm = () => {
        if (result) {
            onImport(result);
            onClose();
        }
    };

    return (
        <M3Dialog
            title="Sincronizza Registro Elettronico"
            onClose={onClose}
            maxWidth={step === 'mapping' ? 'lg' : 'md'}
        >
            <M3DialogContent style={{ gap: "var(--md-sys-spacing-6)" }}>
                {step === 'upload' && (
                    <>
                        <div style={{
  marginTop: 'var(--md-sys-spacing-4)'
}}>
                            <SelectField
                                label="Seleziona il tuo Registro Elettronico"
                                value={provider}
                                onChange={(e) => setProvider(e.target.value as RegisterProvider)}
                            >
                                <option value="generic">Altro / Generico</option>
                                <option value="argo">Argo (DidUP)</option>
                                <option value="spaggiari">ClasseViva (Spaggiari)</option>
                                <option value="axios">Axios</option>
                                <option value="sidi">SIDI (Anagrafe Studenti)</option>
                            </SelectField>
                            
                            <div className="rounded-[var(--md-sys-shape-corner-medium)] bg-secondary-container/30 border-secondary/20" style={{ padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)", display: "flex", gap: "var(--md-sys-spacing-6)" }}>
                                <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-secondary)" }}>info</span>
                                <p className="m3-body-small text-on-secondary-container">
                                    {RegisterService.getExportGuidance(provider)}
                                </p>
                            </div>

                            <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant">
                                Carica il file esportato in formato <strong>CSV</strong> o <strong>Excel</strong>.
                            </p>
                        </div>

                        <div 
                            {...getRootProps()} 
                            className={`
                                border-2 border-dashed rounded-[var(--md-sys-shape-corner-large)] p-12 flex flex-col items-center justify-center gap-8 transition-all
                                ${isDragActive ? 'border-primary bg-primary/5 scale-[0.98]' : 'border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)] hover:bg-[var(--md-sys-color-surface-container-high)]'}
                                ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                            `}
                        >
                            <input {...getInputProps()} />
                            <span className={`material-symbols-outlined text-5xl ${isDragActive ? 'text-primary' : 'text-[var(--md-sys-color-on-surface)]-variant'}`}>
                                {isLoading ? 'sync' : 'upload_file'}
                            </span>
                            <div style={{ textAlign: "center" }}>
                                <p className="m3-title-medium" style={{ fontWeight: "bold" }}>
                                    {isLoading ? 'Analisi in corso...' : 'Trascina qui il file o clicca per selezionarlo'}
                                </p>
                                <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Supporta .csv, .xlsx, .xls</p>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-[var(--md-sys-shape-corner-medium)] text-on-error-container" style={{ padding: "var(--md-sys-spacing-8)", backgroundColor: "var(--md-sys-color-error-container)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)" }}>
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>error</span>
                                <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">{error}</p>
                            </div>
                        )}
                    </>
                )}

                {step === 'mapping' && rawData && (
                    <div className="animate-in fade-in slide-in-from-bottom-4" style={{ gap: "var(--md-sys-spacing-6)" }}>
                        <SectionHeader 
                            title="Mappatura Colonne" 
                            subtitle="Associa le colonne del tuo file ai campi di DocenteDoc AI"
                        />

                        <div className="md:grid-cols-2" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-6)" }}>
                            <InfoCard title="Dati Studente" icon="person">
                                <div style={{ gap: "var(--md-sys-spacing-4)", padding: "var(--md-sys-spacing-8)" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "var(--md-sys-spacing-4)" }}>Cognome *</label>
                                        <select 
                                            value={mapping.cognome}
                                            onChange={(e) => setMapping(prev => ({ ...prev, cognome: e.target.value }))}
                                            className="rounded-[var(--md-sys-shape-corner-small)] border-[var(--md-sys-color-outline)]" style={{ width: "100%", padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)", backgroundColor: "var(--md-sys-color-surface)", fontSize: "0.875rem" }}
                                        >
                                            <option value="">Seleziona colonna...</option>
                                            {rawData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "var(--md-sys-spacing-4)" }}>Nome *</label>
                                        <select 
                                            value={mapping.nome}
                                            onChange={(e) => setMapping(prev => ({ ...prev, nome: e.target.value }))}
                                            className="rounded-[var(--md-sys-shape-corner-small)] border-[var(--md-sys-color-outline)]" style={{ width: "100%", padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)", backgroundColor: "var(--md-sys-color-surface)", fontSize: "0.875rem" }}
                                        >
                                            <option value="">Seleziona colonna...</option>
                                            {rawData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "var(--md-sys-spacing-4)" }}>Classe</label>
                                        <select 
                                            value={mapping.classe}
                                            onChange={(e) => setMapping(prev => ({ ...prev, classe: e.target.value }))}
                                            className="rounded-[var(--md-sys-shape-corner-small)] border-[var(--md-sys-color-outline)]" style={{ width: "100%", padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)", backgroundColor: "var(--md-sys-color-surface)", fontSize: "0.875rem" }}
                                        >
                                            <option value="">Seleziona colonna...</option>
                                            {rawData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </InfoCard>

                            <InfoCard title="Dati Valutazioni (Opzionale)" icon="grade" variant="secondary">
                                <div style={{ gap: "var(--md-sys-spacing-4)", padding: "var(--md-sys-spacing-8)" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "var(--md-sys-spacing-4)" }}>Voto</label>
                                        <select 
                                            value={mapping.voto}
                                            onChange={(e) => setMapping(prev => ({ ...prev, voto: e.target.value }))}
                                            className="rounded-[var(--md-sys-shape-corner-small)] border-[var(--md-sys-color-outline)]" style={{ width: "100%", padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)", backgroundColor: "var(--md-sys-color-surface)", fontSize: "0.875rem" }}
                                        >
                                            <option value="">Seleziona colonna...</option>
                                            {rawData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "var(--md-sys-spacing-4)" }}>Data</label>
                                        <select 
                                            value={mapping.data}
                                            onChange={(e) => setMapping(prev => ({ ...prev, data: e.target.value }))}
                                            className="rounded-[var(--md-sys-shape-corner-small)] border-[var(--md-sys-color-outline)]" style={{ width: "100%", padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)", backgroundColor: "var(--md-sys-color-surface)", fontSize: "0.875rem" }}
                                        >
                                            <option value="">Seleziona colonna...</option>
                                            {rawData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "var(--md-sys-spacing-4)" }}>Materia</label>
                                        <select 
                                            value={mapping.materia}
                                            onChange={(e) => setMapping(prev => ({ ...prev, materia: e.target.value }))}
                                            className="rounded-[var(--md-sys-shape-corner-small)] border-[var(--md-sys-color-outline)]" style={{ width: "100%", padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)", backgroundColor: "var(--md-sys-color-surface)", fontSize: "0.875rem" }}
                                        >
                                            <option value="">Seleziona colonna...</option>
                                            {rawData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </InfoCard>
                        </div>

                        <div className="rounded-[var(--md-sys-shape-corner-medium)] bg-[var(--md-sys-color-surface-container-high)]" style={{ padding: "var(--md-sys-spacing-8)", overflowX: "auto" }}>
                            <p className="text-[10px]" style={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.5", marginBottom: "var(--md-sys-spacing-8)" }}>Anteprima Dati Raw (Prime 3 righe)</p>
                            <table className="text-[10px] border-collapse" style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        {rawData.headers.map(h => <th key={h} className="border-[var(--md-sys-color-outline)]/30" style={{ border: "1px solid var(--md-sys-color-outline)", padding: "var(--md-sys-spacing-1)", textAlign: "left", backgroundColor: "var(--md-sys-color-surface)" }}>{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rawData.data.slice(0, 3).map((row, i) => (
                                        <tr key={i}>
                                            {rawData.headers.map(h => <td key={h} className="border-[var(--md-sys-color-outline)]/30" style={{ border: "1px solid var(--md-sys-color-outline)", padding: "var(--md-sys-spacing-1)" }}>{String(row[h] || '')}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {step === 'preview' && result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4" style={{ gap: "var(--md-sys-spacing-4)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)", color: "var(--md-sys-color-primary)" }}>
                            <span className="material-symbols-outlined text-3xl">check_circle</span>
                            <h3 className="m3-title-large" style={{ fontWeight: "900" }}>Dati pronti per l&apos;importazione</h3>
                        </div>

                        <div className="sm:grid-cols-2" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-8)" }}>
                            <InfoCard title="Riepilogo" icon="analytics">
                                <ul style={{ gap: "var(--md-sys-spacing-2)" }}>
                                    <li className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]" style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span>Studenti:</span>
                                        <span style={{ fontWeight: "bold" }}>{result.students.length}</span>
                                    </li>
                                    <li className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]" style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span>Valutazioni:</span>
                                        <span style={{ fontWeight: "bold" }}>{result.evaluations.length}</span>
                                    </li>
                                </ul>
                            </InfoCard>

                            <InfoCard title="Classi rilevate" icon="class" variant="secondary">
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--md-sys-spacing-8)" }}>
                                    {Array.from(new Set(result.students.map(s => s.classe))).map(c => (
                                        <span key={c} className="py-1 text-on-secondary-container m3-label-small" style={{ paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderRadius: "0.375rem", backgroundColor: "var(--md-sys-color-secondary-container)", fontWeight: "bold" }}>
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            </InfoCard>
                        </div>

                        <M3Button 
                            variant="text" 
                            onClick={() => setStep('mapping')}
                            className="!py-1" style={{ width: "100%", fontSize: "0.75rem" }}
                        >
                            <span className="material-symbols-outlined" style={{ marginRight: "0.5rem", fontSize: "0.875rem" }}>settings_backup_restore</span>
                            Modifica Mappatura Manuale
                        </M3Button>

                        {result.errors.length > 0 && (
                            <div className="rounded-[var(--md-sys-shape-corner-medium)] bg-warning-container text-on-warning-container" style={{ padding: "var(--md-sys-spacing-8)" }}>
                                <p className="m3-label-medium" style={{ fontWeight: "bold", marginBottom: "var(--md-sys-spacing-8)" }}>Avvisi durante l&apos;analisi:</p>
                                <ul className="list-disc list-inside m3-body-small" style={{ opacity: "0.8" }}>
                                    {result.errors.slice(0, 3).map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </M3DialogContent>
            <M3DialogActions>
                <M3Button variant="text" onClick={onClose}>Annulla</M3Button>
                {step === 'mapping' && (
                    <M3Button variant="filled" onClick={handleApplyMapping}>Applica Mappatura</M3Button>
                )}
                {step === 'preview' && result && (
                    <M3Button variant="filled" onClick={handleConfirm}>Conferma Importazione</M3Button>
                )}
            </M3DialogActions>
        </M3Dialog>
    );
};

export default RegisterImportDialog;


