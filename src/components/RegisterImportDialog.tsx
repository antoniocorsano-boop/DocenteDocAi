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
            <M3DialogContent className="space-y-6">
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
                            
                            <div className="p-8 rounded-[var(--md-sys-shape-corner-medium)] bg-secondary-container/30 border border-secondary/20 flex gap-6">
                                <span className="material-symbols-outlined text-secondary">info</span>
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
                            <div className="text-center">
                                <p className="m3-title-medium font-bold">
                                    {isLoading ? 'Analisi in corso...' : 'Trascina qui il file o clicca per selezionarlo'}
                                </p>
                                <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Supporta .csv, .xlsx, .xls</p>
                            </div>
                        </div>

                        {error && (
                            <div className="p-8 rounded-[var(--md-sys-shape-corner-medium)] bg-error-container text-on-error-container flex items-center gap-6">
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>error</span>
                                <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">{error}</p>
                            </div>
                        )}
                    </>
                )}

                {step === 'mapping' && rawData && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <SectionHeader 
                            title="Mappatura Colonne" 
                            subtitle="Associa le colonne del tuo file ai campi di DocenteDoc AI"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoCard title="Dati Studente" icon="person">
                                <div className="space-y-4 p-8">
                                    <div>
                                        <label className="block text-xs font-bold mb-4">Cognome *</label>
                                        <select 
                                            value={mapping.cognome}
                                            onChange={(e) => setMapping(prev => ({ ...prev, cognome: e.target.value }))}
                                            className="w-full p-8 rounded-[var(--md-sys-shape-corner-small)] border border-[var(--md-sys-color-outline)] bg-surface text-sm"
                                        >
                                            <option value="">Seleziona colonna...</option>
                                            {rawData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-4">Nome *</label>
                                        <select 
                                            value={mapping.nome}
                                            onChange={(e) => setMapping(prev => ({ ...prev, nome: e.target.value }))}
                                            className="w-full p-8 rounded-[var(--md-sys-shape-corner-small)] border border-[var(--md-sys-color-outline)] bg-surface text-sm"
                                        >
                                            <option value="">Seleziona colonna...</option>
                                            {rawData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-4">Classe</label>
                                        <select 
                                            value={mapping.classe}
                                            onChange={(e) => setMapping(prev => ({ ...prev, classe: e.target.value }))}
                                            className="w-full p-8 rounded-[var(--md-sys-shape-corner-small)] border border-[var(--md-sys-color-outline)] bg-surface text-sm"
                                        >
                                            <option value="">Seleziona colonna...</option>
                                            {rawData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </InfoCard>

                            <InfoCard title="Dati Valutazioni (Opzionale)" icon="grade" variant="secondary">
                                <div className="space-y-4 p-8">
                                    <div>
                                        <label className="block text-xs font-bold mb-4">Voto</label>
                                        <select 
                                            value={mapping.voto}
                                            onChange={(e) => setMapping(prev => ({ ...prev, voto: e.target.value }))}
                                            className="w-full p-8 rounded-[var(--md-sys-shape-corner-small)] border border-[var(--md-sys-color-outline)] bg-surface text-sm"
                                        >
                                            <option value="">Seleziona colonna...</option>
                                            {rawData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-4">Data</label>
                                        <select 
                                            value={mapping.data}
                                            onChange={(e) => setMapping(prev => ({ ...prev, data: e.target.value }))}
                                            className="w-full p-8 rounded-[var(--md-sys-shape-corner-small)] border border-[var(--md-sys-color-outline)] bg-surface text-sm"
                                        >
                                            <option value="">Seleziona colonna...</option>
                                            {rawData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-4">Materia</label>
                                        <select 
                                            value={mapping.materia}
                                            onChange={(e) => setMapping(prev => ({ ...prev, materia: e.target.value }))}
                                            className="w-full p-8 rounded-[var(--md-sys-shape-corner-small)] border border-[var(--md-sys-color-outline)] bg-surface text-sm"
                                        >
                                            <option value="">Seleziona colonna...</option>
                                            {rawData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </InfoCard>
                        </div>

                        <div className="p-8 rounded-[var(--md-sys-shape-corner-medium)] bg-[var(--md-sys-color-surface-container-high)] overflow-x-auto">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-8">Anteprima Dati Raw (Prime 3 righe)</p>
                            <table className="w-full text-[10px] border-collapse">
                                <thead>
                                    <tr>
                                        {rawData.headers.map(h => <th key={h} className="border border-[var(--md-sys-color-outline)]/30 p-1 text-left bg-surface">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rawData.data.slice(0, 3).map((row, i) => (
                                        <tr key={i}>
                                            {rawData.headers.map(h => <td key={h} className="border border-[var(--md-sys-color-outline)]/30 p-1">{String(row[h] || '')}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {step === 'preview' && result && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-6 text-primary">
                            <span className="material-symbols-outlined text-3xl">check_circle</span>
                            <h3 className="m3-title-large font-black">Dati pronti per l&apos;importazione</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <InfoCard title="Riepilogo" icon="analytics">
                                <ul className="space-y-2">
                                    <li className="flex justify-between text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">
                                        <span>Studenti:</span>
                                        <span className="font-bold">{result.students.length}</span>
                                    </li>
                                    <li className="flex justify-between text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">
                                        <span>Valutazioni:</span>
                                        <span className="font-bold">{result.evaluations.length}</span>
                                    </li>
                                </ul>
                            </InfoCard>

                            <InfoCard title="Classi rilevate" icon="class" variant="secondary">
                                <div className="flex flex-wrap gap-8">
                                    {Array.from(new Set(result.students.map(s => s.classe))).map(c => (
                                        <span key={c} className="px-4 py-1 rounded-md bg-secondary-container text-on-secondary-container m3-label-small font-bold">
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            </InfoCard>
                        </div>

                        <M3Button 
                            variant="text" 
                            onClick={() => setStep('mapping')}
                            className="w-full !py-1 text-xs"
                        >
                            <span className="material-symbols-outlined mr-2 text-sm">settings_backup_restore</span>
                            Modifica Mappatura Manuale
                        </M3Button>

                        {result.errors.length > 0 && (
                            <div className="p-8 rounded-[var(--md-sys-shape-corner-medium)] bg-warning-container text-on-warning-container">
                                <p className="m3-label-medium font-bold mb-8">Avvisi durante l&apos;analisi:</p>
                                <ul className="list-disc list-inside m3-body-small opacity-80">
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


