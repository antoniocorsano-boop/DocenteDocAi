
import React, { useState, useCallback, useMemo } from 'react';
import { useFileDrop } from '../hooks/useFileDrop';
import { Studente, KnowledgeBaseEntry } from '../types';
import { ImportService } from '../services/importService';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TabGroup, SelectField, InfoCard } from './ui';

interface ImportStudentsModalProps {
    onClose: () => void;
    onImport: (newStudents: Studente[]) => void;
    userClasses: string[];
    knowledgeBase: KnowledgeBaseEntry[];
}

const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({ onClose, onImport, userClasses, knowledgeBase }) => {
    const [step, setStep] = useState<'upload' | 'mapping' | 'confirm'>('upload');
    const [importSource, setImportSource] = useState<'file' | 'kb'>('file');
    const [targetClass, setTargetClass] = useState<string>(userClasses[0] || 'AUTO');
    const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [columnMap, setColumnMap] = useState({ cognome: '', nome: '', classe: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [infoMessage, setInfoMessage] = useState('');

    const processRawData = useCallback((headers: string[], data: Record<string, string>[], name: string) => {
        setFileName(name);
        setError('');
        setInfoMessage('');

        if (headers.length === 0 || data.length === 0) {
            setError("Il file è vuoto o non ha una riga di intestazione valida.");
            setStep('upload');
            return;
        }

        setCsvHeaders(headers);
        setCsvData(data);

        let cognomeCol = '';
        let nomeCol = '';
        let classeCol = '';

        for (const header of headers) {
            const lowerHeader = header.toLowerCase();
            if (!cognomeCol && (lowerHeader.includes('cognome') || lowerHeader.includes('last name') || lowerHeader.includes('surname'))) {
                cognomeCol = header;
            }
            if (!nomeCol && (lowerHeader.includes('nome') || lowerHeader.includes('first name') || lowerHeader.includes('name'))) {
                nomeCol = header;
            }
            if (!classeCol && (lowerHeader.includes('classe') || lowerHeader.includes('class'))) {
                classeCol = header;
            }
        }
        setColumnMap({ cognome: cognomeCol, nome: nomeCol, classe: classeCol });
        setStep('mapping');
    }, []);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setIsLoading(true);
        setError('');
        setInfoMessage('');
        const file = acceptedFiles[0];

        try {
            const { headers, data, errors } = await ImportService.getRawData(file);
            
            if (errors.length > 0) {
                throw new Error(errors[0]);
            }

            processRawData(headers, data, file.name);

        } catch (err: unknown) {
            let message = 'Errore durante l\'analisi del file.';
            if (err instanceof Error) message = err.message;
            console.error(err);
            setError(message);
            setStep('upload');
        } finally {
            setIsLoading(false);
        }
    }, [processRawData]);

    const { getRootProps, getInputProps, isDragActive } = useFileDrop({
        onDrop,
        accept: 'text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
        multiple: false,
        disabled: isLoading
    });

    const handleKbFileSelect = (entry: KnowledgeBaseEntry) => {
        if (!entry.content) {
            setError("Il file selezionato non ha contenuto testuale leggibile.");
            return;
        }
        // For KB entries, we still use the old CSV parser for now as they are stored as text
        // In a real scenario, we might want to store the original file type in KB
        const lines = entry.content.split('\n').filter(l => l.trim());
        if (lines.length > 0) {
            const headers = lines[0].split(/[;,]/).map(h => h.trim());
            const data = lines.slice(1).map(line => {
                const values = line.split(/[;,]/).map(v => v.trim());
                const obj: Record<string, string> = {};
                headers.forEach((h, i) => obj[h] = values[i]);
                return obj;
            });
            processRawData(headers, data, entry.fileName);
        }
    };

    const studentsToImport = useMemo(() => {
        if (!columnMap.cognome || !columnMap.nome || csvData.length === 0) {
            return [];
        }

        if (targetClass === 'AUTO' && !columnMap.classe) {
            return [];
        }

        return csvData
            .map(row => {
                const extractedClass = targetClass === 'AUTO' ? (row[columnMap.classe] || '').trim() : targetClass;
                const normalizedClass = extractedClass.replace(/\s+/g, '').toUpperCase();

                return {
                    cognome: row[columnMap.cognome] || '',
                    nome: row[columnMap.nome] || '',
                    classe: normalizedClass,
                }
            })
            .filter(s => s.cognome.trim() && s.nome.trim() && s.classe);
    }, [csvData, columnMap, targetClass]);

    const handleImport = () => {
        const finalStudents: Studente[] = studentsToImport.map(s => ({
            ...s,
            id: `stud-${Date.now()}-${Math.random()}`
        }));
        onImport(finalStudents);
        onClose();
    };

    const renderContent = () => {
        switch (step) {
            case 'upload':
                return (
                    <div className="flex flex-col gap-6">
                        <div>
                            <SelectField
                                id="import-target-class"
                                label="Destinazione"
                                value={targetClass}
                                onChange={e => setTargetClass(e.target.value)}
                                required
                            >
                                <option value="AUTO">✨ Rileva automaticamente dal file (Multi-classe)</option>
                                <option disabled>──────────</option>
                                {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                            </SelectField>
                            {targetClass === 'AUTO' && <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant mt-4 px-4">Il file CSV deve contenere una colonna con il nome della classe (es. "1A", "2B").</p>}
                        </div>

                        <TabGroup
                            tabs={[{ id: 'file', label: 'Carica File' }, { id: 'kb', label: 'Da Knowledge Base' }]}
                            activeTab={importSource}
                            onChange={(id: string) => setImportSource(id as 'file' | 'kb')}
                            className="w-full"
                        />

                        {importSource === 'file' ? (
                            <div>
                                <InfoCard
                                    title="Formato Richiesto"
                                    description={`Il file deve essere un .CSV con una riga di intestazione (Cognome, Nome${targetClass === 'AUTO' ? ', Classe' : ''}).`}
                                    action={
                                        <a
                                            href={`data:text/csv;charset=utf-8,Cognome,Nome${targetClass === 'AUTO' ? ',Classe' : ''}%0ARossi,Mario${targetClass === 'AUTO' ? ',1A' : ''}%0ABianchi,Giulia${targetClass === 'AUTO' ? ',2B' : ''}`}
                                            download="modello_studenti.csv"
                                            className="button button-tonal !h-auto !py-4 !px-4 !text-xs"
                                        >
                                            <span className="material-symbols-outlined text-sm mr-2">download</span>
                                            Scarica Modello
                                        </a>
                                    }
                                    icon="description"
                                    variant="surface"
                                    className="!p-5 !rounded-[var(--md-sys-shape-corner-large)] mb-8"
                                />

                                <div
                                    {...getRootProps()}
                                    className={`relative flex flex-col items-center justify-center p-8 h-48 rounded-[var(--md-sys-shape-corner-large)] border-2 border-dashed transition-all cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''} ${isDragActive ? 'border-primary bg-primary-container/10' : 'border-[var(--md-sys-color-outline-variant)]/50 hover:border-primary/50 hover:bg-[var(--md-sys-color-surface-container-high)]'}`}
                                >
                                    <input {...getInputProps()} />
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-5xl text-primary mb-8">{isDragActive ? 'download' : 'upload_file'}</span>
                                            <h3 className="m3-title-medium font-bold text-[var(--md-sys-color-on-surface)] text-center">Trascina il file .csv o .xlsx qui</h3>
                                            <p className="m3-body-small opacity-60 mt-4 font-bold uppercase tracking-widest">o clicca per selezionare</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-8">
                                <p className="m3-label-small uppercase text-primary font-bold">Seleziona un file CSV dalla KB</p>
                                <div className="bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-medium)] max-h-[250px] overflow-y-auto p-8 border border-[var(--md-sys-color-outline-variant)]/30 flex flex-col gap-4">
                                    {knowledgeBase.length > 0 ? (
                                        knowledgeBase.map(entry => (
                                            <div
                                                key={entry.id}
                                                onClick={() => handleKbFileSelect(entry)}
                                                className="flex items-center gap-6 p-6 rounded-[var(--md-sys-shape-corner-medium)] hover:bg-[var(--md-sys-color-surface-container-high)] transition-all cursor-pointer group"
                                            >
                                                <span className="material-symbols-outlined text-primary bg-primary-container/30 p-8 rounded-[var(--md-sys-shape-corner-small)] group-hover:bg-primary group-hover:text-on-primary transition-colors">description</span>
                                                <span className="text-sm font-bold truncate flex-grow text-[var(--md-sys-color-on-surface)]">{entry.fileName}</span>
                                                <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface)]-variant opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">chevron_right</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center flex flex-col items-center gap-8 opacity-60">
                                            <span className="material-symbols-outlined text-3xl">folder_off</span>
                                            <p className="text-sm">Nessun file nella Knowledge Base.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-start gap-6 p-8 bg-error-container text-on-error-container rounded-[var(--md-sys-shape-corner-medium)]">
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>error</span>
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {infoMessage && (
                            <div className="p-5 bg-tertiary-container text-on-tertiary-container rounded-[var(--md-sys-shape-corner-large)]">
                                <div className="flex items-center gap-8 mb-8">
                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>lightbulb</span>
                                    <h3 className="m3-title-small font-bold">Suggerimento AI: XLSX to CSV</h3>
                                </div>
                                <div className="prose prose-sm max-w-none text-on-tertiary-container opacity-90" dangerouslySetInnerHTML={{ __html: infoMessage.replace(/\n/g, '<br />') }} />
                            </div>
                        )}
                    </div>
                );

            case 'mapping':
                return (
                    <div className="flex flex-col gap-6">
                        <InfoCard
                            title="Mappa le colonne"
                            description={`File: ${fileName} | Destinazione: ${targetClass === 'AUTO' ? 'Rilevamento Automatico' : targetClass}`}
                            icon="auto_awesome"
                            variant="primary"
                            className="!p-6 !rounded-[var(--md-sys-shape-corner-large)]"
                        />

                        <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant px-4">
                            Il sistema ha tentato di associare automaticamente le colonne. Verifica o correggi le associazioni.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <SelectField
                                id="map-cognome"
                                label="Colonna COGNOME"
                                value={columnMap.cognome}
                                onChange={e => setColumnMap(p => ({ ...p, cognome: e.target.value }))}
                            >
                                <option value="">Seleziona...</option>
                                {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                            </SelectField>
                            <SelectField
                                id="map-nome"
                                label="Colonna NOME"
                                value={columnMap.nome}
                                onChange={e => setColumnMap(p => ({ ...p, nome: e.target.value }))}
                            >
                                <option value="">Seleziona...</option>
                                {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                            </SelectField>
                            {targetClass === 'AUTO' && (
                                <div className="col-span-full">
                                    <SelectField
                                        id="map-classe"
                                        label="Colonna CLASSE"
                                        value={columnMap.classe}
                                        onChange={e => setColumnMap(p => ({ ...p, classe: e.target.value }))}
                                    >
                                        <option value="">Seleziona...</option>
                                        {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                                    </SelectField>
                                </div>
                            )}
                        </div>

                        <div>
                            <h4 className="m3-label-large uppercase text-primary font-bold mb-6 px-4">Anteprima Dati (Prime 3 righe)</h4>
                            <div className="overflow-x-auto border border-[var(--md-sys-color-outline-variant)]/30 rounded-[var(--md-sys-shape-corner-medium)]">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-[var(--md-sys-color-on-surface)]-variant bg-[var(--md-sys-color-surface-container-high)] uppercase font-bold">
                                        <tr>
                                            {csvHeaders.map(h => <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/10">
                                        {csvData.slice(0, 3).map((row, index) => (
                                            <tr key={index} className="bg-surface hover:bg-[var(--md-sys-color-surface-container-low)] transition-colors">
                                                {csvHeaders.map(h => <td key={h} className="px-4 py-3 whitespace-nowrap text-[var(--md-sys-color-on-surface)] font-medium">{row[h]}</td>)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case 'confirm':
                return (
                    <div className="flex flex-col gap-6">
                        <InfoCard
                            title="Conferma Importazione"
                            description={`Stai per importare ${studentsToImport.length} studenti. Gli studenti già presenti saranno ignorati.`}
                            icon="check_circle"
                            variant="secondary"
                            className="!p-6 !rounded-[var(--md-sys-shape-corner-large)]"
                        />

                        {targetClass === 'AUTO' && (
                            <div className="p-8 bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-medium)] border border-[var(--md-sys-color-outline-variant)]/30 text-sm flex gap-6 items-start">
                                <span className="material-symbols-outlined text-primary text-xl">info</span>
                                <div>
                                    <p className="font-bold mb-4 text-[var(--md-sys-color-on-surface)]">Nota Importante</p>
                                    <p className="text-[var(--md-sys-color-on-surface)]-variant">Gli studenti verranno assegnati alle classi indicate nel file. Se una classe nel file non esiste nelle tue Impostazioni, lo studente verrà comunque importato ma la classe sarà creata implicitamente.</p>
                                </div>
                            </div>
                        )}

                        <div className="overflow-y-auto max-h-[400px] border border-[var(--md-sys-color-outline-variant)]/30 rounded-[var(--md-sys-shape-corner-medium)] custom-scrollbar">
                            <table className="w-full text-sm text-left">
                                <thead className="sticky top-0 z-10 text-xs text-[var(--md-sys-color-on-surface)]-variant bg-[var(--md-sys-color-surface-container-high)] uppercase font-bold shadow-sm">
                                    <tr>
                                        <th className="px-4 py-3">Cognome</th>
                                        <th className="px-4 py-3">Nome</th>
                                        <th className="px-4 py-3">Classe</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10">
                                    {studentsToImport.map((student, index) => (
                                        <tr key={index} className="bg-surface hover:bg-[var(--md-sys-color-surface-container-low)] transition-colors">
                                            <td className="px-4 py-3 font-bold text-[var(--md-sys-color-on-surface)]">{student.cognome}</td>
                                            <td className="px-4 py-3 text-[var(--md-sys-color-on-surface)]">{student.nome}</td>
                                            <td className="px-4 py-3"><span className="px-4 py-0.5 rounded-full bg-primary-container text-on-primary-container font-black text-xs">{student.classe}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <M3Dialog
            onClose={onClose}
            title={step === 'upload' ? 'Importa Studenti' : step === 'mapping' ? 'Mappatura Colonne' : 'Conferma Importazione'}
            maxWidth="lg"
            level={1}
        >
            <M3DialogContent className="bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm">
                {renderContent()}
            </M3DialogContent>
            <M3DialogActions>
                {step === 'upload' && (
                    <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                )}
                {step === 'mapping' && (
                    <>
                        <M3Button type="button" onClick={() => { setStep('upload'); setInfoMessage(''); setError(''); }} variant="text">Indietro</M3Button>
                        <M3Button type="button" onClick={() => setStep('confirm')} disabled={!columnMap.cognome || !columnMap.nome || (targetClass === 'AUTO' && !columnMap.classe)} variant="filled">Avanti</M3Button>
                    </>
                )}
                {step === 'confirm' && (
                    <>
                        <M3Button type="button" onClick={() => setStep('mapping')} variant="text">Indietro</M3Button>
                        <M3Button type="button" onClick={handleImport} variant="filled">Importa Studenti</M3Button>
                    </>
                )}
            </M3DialogActions>
        </M3Dialog>
    );
};

export default ImportStudentsModal;


