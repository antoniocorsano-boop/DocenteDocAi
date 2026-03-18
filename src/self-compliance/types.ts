// types.ts
// Tipi condivisi per Self-Compliance Engine

export type ComplianceMetrics = {
  totalActions: number;
  autonomousActions: number;
  approvedActions: number;
  blockedActions: number;
  highRiskActions: number;
  gdprViolations: number;
  avgDecisionTime: number;
  userOverrides: number;
  explainabilityCoverage: number;
};

export type SystemActivity = {
  timestamp: string;
  actionType: string;
  approved: boolean;
  riskLevel: "low" | "medium" | "high" | "critical";
  explainable: boolean;
  gdprViolation?: boolean;
  // ...altro
};

export type RiskAlert = {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: string;
};

export type ComplianceStatus = "compliant" | "warning" | "non_compliant";

export type ComplianceEvaluation = {
  complianceStatus: ComplianceStatus;
  issues: string[];
  recommendations: string[];
  requiredActions: string[];
  confidenceScore: number;
};

export type RiskDistribution = {
  riskLevel: "low" | "medium" | "high" | "critical";
  count: number;
};

export type ComplianceReport = {
  period: string;
  systemStatus: ComplianceStatus;
  metrics: ComplianceMetrics;
  incidents: string[];
  correctiveActions: string[];
  riskDistribution: RiskDistribution[];
  explainabilityScore: number;
};

export type AuditExport = {
  json: string;
  pdf?: string;
  apiUrl?: string;
};

export type OpenDataExport = {
  system: string;
  period: string;
  metrics: {
    automationRate: number;
    approvalRate: number;
    riskLevel: "low" | "medium" | "high" | "critical";
  };
};
