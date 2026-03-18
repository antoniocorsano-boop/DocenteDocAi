// auditExporter.ts
// Esporta pacchetti auditabili (PDF, JSON, API)

import type { AuditExport, ComplianceReport } from "./types";

export function exportAuditPackage(report: ComplianceReport): AuditExport {
  // TODO: implementazione reale
  return {
    json: JSON.stringify(report, null, 2),
    pdf: undefined, // Da implementare
    apiUrl: undefined,
  };
}
