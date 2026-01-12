import React, { useEffect, useState } from 'react';
import { errorLogger, ErrorLog } from '../services/errorLogger';

interface ErrorLogsDashboardProps {
  onClose?: () => void;
}

const ErrorLogsDashboard: React.FC<ErrorLogsDashboardProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [filterType, setFilterType] = useState<ErrorLog['type'] | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<ErrorLog['severity'] | 'all'>('all');
  const [stats, setStats] = useState(errorLogger.getErrorStats());

  useEffect(() => {
    const allLogs = errorLogger.getAllLogs();
    setLogs(allLogs.reverse());
    setStats(errorLogger.getErrorStats());
  }, []);

  const filteredLogs = logs.filter((log) => {
    const typeMatch = filterType === 'all' || log.type === filterType;
    const severityMatch = filterSeverity === 'all' || log.severity === filterSeverity;
    return typeMatch && severityMatch;
  });

  const handleExport = () => {
    const json = errorLogger.exportLogsAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    if (window.confirm('Sei sicuro di voler eliminare tutti i log?')) {
      errorLogger.clearAllLogs();
      setLogs([]);
      setStats(errorLogger.getErrorStats());
    }
  };

  const getSeverityColor = (severity: ErrorLog['severity']) => {
    switch (severity) {
      case 'error':
        return 'text-error bg-error/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'info':
        return 'text-primary bg-primary/10';
    }
  };

  const getTypeIcon = (type: ErrorLog['type']) => {
    const icons: Record<ErrorLog['type'], string> = {
      navigation: 'directions',
      ai: 'psychology',
      analytics: 'analytics',
      sync: 'sync',
      validation: 'verified_user',
      general: 'info',
    };
    return icons[type];
  };

  return (
    <div className="max-w-6xl" style={{ padding: "var(--md-sys-spacing-6)", marginLeft: "auto", marginRight: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--md-sys-spacing-6)" }}>
        <h1 className="m3-headline-medium">Error Logs Dashboard</h1>
        {onClose && (
          <button onClick={onClose} className="material-symbols-outlined text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)]" style={{ cursor: "pointer" }}>
            close
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="md:grid-cols-4" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-8)", marginBottom: "var(--md-sys-spacing-6)" }}>
        <div className="rounded-[var(--md-sys-shape-corner-medium)] bg-[var(--md-sys-color-surface-container)] border-[var(--md-sys-color-outline-variant)]" style={{ padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)" }}>
          <div className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Total Errors</div>
          <div className="m3-headline-medium" style={{ fontWeight: "bold", color: "var(--md-sys-color-primary)" }}>{stats.total}</div>
        </div>
        <div className="rounded-[var(--md-sys-shape-corner-medium)] bg-[var(--md-sys-color-surface-container)] border-[var(--md-sys-color-outline-variant)]" style={{ padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)" }}>
          <div className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Errors</div>
          <div className="m3-headline-medium" style={{ fontWeight: "bold", color: "var(--md-sys-color-error)" }}>{stats.bySeverity['error'] || 0}</div>
        </div>
        <div className="rounded-[var(--md-sys-shape-corner-medium)] bg-[var(--md-sys-color-surface-container)] border-[var(--md-sys-color-outline-variant)]" style={{ padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)" }}>
          <div className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Warnings</div>
          <div className="m3-headline-medium" style={{ fontWeight: "bold", color: "var(--md-sys-color-warning)" }}>{stats.bySeverity['warning'] || 0}</div>
        </div>
        <div className="rounded-[var(--md-sys-shape-corner-medium)] bg-[var(--md-sys-color-surface-container)] border-[var(--md-sys-color-outline-variant)]" style={{ padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)" }}>
          <div className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Infos</div>
          <div className="m3-headline-medium" style={{ fontWeight: "bold", color: "var(--md-sys-color-primary)" }}>{stats.bySeverity['info'] || 0}</div>
        </div>
      </div>

      {/* Type Breakdown */}
      <div style={{ marginBottom: "var(--md-sys-spacing-6)" }}>
        <h2 className="m3-title-medium" style={{ marginBottom: "var(--md-sys-spacing-6)" }}>By Type</h2>
        <div className="md:grid-cols-3" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-6)" }}>
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="rounded-[var(--md-sys-shape-corner-small)] bg-[var(--md-sys-color-surface-container-low)]" style={{ padding: "var(--md-sys-spacing-6)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                <span className="material-symbols-outlined m3-label-large">{getTypeIcon(type as ErrorLog['type'])}</span>
                <span style={{ textTransform: "capitalize" }}>{type}</span>
              </div>
              <div className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)]" style={{ fontWeight: "bold", color: "var(--md-sys-color-primary)", marginTop: "var(--md-sys-spacing-4)" }}>{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "var(--md-sys-spacing-6)", marginBottom: "var(--md-sys-spacing-6)", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "var(--md-sys-spacing-8)" }}>
          <label className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Tipo:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType((e.target as HTMLSelectElement).value as ErrorLog['type'] | 'all')}
            className="px-3 py-1 border-[var(--md-sys-color-outline-variant)]" style={{ borderRadius: "0.375rem", border: "1px solid var(--md-sys-color-outline)", backgroundColor: "var(--md-sys-color-surface)" }}
          >
            <option value="all">Tutti</option>
            <option value="navigation">Navigation</option>
            <option value="ai">AI</option>
            <option value="analytics">Analytics</option>
            <option value="sync">Sync</option>
            <option value="validation">Validation</option>
            <option value="general">General</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "var(--md-sys-spacing-8)" }}>
          <label className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">Severity:</label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity((e.target as HTMLSelectElement).value as ErrorLog['severity'] | 'all')}
            className="px-3 py-1 border-[var(--md-sys-color-outline-variant)]" style={{ borderRadius: "0.375rem", border: "1px solid var(--md-sys-color-outline)", backgroundColor: "var(--md-sys-color-surface)" }}
          >
            <option value="all">Tutti</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>

        <button
          onClick={handleExport}
          className="py-1 m3-label-large" style={{ paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderRadius: "0.375rem", backgroundColor: "var(--md-sys-color-primary)", color: "var(--md-sys-color-on-primary)", fontWeight: "500", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}
        >
          <span className="material-symbols-outlined m3-label-large">download</span>
          Export JSON
        </button>

        <button
          onClick={handleClearLogs}
          className="py-1 bg-error text-on-error m3-label-large" style={{ paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderRadius: "0.375rem", fontWeight: "500", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}
        >
          <span className="material-symbols-outlined m3-label-large">delete</span>
          Clear All
        </button>
      </div>

      {/* Logs Table */}
      <div className="rounded-[var(--md-sys-shape-corner-medium)] border-[var(--md-sys-color-outline-variant)] overflow-hidden" style={{ border: "1px solid var(--md-sys-color-outline)" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="m3-body-small" style={{ width: "100%" }}>
            <thead className="bg-[var(--md-sys-color-surface-container-high)]">
              <tr>
                <th className="font-semibold" style={{ textAlign: "left", padding: "var(--md-sys-spacing-6)" }}>Time</th>
                <th className="font-semibold" style={{ textAlign: "left", padding: "var(--md-sys-spacing-6)" }}>Type</th>
                <th className="font-semibold" style={{ textAlign: "left", padding: "var(--md-sys-spacing-6)" }}>Severity</th>
                <th className="font-semibold" style={{ textAlign: "left", padding: "var(--md-sys-spacing-6)" }}>Message</th>
                <th className="font-semibold" style={{ textAlign: "left", padding: "var(--md-sys-spacing-6)" }}>Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--md-sys-color-surface-container-low)]" style={{ transition: "color 300ms" }}>
                    <td className="m3-label-small" style={{ padding: "var(--md-sys-spacing-6)", whiteSpace: "nowrap" }}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: 'var(--md-sys-spacing-5)' }}>
                      <span className="py-1 bg-primary/10 m3-label-small" style={{ display: "inline-flex", alignItems: "center", gap: "var(--md-sys-spacing-4)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderRadius: "0.375rem", color: "var(--md-sys-color-primary)", fontWeight: "500" }}>
                        <span className="material-symbols-outlined m3-label-small">
                          {getTypeIcon(log.type)}
                        </span>
                        {log.type}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--md-sys-spacing-5)' }}>
                      <span className={`inline-flex items-center gap-4 px-4 py-1 rounded m3-label-small font-medium capitalize ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="max-w-xs overflow-hidden text-ellipsis" style={{ padding: "var(--md-sys-spacing-6)" }}>
                      <span title={log.message}>{log.message}</span>
                    </td>
                    <td style={{ padding: 'var(--md-sys-spacing-5)' }}>
                      {log.context && (
                        <details className="m3-label-small">
                          <summary className="hover:underline" style={{ cursor: "pointer", color: "var(--md-sys-color-primary)" }}>View</summary>
                          <pre className="bg-[var(--md-sys-color-surface-container-low)] m3-label-small max-h-24" style={{ marginTop: "var(--md-sys-spacing-4)", padding: "var(--md-sys-spacing-8)", borderRadius: "0.375rem", overflow: "auto" }}>
                            {JSON.stringify(log.context, null, 2)}
                          </pre>
                        </details>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-[var(--md-sys-color-on-surface)]-variant" style={{ padding: "var(--md-sys-spacing-6)", textAlign: "center" }}>
                    Nessun log trovato
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Most Recent Error */}
      {stats.mostRecent && (
        <div className="rounded-[var(--md-sys-shape-corner-medium)] bg-error/10 border-error/20" style={{ marginTop: "var(--md-sys-spacing-6)", padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)" }}>
          <div className="m3-body-small font-semibold" style={{ color: "var(--md-sys-color-error)", marginBottom: "var(--md-sys-spacing-8)" }}>Most Recent Error</div>
          <div className="m3-body-small">
            <div>
              <strong>Time:</strong> {new Date(stats.mostRecent.timestamp).toLocaleString()}
            </div>
            <div>
              <strong>Type:</strong> {stats.mostRecent.type}
            </div>
            <div>
              <strong>Message:</strong> {stats.mostRecent.message}
            </div>
            {stats.mostRecent.stack && (
              <details style={{ marginTop: "var(--md-sys-spacing-4)" }}>
                <summary className="hover:underline" style={{ cursor: "pointer", color: "var(--md-sys-color-primary)" }}>Stack Trace</summary>
                <pre className="bg-[var(--md-sys-color-surface-container-low)] m3-label-small max-h-32" style={{ marginTop: "var(--md-sys-spacing-4)", padding: "var(--md-sys-spacing-8)", borderRadius: "0.375rem", overflow: "auto" }}>
                  {stats.mostRecent.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorLogsDashboard;



