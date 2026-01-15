// LEGACY - MD3 Non-compliant

import React, { useState } from 'react';
import { Report } from '../types';
import { saveAs } from '../utils/documentUtils';

import { M3IconButton } from './ui';

// M3Expressive: Refactored to use dedicated CSS classes with M3 tokens for report archive layout, search functionality, and table styling
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
        <div >
            <div >
                <div >
                    <h1 >Archivio Report</h1>
                    <p >Consulta, esporta e salva i report generati con l'AI.</p>
                </div>
            </div>
            <div >
                <div >
                    <div >
                        <span  aria-hidden="true">search</span>
                        <input 
                            type="text"
                            placeholder="Cerca report per nome o contesto..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            
                            aria-label="Cerca report per nome o contesto"
                        />
                    </div>
                </div>
                 <div >
                    <table >
                        <thead>
                            <tr>
                                <th>Nome Report</th>
                                <th>Data Creazione</th>
                                <th>Contesto</th>
                                <th>Modello Usato</th>
                                <th >Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map(report => (
                                <tr key={report.id}>
                                    <td>{report.nome}</td>
                                    <td>{new Date(report.dataCreazione).toLocaleDateString('it-IT')}</td>
                                    <td>{report.contesto.titolo}</td>
                                    <td>
                                        <span className={`archivio-report-chip ${report.modelloUsato.tipo === 'pdf' ? 'archivio-report-chip-pdf' : 'archivio-report-chip-other'}`}>
                                            {report.modelloUsato.nome}
                                        </span>
                                    </td>
                                    <td >
                                            <M3IconButton onClick={() => onSaveReportToKb(report)} title="Salva in Knowledge Base" ariaLabel="Salva report in Knowledge Base" icon="inventory_2" />
                                            <M3IconButton onClick={() => handleDownload(report)} title="Scarica" ariaLabel="Scarica report" icon="download" />
                                            <M3IconButton onClick={() => onDeleteReport(report.id)} title="Elimina" ariaLabel="Elimina report" icon="delete" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredReports.length === 0 && <p >{reportistica.length > 0 ? 'Nessun report corrisponde alla ricerca.' : 'Nessun report generato. Esportane uno da un progetto per vederlo qui.'}</p>}
            </div>
        </div>
    );
}

export default ArchivioReport;








