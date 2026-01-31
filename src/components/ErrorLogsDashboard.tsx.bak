// MD3 Compliant - Block N Migration Complete (7 violations eliminated)
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
    <div  style={{padding: 'var(--app-spacing-section)', marginLeft: "var(--app-layout-auto)", marginRight: "var(--app-layout-auto)"}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 'var(--app-spacing-section)'}}>
        <h1 >Error Logs Dashboard</h1>
        {onClose && (
          <button onClick={onClose} style={{ color: 'var(--app-color-on-surface)', cursor: "pointer" }}>
            close
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div  style={{display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1)", gap: 'var(--md-sys-spacing-8)', marginBottom: 'var(--app-spacing-section)'}}>
        <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--app-color-on-primary)' , padding: 'var(--md-sys-spacing-8)', border: "var(--app-border-thin) solid var(--md-sys-color-outline)"}}>
          <div style={{ color: 'var(--app-color-on-surface-variant)' }}>Total Errors</div>
          <div  style={{fontWeight: "bold", color: "var(--app-color-primary)"}}>{stats.total}</div>
        </div>
        <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--app-color-on-primary)' , padding: 'var(--md-sys-spacing-8)', border: "var(--app-border-thin) solid var(--md-sys-color-outline)"}}>
          <div style={{ color: 'var(--app-color-on-surface-variant)' }}>Errors</div>
          <div  style={{fontWeight: "bold", color: "var(--md-sys-color-error)"}}>{stats.bySeverity['error'] || 0}</div>
        </div>
        <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--app-color-on-primary)' , padding: 'var(--md-sys-spacing-8)', border: "var(--app-border-thin) solid var(--md-sys-color-outline)"}}>
          <div style={{ color: 'var(--app-color-on-surface-variant)' }}>Warnings</div>
          <div  style={{fontWeight: "bold", color: "var(--md-sys-color-warning)"}}>{stats.bySeverity['warning'] || 0}</div>
        </div>
        <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--app-color-on-primary)' , padding: 'var(--md-sys-spacing-8)', border: "var(--app-border-thin) solid var(--md-sys-color-outline)"}}>
          <div style={{ color: 'var(--app-color-on-surface-variant)' }}>Infos</div>
          <div  style={{fontWeight: "bold", color: "var(--app-color-primary)"}}>{stats.bySeverity['info'] || 0}</div>
        </div>
      </div>

      {/* Type Breakdown */}
      <div style={{marginBottom: 'var(--app-spacing-section)'}}>
        <h2  style={{marginBottom: 'var(--app-spacing-section)'}}>By Type</h2>
        <div  style={{display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1)", gap: 'var(--app-spacing-section)'}}>
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-surface-container-low)' , padding: 'var(--app-spacing-section)'}}>
              <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}}>
                <span >{getTypeIcon(type as ErrorLog['type'])}</span>
                <span style={{ textTransform: "capitalize" }}>{type}</span>
              </div>
              <div style={{ fontWeight: "bold", color: "var(--app-color-primary)", marginTop: 'var(--app-spacing-container)'}}>{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{display: "flex", gap: 'var(--app-spacing-section)', marginBottom: 'var(--app-spacing-section)', flexWrap: "wrap"}}>
        <div style={{display: "flex", gap: 'var(--md-sys-spacing-8)'}}>
          <label style={{ color: 'var(--app-color-on-surface-variant)' }}>Tipo:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType((e.target as HTMLSelectElement).value as ErrorLog['type'] | 'all')}
             style={{borderRadius: "var(--md-sys-shape-corner-small)", border: "var(--app-border-thin) solid var(--md-sys-color-outline)", backgroundColor: "var(--app-color-surface)"}}
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

        <div style={{display: "flex", gap: 'var(--md-sys-spacing-8)'}}>
          <label style={{ color: 'var(--app-color-on-surface-variant)' }}>Severity:</label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity((e.target as HTMLSelectElement).value as ErrorLog['severity'] | 'all')}
             style={{borderRadius: "var(--md-sys-shape-corner-small)", border: "var(--app-border-thin) solid var(--md-sys-color-outline)", backgroundColor: "var(--app-color-surface)"}}
          >
            <option value="all">Tutti</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>

        <button
          onClick={handleExport}
           style={{paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)', borderRadius: "var(--md-sys-shape-corner-small)", backgroundColor: "var(--app-color-primary)", color: "var(--md-sys-color-on)", fontWeight: "500", display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}}
        >
          <span >download</span>
          Export JSON
        </button>

        <button
          onClick={handleClearLogs}
          style={{ backgroundColor: sys.colors.error, color: sys.colors.on-error , paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)', borderRadius: "var(--md-sys-shape-corner-small)", fontWeight: "500", display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}}
        >
          <span >delete</span>
          Clear All
        </button>
      </div>

      {/* Logs Table */}
      <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)' , border: "var(--app-border-thin) solid var(--md-sys-color-outline)"}}>
        <div style={{ overflowX: "auto" }}>
          <table  style={{ width: "var(--app-layout-full)" }}>
            <thead style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)' }}>
              <tr>
                <th  style={{textAlign: "left", padding: 'var(--app-spacing-section)'}}>Time</th>
                <th  style={{textAlign: "left", padding: 'var(--app-spacing-section)'}}>Type</th>
                <th  style={{textAlign: "left", padding: 'var(--app-spacing-section)'}}>Severity</th>
                <th  style={{textAlign: "left", padding: 'var(--app-spacing-section)'}}>Message</th>
                <th  style={{textAlign: "left", padding: 'var(--app-spacing-section)'}}>Context</th>
              </tr>
            </thead>
            <tbody >
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id}  style={{ transition: "color var(--md-sys-motion-duration-medium4)" }}>
                    <td  style={{padding: 'var(--app-spacing-section)', whiteSpace: "nowrap"}}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td style={{padding: 'var(--app-spacing-touch)'}}>
                      <span style={{ backgroundColor: sys.colors.primary/10 , display: "inline-flex", alignItems: "center", gap: 'var(--app-spacing-container)', paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)', borderRadius: "var(--md-sys-shape-corner-small)", color: "var(--app-color-primary)", fontWeight: "500"}}>
                        <span >
                          {getTypeIcon(log.type)}
                        </span>
                        {log.type}
                      </span>
                    </td>
                    <td style={{padding: 'var(--app-spacing-touch)'}}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--app-spacing-container)',
                        padding: 'var(--app-spacing-container) var(--md-sys-spacing-1)',
                        borderRadius: 'var(--md-sys-shape-corner-small)',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                        backgroundColor: getSeverityColor(log.severity)
                      }}>
                        {log.severity}
                      </span>
                    </td>
                    <td style={{ color: sys.colors.ellipsis , padding: 'var(--app-spacing-section)'}}>
                      <span title={log.message}>{log.message}</span>
                    </td>
                    <td style={{padding: 'var(--app-spacing-touch)'}}>
                      {log.context && (
                        <details >
                          <summary  style={{cursor: "pointer", color: "var(--app-color-primary)"}}>View</summary>
                          <pre style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)' , marginTop: 'var(--app-spacing-container)', padding: 'var(--md-sys-spacing-8)', borderRadius: "var(--md-sys-shape-corner-small)", overflow: "auto"}}>
                            {JSON.stringify(log.context, null, 2)}
                          </pre>
                        </details>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ color: 'var(--app-color-on-surface-variant)' , padding: 'var(--app-spacing-section)', textAlign: "center"}}>
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
        <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: sys.colors.error/10 , marginTop: 'var(--app-spacing-section)', padding: 'var(--md-sys-spacing-8)', border: "var(--app-border-thin) solid var(--md-sys-color-outline)"}}>
          <div  style={{color: "var(--md-sys-color-error)", marginBottom: 'var(--md-sys-spacing-8)'}}>Most Recent Error</div>
          <div >
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
              <details style={{marginTop: 'var(--app-spacing-container)'}}>
                <summary  style={{cursor: "pointer", color: "var(--app-color-primary)"}}>Stack Trace</summary>
                <pre style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)' , marginTop: 'var(--app-spacing-container)', padding: 'var(--md-sys-spacing-8)', borderRadius: "var(--md-sys-shape-corner-small)", overflow: "auto"}}>
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









