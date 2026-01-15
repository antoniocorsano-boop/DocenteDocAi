// LEGACY - MD3 Non-compliant
import React, { useEffect, useState } from 'react';
import { errorLogger, ErrorLog } from '../services/errorLogger';
import { useTheme } from '../theme/theme';

interface ErrorLogsDashboardProps {
  onClose?: () => void;
}

const ErrorLogsDashboard: React.FC<ErrorLogsDashboardProps> = ({ onClose }) => {
  const { layers } = useTheme();
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [filterType, setFilterType] = useState<ErrorLog['type] | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<ErrorLog['severity] | 'all'>('all');
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

  const getSeverityColor = (severity: ErrorLog['severity]) => {
    switch (severity) {
      case 'error':
        return 'text-error bg-error/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'info':
        return 'text-primary bg-primary/10';
    }
  };

  const getTypeIcon = (type: ErrorLog['type]) => {
    const icons: Record<ErrorLog['type], string> = {
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
    <div  style={{padding: layers.ref.spacing['6'], marginLeft: "auto", marginRight: "auto"}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: layers.ref.spacing['6']}}>
        <h1 >Error Logs Dashboard</h1>
        {onClose && (
          <button onClick={onClose} style={{ color: sys.colors.[var(--md-sys-typescale-headline-small)] }} style={{ cursor: "pointer" }}>
            close
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['8'], marginBottom: layers.ref.spacing['6']}}>
        <div style={{ borderRadius: layers.ref.shape.corner.large, backgroundColor:  layers.sys.color.onPrimary }} style={{padding: layers.ref.spacing['8'], border: "1px solid layers.sys.color.outline"}}>
          <div style={{ color:  layers.sys.color.onSurfaceVariant }}>Total Errors</div>
          <div  style={{fontWeight: "bold", color: "layers.sys.color.primary"}}>{stats.total}</div>
        </div>
        <div style={{ borderRadius: layers.ref.shape.corner.large, backgroundColor:  layers.sys.color.onPrimary }} style={{padding: layers.ref.spacing['8'], border: "1px solid layers.sys.color.outline"}}>
          <div style={{ color:  layers.sys.color.onSurfaceVariant }}>Errors</div>
          <div  style={{fontWeight: "bold", color: "layers.sys.color.error"}}>{stats.bySeverity['error] || 0}</div>
        </div>
        <div style={{ borderRadius: layers.ref.shape.corner.large, backgroundColor:  layers.sys.color.onPrimary }} style={{padding: layers.ref.spacing['8'], border: "1px solid layers.sys.color.outline"}}>
          <div style={{ color:  layers.sys.color.onSurfaceVariant }}>Warnings</div>
          <div  style={{fontWeight: "bold", color: "layers.sys.color.warning"}}>{stats.bySeverity['warning] || 0}</div>
        </div>
        <div style={{ borderRadius: layers.ref.shape.corner.large, backgroundColor:  layers.sys.color.onPrimary }} style={{padding: layers.ref.spacing['8'], border: "1px solid layers.sys.color.outline"}}>
          <div style={{ color:  layers.sys.color.onSurfaceVariant }}>Infos</div>
          <div  style={{fontWeight: "bold", color: "layers.sys.color.primary"}}>{stats.bySeverity['info] || 0}</div>
        </div>
      </div>

      {/* Type Breakdown */}
      <div style={{marginBottom: layers.ref.spacing['6']}}>
        <h2  style={{marginBottom: layers.ref.spacing['6']}}>By Type</h2>
        <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['6']}}>
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} style={{ borderRadius: layers.ref.shape.corner.large, backgroundColor:  layers.sys.color.surfaceContainerLow }} style={{padding: layers.ref.spacing['6']}}>
              <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                <span >{getTypeIcon(type as ErrorLog['type])}</span>
                <span style={{ textTransform: "capitalize" }}>{type}</span>
              </div>
              <div style={{ color: sys.colors.[var(--md-sys-typescale-headline-small)] }} style={{fontWeight: "bold", color: "layers.sys.color.primary", marginTop: layers.ref.spacing['4']}}>{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{display: "flex", gap: layers.ref.spacing['6'], marginBottom: layers.ref.spacing['6'], flexWrap: "wrap"}}>
        <div style={{display: "flex", gap: layers.ref.spacing['8']}}>
          <label style={{ color:  layers.sys.color.onSurfaceVariant }}>Tipo:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType((e.target as HTMLSelectElement).value as ErrorLog['type] | 'all')}
             style={{borderRadius: "0.375rem", border: "1px solid layers.sys.color.outline", backgroundColor: "layers.sys.color.surface"}}
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

        <div style={{display: "flex", gap: layers.ref.spacing['8']}}>
          <label style={{ color:  layers.sys.color.onSurfaceVariant }}>Severity:</label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity((e.target as HTMLSelectElement).value as ErrorLog['severity] | 'all')}
             style={{borderRadius: "0.375rem", border: "1px solid layers.sys.color.outline", backgroundColor: "layers.sys.color.surface"}}
          >
            <option value="all">Tutti</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>

        <button
          onClick={handleExport}
           style={{paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderRadius: "0.375rem", backgroundColor: "layers.sys.color.primary", color: "layers.sys.color.on-primary", fontWeight: "500", display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}
        >
          <span >download</span>
          Export JSON
        </button>

        <button
          onClick={handleClearLogs}
          style={{ backgroundColor: sys.colors.error, color: sys.colors.on-error }} style={{paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderRadius: "0.375rem", fontWeight: "500", display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}
        >
          <span >delete</span>
          Clear All
        </button>
      </div>

      {/* Logs Table */}
      <div style={{ borderRadius: layers.ref.shape.corner.large }} style={{border: "1px solid layers.sys.color.outline"}}>
        <div style={{ overflowX: "auto" }}>
          <table  style={{ width: "100%" }}>
            <thead style={{ backgroundColor:  layers.sys.color.surfaceContainerHigh }}>
              <tr>
                <th  style={{textAlign: "left", padding: layers.ref.spacing['6']}}>Time</th>
                <th  style={{textAlign: "left", padding: layers.ref.spacing['6']}}>Type</th>
                <th  style={{textAlign: "left", padding: layers.ref.spacing['6']}}>Severity</th>
                <th  style={{textAlign: "left", padding: layers.ref.spacing['6']}}>Message</th>
                <th  style={{textAlign: "left", padding: layers.ref.spacing['6']}}>Context</th>
              </tr>
            </thead>
            <tbody >
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id}  style={{ transition: "color 300ms" }}>
                    <td  style={{padding: layers.ref.spacing['6'], whiteSpace: "nowrap"}}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td style={{padding: layers.ref.spacing['5']}}>
                      <span style={{ backgroundColor: sys.colors.primary/10 }} style={{display: "inline-flex", alignItems: "center", gap: layers.ref.spacing['4'], paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderRadius: "0.375rem", color: "layers.sys.color.primary", fontWeight: "500"}}>
                        <span >
                          {getTypeIcon(log.type)}
                        </span>
                        {log.type}
                      </span>
                    </td>
                    <td style={{padding: layers.ref.spacing['5']}}>
                      <span className={`inline-flex items-center gap-4 px-4 py-1 rounded m3-label-small font-medium capitalize ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td style={{ color: sys.colors.ellipsis }} style={{padding: layers.ref.spacing['6']}}>
                      <span title={log.message}>{log.message}</span>
                    </td>
                    <td style={{padding: layers.ref.spacing['5']}}>
                      {log.context && (
                        <details >
                          <summary  style={{cursor: "pointer", color: "layers.sys.color.primary"}}>View</summary>
                          <pre style={{ backgroundColor:  layers.sys.color.surfaceContainerLow }} style={{marginTop: layers.ref.spacing['4'], padding: layers.ref.spacing['8'], borderRadius: "0.375rem", overflow: "auto"}}>
                            {JSON.stringify(log.context, null, 2)}
                          </pre>
                        </details>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ color:  layers.sys.color.onSurfaceVariant }} style={{padding: layers.ref.spacing['6'], textAlign: "center"}}>
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
        <div style={{ borderRadius: layers.ref.shape.corner.large, backgroundColor: sys.colors.error/10 }} style={{marginTop: layers.ref.spacing['6'], padding: layers.ref.spacing['8'], border: "1px solid layers.sys.color.outline"}}>
          <div  style={{color: "layers.sys.color.error", marginBottom: layers.ref.spacing['8']}}>Most Recent Error</div>
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
              <details style={{marginTop: layers.ref.spacing['4']}}>
                <summary  style={{cursor: "pointer", color: "layers.sys.color.primary"}}>Stack Trace</summary>
                <pre style={{ backgroundColor:  layers.sys.color.surfaceContainerLow }} style={{marginTop: layers.ref.spacing['4'], padding: layers.ref.spacing['8'], borderRadius: "0.375rem", overflow: "auto"}}>
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








