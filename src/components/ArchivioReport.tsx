
import React, { useState } from 'react';
import { Report } from '../types';
import { saveAs } from '../utils/documentUtils';

import M3IconButton from './M3IconButton';

interface ArchivioReportProps {
    reportistica: Report[];
    onDeleteReport: (reportId: string) => void;
    onSaveReportToKb: (report: Report) => void;
}

const ArchivioReport: React.FC<ArchivioReportProps> = ({ reportistica, onDeleteReport, onSaveReportToKb }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredReports = reportistica.filter(r => 
        r.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.contesto.titolo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleDownload = (report: Report) => {
        const byteCharacters = atob(report.file.content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: report.file.mimeType });
        saveAs(blob, report.file.name);
    };

    return (
        <div className="space-y-4">
            <div className="page-header-compact">
                <div className="page-header-title-group">
                    <h1 className="m3-headline-medium">Archivio Report</h1>
                    <p className="page-subtitle">Consulta, esporta e salva i report generati con l'AI.</p>
                </div>
            </div>
            <div className="card">
                <div className="p-4">
                    <div className="search-input-container max-w-lg">
                        <span className="material-symbols-outlined">search</span>
                        <input 
                            type="text"
                            placeholder="Cerca report per nome o contesto..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
                 <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nome Report</th>
                                <th>Data Creazione</th>
                                <th>Contesto</th>
                                <th>Modello Usato</th>
                                <th className="text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map(report => (
                                <tr key={report.id}>
                                    <td>{report.nome}</td>
                                    <td>{new Date(report.dataCreazione).toLocaleDateString('it-IT')}</td>
                                    <td>{report.contesto.titolo}</td>
                                    <td>
                                        <span className={`chip m3-label-small border-none ${report.modelloUsato.tipo === 'pdf' ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'}`}>
                                            {report.modelloUsato.nome}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                            <M3IconButton onClick={() => onSaveReportToKb(report)} title="Salva in Knowledge Base" icon={<span className="material-symbols-outlined">inventory_2</span>} />
                                            <M3IconButton onClick={() => handleDownload(report)} title="Scarica" icon={<span className="material-symbols-outlined">download</span>} />
                                            <M3IconButton onClick={() => onDeleteReport(report.id)} title="Elimina" icon={<span className="material-symbols-outlined text-error">delete</span>} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredReports.length === 0 && <p className="text-center p-4 text-on-surface-variant">{reportistica.length > 0 ? 'Nessun report corrisponde alla ricerca.' : 'Nessun report generato. Esportane uno da un progetto per vederlo qui.'}</p>}
            </div>
        </div>
    );
}

export default ArchivioReport;
