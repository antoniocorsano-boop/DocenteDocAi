// ComplianceAgent.ts
// Agente orchestratore per Self-Compliance Engine

import { collectMetrics } from "./metricsCollector";
import { monitorRisks } from "./riskMonitor";
import { evaluateCompliance } from "./complianceBrain";
import { generateComplianceReport } from "./reportGenerator";
import { exportAuditPackage } from "./auditExporter";
import { publishOpenData } from "./openDataPublisher";
import type { SystemActivity, ComplianceReport, AuditExport, OpenDataExport } from "./types";

export class ComplianceAgent {
  private activityLog: SystemActivity[] = [];


  logActivity(activity: SystemActivity): void {
    this.activityLog.push(activity);
  }


  runComplianceCycle(period: string): ComplianceReport {
    const metrics = collectMetrics(this.activityLog);
    const risks = monitorRisks(this.activityLog);
    const evaluation = evaluateCompliance(metrics, risks);
    const report = generateComplianceReport(period, metrics, evaluation);
    return report;
  }


  exportAudit(report: ComplianceReport): AuditExport {
    return exportAuditPackage(report);
  }


  publishOpenData(period: string, metrics: import("./types").ComplianceMetrics): OpenDataExport {
    return publishOpenData(period, metrics);
  }
}
