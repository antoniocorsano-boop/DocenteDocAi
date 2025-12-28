
import React, { useState, useCallback, useMemo } from 'react';
import { useFileDrop } from '../hooks/useFileDrop';
import { Studente, KnowledgeBaseEntry } from '../types';
import { parseCSVWithHeaders } from '../utils/csvUtils';
import { getGoogleAIClient } from '../services/aiClient';
import { M3Dialog, TabGroup, SelectField, InfoCard } from './M3Components';

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

    const processFileContent = useCallback((content: string, name: string) => {
        setFileName(name);
        setError('');
        setInfoMessage('');

        try {
            const { headers, data } = parseCSVWithHeaders(content);

            if (headers.length === 0 || data.length === 0) {
                throw new Error("Il file CSV è vuoto o non ha una riga di intestazione valida.");
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

        } catch (err: unknown) {
            let message = 'Errore durante l\'analisi del file.';
            if (err instanceof Error) message = err.message;
            console.error(err);
            setError(message);
            setStep('upload');
        }
    }, []);


    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setIsLoading(true);
        setError('');
        setInfoMessage('');
        const file = acceptedFiles[0];

        try {
                if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx')) {
                const ai = await getGoogleAIClient();
                const prompt = `
Sei un assistente AI amichevole e molto chiaro. Un utente ha caricato un file .xlsx, ma l'applicazione accetta solo file .csv. 
Genera una risposta in formato Markdown con istruzioni semplici e separate per Microsoft Excel e Google Sheets su come salvare il file in formato CSV.
Usa titoli e grassetto per chiarezza. Sii conciso e vai dritto al punto.
`;
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                setInfoMessage(response.text || '');
                setIsLoading(false);
                return;
            }

            if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                throw new Error("Tipo di file non supportato. Carica un file .csv o .xlsx.");
            }

            const fileContent = await file.text();
            processFileContent(fileContent, file.name);

        } catch (err: unknown) {
            let message = 'Errore durante l\'analisi del file.';
            if (err instanceof Error) message = err.message;
            console.error(err);
            setError(message);
            setStep('upload');
        } finally {
            setIsLoading(false);
        }
    }, [processFileContent]);

    const { getRootProps, getInputProps, isDragActive } = useFileDrop({
        onDrop,
        accept: 'text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        multiple: false,
        disabled: isLoading
    });

    const handleKbFileSelect = (entry: KnowledgeBaseEntry) => {
        if (!entry.content) {
            setError("Il file selezionato non ha contenuto testuale leggibile.");
            return;
        }
        processFileContent(entry.content, entry.fileName);
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

    const dialogButtons = useMemo(() => {
        if (step === 'upload') {
            return <button onClick={onClose} className="button button-text">Annulla</button>;
        }
        if (step === 'mapping') {
            return (
                <>
                    <button type="button" onClick={() => { setStep('upload'); setInfoMessage(''); setError(''); }} className="button button-text">Indietro</button>
                    <button type="button" onClick={() => setStep('confirm')} disabled={!columnMap.cognome || !columnMap.nome || (targetClass === 'AUTO' && !columnMap.classe)} className="button button-filled">Avanti</button>
                </>
            );
        }
        return (
            <>
                <button type="button" onClick={() => setStep('mapping')} className="button button-text">Indietro</button>
                <button type="button" onClick={handleImport} className="button button-filled">Importa Studenti</button>
            </>
        );
    }, [step, columnMap, targetClass, handleImport, onClose]);

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
                            {targetClass === 'AUTO' && <p className="text-[10px] text-on-surface-variant mt-1 px-2">Il file CSV deve contenere una colonna con il nome della classe (es. "1A", "2B").</p>}
                        </div>

                        <TabGroup
                            tabs={[{ id: 'file', label: 'Carica File' }, { id: 'kb', label: 'Da Knowledge Base' }]}
                            activeTab={importSource}
                            onTabChange={(id: string) => setImportSource(id as 'file' | 'kb')}
                            variant="secondary"
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
                                            className="button button-tonal !h-auto !py-2 !px-4 !text-xs"
                                        >
                                            <span className="material-symbols-outlined text-sm mr-2">download</span>
                                            Scarica Modello
                                        </a>
                                    }
                                    icon="description"
                                    variant="surface"
                                    className="!p-5 !rounded-2xl mb-4"
                                />

                                <div
                                    {...getRootProps()}
                                    className={`relative flex flex-col items-center justify-center p-8 h-48 rounded-[32px] border-2 border-dashed transition-all cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''} ${isDragActive ? 'border-primary bg-primary-container/10' : 'border-outline-variant/50 hover:border-primary/50 hover:bg-surface-container-high'}`}
                                >
                                    <input {...getInputProps()} />
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-5xl text-primary mb-4">{isDragActive ? 'download' : 'upload_file'}</span>
                                            <h3 className="m3-title-medium font-bold text-on-surface text-center">Trascina il file .csv o .xlsx qui</h3>
                                            <p className="m3-body-small opacity-60 mt-2 font-bold uppercase tracking-widest">o clicca per selezionare</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <p className="m3-label-small uppercase text-primary font-bold">Seleziona un file CSV dalla KB</p>
                                <div className="bg-surface-container-low rounded-[24px] max-h-[250px] overflow-y-auto p-2 border border-outline-variant/30 flex flex-col gap-1">
                                    {knowledgeBase.length > 0 ? (
                                        knowledgeBase.map(entry => (
                                            <div
                                                key={entry.id}
                                                onClick={() => handleKbFileSelect(entry)}
                                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-all cursor-pointer group"
                                            >
                                                <span className="material-symbols-outlined text-primary bg-primary-container/30 p-2 rounded-lg group-hover:bg-primary group-hover:text-on-primary transition-colors">description</span>
                                                <span className="text-sm font-bold truncate flex-grow text-on-surface">{entry.fileName}</span>
                                                <span className="material-symbols-outlined text-on-surface-variant opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">chevron_right</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center flex flex-col items-center gap-2 opacity-60">
                                            <span className="material-symbols-outlined text-3xl">folder_off</span>
                                            <p className="text-sm">Nessun file nella Knowledge Base.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-error-container text-on-error-container rounded-xl">
                                <span className="material-symbols-outlined">error</span>
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {infoMessage && (
                            <div className="p-5 bg-tertiary-container text-on-tertiary-container rounded-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined">lightbulb</span>
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
                            className="!p-6 !rounded-2xl"
                        />

                        <p className="m3-body-medium text-on-surface-variant px-2">
                            Il sistema ha tentato di associare automaticamente le colonne. Verifica o correggi le associazioni.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <h4 className="m3-label-large uppercase text-primary font-bold mb-3 px-2">Anteprima Dati (Prime 3 righe)</h4>
                            <div className="overflow-x-auto border border-outline-variant/30 rounded-xl">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-on-surface-variant bg-surface-container-high uppercase font-bold">
                                        <tr>
                                            {csvHeaders.map(h => <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/10">
                                        {csvData.slice(0, 3).map((row, index) => (
                                            <tr key={index} className="bg-surface hover:bg-surface-container-low transition-colors">
                                                {csvHeaders.map(h => <td key={h} className="px-4 py-3 whitespace-nowrap text-on-surface font-medium">{row[h]}</td>)}
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
                            className="!p-6 !rounded-2xl"
                        />

                        {targetClass === 'AUTO' && (
                            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 text-sm flex gap-3 items-start">
                                <span className="material-symbols-outlined text-primary text-xl">info</span>
                                <div>
                                    <p className="font-bold mb-1 text-on-surface">Nota Importante</p>
                                    <p className="text-on-surface-variant">Gli studenti verranno assegnati alle classi indicate nel file. Se una classe nel file non esiste nelle tue Impostazioni, lo studente verrà comunque importato ma la classe sarà creata implicitamente.</p>
                                </div>
                            </div>
                        )}

                        <div className="overflow-y-auto max-h-[400px] border border-outline-variant/30 rounded-xl custom-scrollbar">
                            <table className="w-full text-sm text-left">
                                <thead className="sticky top-0 z-10 text-xs text-on-surface-variant bg-surface-container-high uppercase font-bold shadow-sm">
                                    <tr>
                                        <th className="px-4 py-3">Cognome</th>
                                        <th className="px-4 py-3">Nome</th>
                                        <th className="px-4 py-3">Classe</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10">
                                    {studentsToImport.map((student, index) => (
                                        <tr key={index} className="bg-surface hover:bg-surface-container-low transition-colors">
                                            <td className="px-4 py-3 font-bold text-on-surface">{student.cognome}</td>
                                            <td className="px-4 py-3 text-on-surface">{student.nome}</td>
                                            <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-black text-xs">{student.classe}</span></td>
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
            isOpen={true}
            onClose={onClose}
            title={step === 'upload' ? 'Importa Studenti' : step === 'mapping' ? 'Mappatura Colonne' : 'Conferma Importazione'}
            headline={step !== 'upload' ? `Passo ${step === 'mapping' ? 2 : 3} di 3` : undefined}
            buttons={dialogButtons}
            fullscreen={false}
        >
            {renderContent()}
        </M3Dialog>
    );
};

export default ImportStudentsModal;
